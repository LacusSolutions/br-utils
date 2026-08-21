# Sync Project Dates

Daily GitHub Action that reconciles **Start date** and **End date** on every card in [LacusSolutions Project 1](https://github.com/orgs/LacusSolutions/projects/1).

This lives in the docs repository so **one job** covers the whole organization Project. Do not copy this workflow into language repos (`br-utils-ruby`, `br-utils-js`, `br-utils-php`, and so on).

## Lifecycle

Dates come from each issue/PR timeline (`ProjectV2ItemStatusChangedEvent.createdAt`), stored as a UTC `YYYY-MM-DD`. The workflow clock is never used as the field value.

- Enter **In progress** → set/replace Start date, clear End date
- Enter **Done** → keep Start date, set/replace End date
- Leave **Done** (not to a reset column) → clear End date
- Return to **Backlog**, **Ready**, or no status → clear both dates
- Other columns: keep Start date if known; End date must be empty
- Missing timeline history: leave that date field untouched (do not guess)

Draft issues are skipped.

## Secret

Create a repository secret named `PROJECTS_TOKEN` on `LacusSolutions/br-utils` (Settings → Secrets and variables → Actions).

`GITHUB_TOKEN` cannot read or write organization Projects.

- Classic PAT: scopes `repo` and `project`
- Fine-grained PAT: Organization permission **Projects** Read and Write; repository access to every repo that has issues or PRs on Project 1

## Project fields

In the Project UI, confirm:

- **Status** options include `Backlog`, `Ready`, `In progress`, `Done` (exact spelling)
- Date fields named **Start date** and **End date**

If those names are missing, the job fails instead of guessing.

## Activation

1. Merge this workflow to `main` (scheduled workflows only run from the default branch).
2. Add `PROJECTS_TOKEN`.
3. Actions → **Sync Project Dates** → Run workflow with **dry_run** enabled.
4. Open the **sync** job. The log lists each issue/PR URL that would change. The job **Summary** tab has the same list as clickable markdown links.
5. Re-run with **dry_run** disabled to write.

The scheduled run is **23:50 UTC every day and writes** (`DRY_RUN=false`). Manual runs default to dry-run.

## Limitations

- GitHub may delay cron jobs under load.
- Cards already in **In progress** or **Done** with no timeline events are not backfilled.
- Draft issues have no queryable status history and are skipped.
