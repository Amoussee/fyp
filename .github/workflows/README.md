# CI Pipelines
## Option 1: Run the CI steps locally (recommended)

From your repo root (the folder that contains `tcc/` and `server/`):

### Frontend (`tcc`)

```bash
cd tcc
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run build
```

### Backend (`server`)

```bash
cd ../server
npm ci
npm run format:check
npm run lint
```

### Trivy (repo scan)

Install Trivy locally (pick one install method from the official docs). ([Trivy][1])

Then run:

```bash
# from repo root
trivy fs . --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1
```

This is the quickest way to confirm “CI will pass” because you’re literally running the same commands.

---

## Option 2: Run the GitHub Actions workflow locally with `act`

`act` runs your workflows locally using Docker. ([GitHub][2])
You need **Docker running**.

### Install `act`

Follow the `nektos/act` install instructions for your OS. ([GitHub][2])

### From repo root: list workflows and jobs

```bash
act -l
```

This shows the workflows/jobs `act` sees. ([Ana's Dev Scribbles][3])

### Run the PR workflow (for your `pull_request` trigger)

```bash
act pull_request -W .github/workflows/ci.yml
```

### Run a single job (nice for debugging)

If your job names are `frontend`, `backend`, `trivy`:

```bash
act pull_request -W .github/workflows/ci.yml -j frontend
```

### If actions are slow / image mismatch

A common improvement is to use a fuller Ubuntu image for better compatibility:

```bash
act pull_request -W .github/workflows/ci.yml -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
```

---

## A couple practical notes (so you don’t get surprised)

### 1) Trivy in `act`

Your workflow uses `aquasecurity/trivy-action`. That action expects certain inputs (`scan-type`, `scan-ref`, etc.) and mirrors Trivy behavior, but in local emulation it can be more finicky than just running the `trivy` CLI directly. ([GitHub][4])
If `act` gives you trouble on the Trivy job, you can still trust Option 1’s `trivy fs` command as a “CI equivalent”.

### 2) `npm ci` requires lockfiles

`npm ci` will fail if `package-lock.json` is missing or out of sync. Make sure both `tcc/` and `server/` have lockfiles committed.
