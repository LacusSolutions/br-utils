'use strict'

const IN_PROGRESS = 'In progress'
const DONE = 'Done'
const RESET_STATUSES = new Set(['Backlog', 'Ready'])
const FIELD_STATUS = 'Status'
const FIELD_START = 'Start date'
const FIELD_END = 'End date'

const GRAPHQL_URL = 'https://api.github.com/graphql'

const PROJECT_QUERY = `
query($owner: String!, $number: Int!, $cursor: String) {
  organization(login: $owner) {
    projectV2(number: $number) {
      id
      title
      fields(first: 50) {
        nodes {
          ... on ProjectV2FieldCommon { id name dataType }
        }
      }
      items(first: 50, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          statusValue: fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
          startDateValue: fieldValueByName(name: "Start date") {
            ... on ProjectV2ItemFieldDateValue { date }
          }
          endDateValue: fieldValueByName(name: "End date") {
            ... on ProjectV2ItemFieldDateValue { date }
          }
          content {
            __typename
            ... on DraftIssue { title }
            ... on Issue {
              id
              number
              title
              repository { nameWithOwner }
              timelineItems(first: 100, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
                pageInfo { hasNextPage endCursor }
                nodes {
                  ... on ProjectV2ItemStatusChangedEvent {
                    createdAt
                    previousStatus
                    status
                    project { id }
                  }
                }
              }
            }
            ... on PullRequest {
              id
              number
              title
              repository { nameWithOwner }
              timelineItems(first: 100, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
                pageInfo { hasNextPage endCursor }
                nodes {
                  ... on ProjectV2ItemStatusChangedEvent {
                    createdAt
                    previousStatus
                    status
                    project { id }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

const TIMELINE_QUERY = `
query($id: ID!, $cursor: String) {
  node(id: $id) {
    ... on Issue {
      timelineItems(first: 100, after: $cursor, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on ProjectV2ItemStatusChangedEvent {
            createdAt
            previousStatus
            status
            project { id }
          }
        }
      }
    }
    ... on PullRequest {
      timelineItems(first: 100, after: $cursor, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on ProjectV2ItemStatusChangedEvent {
            createdAt
            previousStatus
            status
            project { id }
          }
        }
      }
    }
  }
}
`

const SET_DATE_MUTATION = `
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { date: $date }
    }
  ) { projectV2Item { id } }
}
`

const CLEAR_DATE_MUTATION = `
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!) {
  clearProjectV2ItemFieldValue(
    input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId }
  ) { projectV2Item { id } }
}
`

function toUtcDate(iso) {
  if (typeof iso !== 'string' || iso.length < 10) {
    throw new Error(`Invalid timestamp: ${iso}`)
  }
  const date = iso.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid timestamp: ${iso}`)
  }
  return date
}

function isResetStatus(name) {
  return name == null || name === '' || RESET_STATUSES.has(name)
}

function replayDesiredDates(currentStatus, events) {
  let start = null
  let end = null

  for (const event of events) {
    const to = event.status
    if (isResetStatus(to)) {
      start = null
      end = null
    } else if (to === IN_PROGRESS) {
      start = toUtcDate(event.createdAt)
      end = null
    } else if (to === DONE) {
      end = toUtcDate(event.createdAt)
    } else if (event.previousStatus === DONE) {
      end = null
    }
  }

  if (isResetStatus(currentStatus)) {
    return { start: null, end: null }
  }

  if (currentStatus === IN_PROGRESS) {
    return { start: start || undefined, end: null }
  }

  if (currentStatus === DONE) {
    return { start: start || undefined, end: end || undefined }
  }

  return { start: start || undefined, end: null }
}

function isAbsent(value) {
  return value == null || value === ''
}

function planWrites({
  currentStart,
  currentEnd,
  desiredStart,
  desiredEnd,
  startFieldId,
  endFieldId,
}) {
  const ops = []
  const currentStartValue = isAbsent(currentStart) ? null : currentStart
  const currentEndValue = isAbsent(currentEnd) ? null : currentEnd

  if (desiredStart !== undefined) {
    if (desiredStart != null && desiredStart !== currentStartValue) {
      ops.push({
        op: 'set',
        fieldId: startFieldId,
        fieldName: FIELD_START,
        date: desiredStart,
      })
    } else if (desiredStart == null && currentStartValue != null) {
      ops.push({
        op: 'clear',
        fieldId: startFieldId,
        fieldName: FIELD_START,
      })
    }
  }

  if (desiredEnd !== undefined) {
    if (desiredEnd != null && desiredEnd !== currentEndValue) {
      ops.push({
        op: 'set',
        fieldId: endFieldId,
        fieldName: FIELD_END,
        date: desiredEnd,
      })
    } else if (desiredEnd == null && currentEndValue != null) {
      ops.push({
        op: 'clear',
        fieldId: endFieldId,
        fieldName: FIELD_END,
      })
    }
  }

  return ops
}

function isDryRun(value) {
  return value === true || value === 'true'
}

function requireField(fields, name, dataType) {
  const field = fields.find((node) => {
    if (!node || node.name !== name) {
      return false
    }
    return !dataType || node.dataType === dataType
  })
  if (!field) {
    const typeLabel = dataType ? `${dataType} ` : ''
    throw new Error(`Project is missing ${typeLabel}field "${name}"`)
  }
  return field
}

