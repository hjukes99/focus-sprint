# TODO (next 24–48h)

## P0
1. [ ] Implement `start` command with default 25-minute timer metadata output.
2. [ ] Implement `end` command to mark active session complete/abandoned.
3. [ ] Persist session data in `data/sessions.json` with safe file creation.
4. [ ] Add `summary --today` command with completed count and total minutes.

## P1
5. [ ] Add validation for invalid durations and malformed command usage.
6. [ ] Add unit tests for session creation/end flows.
7. [ ] Add unit tests for summary calculations.
8. [ ] Improve CLI help text with usage examples.

## P2
9. [ ] Add optional short-break reminder metadata after completed focus sessions.
10. [ ] Add CI workflow to run tests on push/PR.
