# Focus Sprint

A tiny terminal-first focus session tracker for fast Pomodoro-style work.

## Features
- Start and end focus sessions from the CLI
- Local JSON persistence
- Daily summary report
- TypeScript + lightweight test setup

## Stack
- Node.js 20+
- TypeScript
- Vitest

## Setup
```bash
npm install
```

## Run
```bash
npm run dev -- start --minutes 25
npm run dev -- end --status complete
npm run dev -- summary --today
```

## Test
```bash
npm test
```

## Docker
```bash
docker build -t focus-sprint .
docker run --rm focus-sprint npm test
```