async function graphql(token, query, variables) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = await response.json()
  if (payload.errors) {
    throw new Error(JSON.stringify(payload.errors))
  }
  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status}: ${JSON.stringify(payload)}`)
  }
  return payload.data
}

function collectTimelineNodes(connection, projectId) {
  if (!connection || !Array.isArray(connection.nodes)) {
    return []
  }
  return connection.nodes.filter((event) => event && event.project && event.project.id === projectId)
}

async function loadAllTimelineEvents(token, content, projectId) {
  const events = collectTimelineNodes(content.timelineItems, projectId)
  let pageInfo = content.timelineItems && content.timelineItems.pageInfo

  while (pageInfo && pageInfo.hasNextPage) {
    const data = await graphql(token, TIMELINE_QUERY, {
      id: content.id,
      cursor: pageInfo.endCursor,
    })
    const connection = data.node && data.node.timelineItems
    events.push(...collectTimelineNodes(connection, projectId))
    pageInfo = connection && connection.pageInfo
  }

  events.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return events
}

function itemLabel(item) {
  const content = item.content
  if (!content) {
    return item.id
  }
  if (content.repository && content.number != null) {
    return `${content.repository.nameWithOwner}#${content.number}`
  }
  return content.title || item.id
}

function isIssueOrPullRequest(content) {
  return content && (content.__typename === 'Issue' || content.__typename === 'PullRequest')
}

async function loadProject(token, owner, number) {
  let cursor = null
  let project = null
  const items = []

  do {
    const data = await graphql(token, PROJECT_QUERY, { owner, number, cursor })
    const page = data.organization && data.organization.projectV2
    if (!page) {
      throw new Error(`Organization project not found: ${owner}/${number}`)
    }
    if (!project) {
      project = page
    }
    items.push(...(page.items.nodes || []))
    cursor = page.items.pageInfo.hasNextPage ? page.items.pageInfo.endCursor : null
  } while (cursor)

  return { project, items }
}

async function applyOp(token, projectId, itemId, op, dryRun) {
  const suffix = op.op === 'set' ? `${op.fieldName}=${op.date}` : `clear ${op.fieldName}`
  if (dryRun) {
    console.log(`dry-run ${itemId} ${suffix}`)
    return
  }

  if (op.op === 'set') {
    await graphql(token, SET_DATE_MUTATION, {
      projectId,
      itemId,
      fieldId: op.fieldId,
      date: op.date,
    })
    return
  }

  await graphql(token, CLEAR_DATE_MUTATION, {
    projectId,
    itemId,
    fieldId: op.fieldId,
  })
}

function readStatus(item) {
  return (item.statusValue && item.statusValue.name) || null
}

function readDate(item, key) {
  return (item[key] && item[key].date) || null
}

async function main() {
  const token = process.env.PROJECTS_TOKEN
  if (!token) {
    throw new Error('PROJECTS_TOKEN is required')
  }

  const owner = process.env.PROJECT_OWNER || 'LacusSolutions'
  const number = Number.parseInt(process.env.PROJECT_NUMBER || '1', 10)
  const dryRun = isDryRun(process.env.DRY_RUN)

  const { project, items } = await loadProject(token, owner, number)
  const fields = (project.fields && project.fields.nodes) || []
  const startField = requireField(fields, FIELD_START, 'DATE')
  const endField = requireField(fields, FIELD_END, 'DATE')

  console.log(`project=${project.title} id=${project.id} items=${items.length} dryRun=${dryRun}`)

  const summary = {
    items: items.length,
    skipped: 0,
    updated: 0,
    unchanged: 0,
    errors: 0,
  }
  const errors = []

  for (const item of items) {
    const label = itemLabel(item)
    try {
      const content = item.content
      if (!isIssueOrPullRequest(content)) {
        console.log(`skip draft ${label}`)
        summary.skipped += 1
        continue
      }

      const status = readStatus(item)
      const currentStart = readDate(item, 'startDateValue')
      const currentEnd = readDate(item, 'endDateValue')
      const events = await loadAllTimelineEvents(token, content, project.id)
      const desired = replayDesiredDates(status, events)
      const writes = planWrites({
        currentStart,
        currentEnd,
        desiredStart: desired.start,
        desiredEnd: desired.end,
        startFieldId: startField.id,
        endFieldId: endField.id,
      })

      if (writes.length === 0) {
        summary.unchanged += 1
        continue
      }

      for (const op of writes) {
        await applyOp(token, project.id, item.id, op, dryRun)
      }
      console.log(`updated ${label} ${JSON.stringify(writes)}`)
      summary.updated += 1
    } catch (error) {
      summary.errors += 1
      errors.push({ label, error: error.message || String(error) })
      console.error(`error ${label}: ${error.message || error}`)
    }
  }

  console.log(
    `items=${summary.items} skipped=${summary.skipped} updated=${summary.updated} unchanged=${summary.unchanged} errors=${summary.errors}`,
  )

  if (errors.length > 0) {
    process.exitCode = 1
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = {
  RESET_STATUSES,
  IN_PROGRESS,
  DONE,
  toUtcDate,
  isResetStatus,
  replayDesiredDates,
  planWrites,
}
