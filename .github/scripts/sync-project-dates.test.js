'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const {
  DONE,
  IN_PROGRESS,
  toUtcDate,
  isResetStatus,
  replayDesiredDates,
  planWrites,
  itemUrl,
  describeOp,
  formatChangeMarkdown,
  buildJobSummary,
} = require('./sync-project-dates')

function event(createdAt, previousStatus, status) {
  return { createdAt, previousStatus, status }
}

describe('toUtcDate', () => {
  it('extracts the UTC calendar date', () => {
    assert.equal(toUtcDate('2026-03-09T01:28:54Z'), '2026-03-09')
  })

  it('does not shift a late UTC timestamp to the next local day', () => {
    assert.equal(toUtcDate('2026-03-09T23:30:00Z'), '2026-03-09')
  })

  it('throws on missing or invalid values', () => {
    assert.throws(() => toUtcDate(null), /Invalid timestamp/)
    assert.throws(() => toUtcDate('nope'), /Invalid timestamp/)
  })
})

describe('isResetStatus', () => {
  it('treats Backlog, Ready, and empty values as reset', () => {
    assert.equal(isResetStatus('Backlog'), true)
    assert.equal(isResetStatus('Ready'), true)
    assert.equal(isResetStatus(null), true)
    assert.equal(isResetStatus(undefined), true)
    assert.equal(isResetStatus(''), true)
    assert.equal(isResetStatus(IN_PROGRESS), false)
    assert.equal(isResetStatus(DONE), false)
  })
})

describe('replayDesiredDates', () => {
  it('Ready with no events clears both dates', () => {
    assert.deepEqual(replayDesiredDates('Ready', []), { start: null, end: null })
  })

  it('sets Start date on the first move to In progress', () => {
    assert.deepEqual(
      replayDesiredDates(IN_PROGRESS, [
        event('2026-03-09T01:28:54Z', 'Ready', IN_PROGRESS),
      ]),
      { start: '2026-03-09', end: null },
    )
  })

  it('sets Start and End on the same UTC day when moving In progress then Done', () => {
    assert.deepEqual(
      replayDesiredDates(DONE, [
        event('2026-03-09T10:00:00Z', 'Ready', IN_PROGRESS),
        event('2026-03-09T22:00:00Z', IN_PROGRESS, DONE),
      ]),
      { start: '2026-03-09', end: '2026-03-09' },
    )
  })

  it('keeps Start date when entering Done', () => {
    assert.deepEqual(
      replayDesiredDates(DONE, [
        event('2026-01-01T12:00:00Z', 'Ready', IN_PROGRESS),
        event('2026-01-10T12:00:00Z', IN_PROGRESS, DONE),
      ]),
      { start: '2026-01-01', end: '2026-01-10' },
    )
  })

  it('clears End and keeps Start when leaving Done to another column', () => {
    assert.deepEqual(
      replayDesiredDates('Review', [
        event('2026-01-01T12:00:00Z', 'Ready', IN_PROGRESS),
        event('2026-01-10T12:00:00Z', IN_PROGRESS, DONE),
        event('2026-01-12T12:00:00Z', DONE, 'Review'),
      ]),
      { start: '2026-01-01', end: null },
    )
  })

  it('clears both dates when returning to Backlog', () => {
    assert.deepEqual(
      replayDesiredDates('Backlog', [
        event('2026-01-01T12:00:00Z', 'Ready', IN_PROGRESS),
        event('2026-01-10T12:00:00Z', IN_PROGRESS, DONE),
        event('2026-01-15T12:00:00Z', DONE, 'Backlog'),
      ]),
      { start: null, end: null },
    )
  })

  it('clears both dates when returning to Ready', () => {
    assert.deepEqual(
      replayDesiredDates('Ready', [
        event('2026-01-01T12:00:00Z', 'Backlog', IN_PROGRESS),
        event('2026-01-02T12:00:00Z', IN_PROGRESS, 'Ready'),
      ]),
      { start: null, end: null },
    )
  })

  it('replaces Start date when re-entering In progress', () => {
    assert.deepEqual(
      replayDesiredDates(IN_PROGRESS, [
        event('2026-01-01T12:00:00Z', 'Ready', IN_PROGRESS),
        event('2026-01-15T12:00:00Z', IN_PROGRESS, 'Ready'),
        event('2026-02-01T12:00:00Z', 'Ready', IN_PROGRESS),
      ]),
      { start: '2026-02-01', end: null },
    )
  })

  it('replaces End date when re-entering Done', () => {
    assert.deepEqual(
      replayDesiredDates(DONE, [
        event('2026-01-10T12:00:00Z', IN_PROGRESS, DONE),
        event('2026-02-01T12:00:00Z', DONE, IN_PROGRESS),
        event('2026-02-05T12:00:00Z', IN_PROGRESS, DONE),
      ]),
      { start: '2026-02-01', end: '2026-02-05' },
    )
  })

  it('skips Start date when In progress has empty history', () => {
    assert.deepEqual(replayDesiredDates(IN_PROGRESS, []), {
      start: undefined,
      end: null,
    })
  })
})

describe('planWrites', () => {
  const fields = {
    startFieldId: 'START_ID',
    endFieldId: 'END_ID',
  }

  it('returns no ops when current values already match', () => {
    assert.deepEqual(
      planWrites({
        currentStart: '2026-03-09',
        currentEnd: null,
        desiredStart: '2026-03-09',
        desiredEnd: null,
        ...fields,
      }),
      [],
    )
  })

  it('sets Start date when it is missing', () => {
    assert.deepEqual(
      planWrites({
        currentStart: null,
        currentEnd: null,
        desiredStart: '2026-03-09',
        desiredEnd: null,
        ...fields,
      }),
      [
        {
          op: 'set',
          fieldId: 'START_ID',
          fieldName: 'Start date',
          date: '2026-03-09',
        },
      ],
    )
  })

  it('clears End date when desired end is null', () => {
    assert.deepEqual(
      planWrites({
        currentStart: '2026-01-01',
        currentEnd: '2026-01-10',
        desiredStart: '2026-01-01',
        desiredEnd: null,
        ...fields,
      }),
      [
        {
          op: 'clear',
          fieldId: 'END_ID',
          fieldName: 'End date',
        },
      ],
    )
  })

  it('does not clear Start date when desired start is undefined', () => {
    assert.deepEqual(
      planWrites({
        currentStart: '2026-03-09',
        currentEnd: '2026-03-10',
        desiredStart: undefined,
        desiredEnd: undefined,
        ...fields,
      }),
      [],
    )
  })
})

describe('change report', () => {
  it('builds an issue URL from content.url or repo/number', () => {
    assert.equal(
      itemUrl({ url: 'https://github.com/LacusSolutions/br-utils-ruby/issues/12' }),
      'https://github.com/LacusSolutions/br-utils-ruby/issues/12',
    )
    assert.equal(
      itemUrl({
        __typename: 'PullRequest',
        repository: { nameWithOwner: 'LacusSolutions/br-utils-js' },
        number: 7,
      }),
      'https://github.com/LacusSolutions/br-utils-js/pull/7',
    )
  })

  it('describes set and clear operations', () => {
    assert.equal(
      describeOp({ op: 'set', fieldName: 'Start date', date: '2026-03-09' }),
      'set Start date to 2026-03-09',
    )
    assert.equal(describeOp({ op: 'clear', fieldName: 'End date' }), 'clear End date')
  })

  it('formats a markdown list item with a clickable issue link', () => {
    const markdown = formatChangeMarkdown(
      {
        content: {
          __typename: 'Issue',
          title: 'Add coverage',
          url: 'https://github.com/LacusSolutions/br-utils-php/issues/48',
          number: 48,
          repository: { nameWithOwner: 'LacusSolutions/br-utils-php' },
        },
      },
      [
        { op: 'set', fieldName: 'Start date', date: '2026-03-09' },
        { op: 'clear', fieldName: 'End date' },
      ],
    )

    assert.match(
      markdown,
      /\[LacusSolutions\/br-utils-php#48\]\(https:\/\/github.com\/LacusSolutions\/br-utils-php\/issues\/48\) — Add coverage/,
    )
    assert.match(markdown, /set Start date to 2026-03-09/)
    assert.match(markdown, /clear End date/)
  })

  it('builds a dry-run job summary with update links', () => {
    const report = buildJobSummary({
      project: {
        title: 'Lacus',
        url: 'https://github.com/orgs/LacusSolutions/projects/1',
      },
      dryRun: true,
      summary: { items: 3, updated: 1, unchanged: 1, skipped: 1, errors: 0 },
      changes: [
        '- [LacusSolutions/br-utils-php#48](https://github.com/LacusSolutions/br-utils-php/issues/48) — Add coverage\n  - set Start date to 2026-03-09',
      ],
      skipped: ['Draft title'],
      errors: [],
    })

    assert.match(report, /Dry-run \(no writes\)/)
    assert.match(report, /Would update \(1\)/)
    assert.match(report, /br-utils-php\/issues\/48/)
    assert.match(report, /Skipped drafts \(1\)/)
  })
})
