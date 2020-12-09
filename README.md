# GitHub Action to trigger a Robocorp Cloud process

This GitHub Actions triggers a Robocorp Cloud process and optionally awaits it's execution.

## Usage

### Example Workflow file

An example workflow to authenticate with GitHub Platform:

```yaml
jobs:
  run-process:
    runs-on: ubuntu-latest
    name: Trigger process
    steps:
      - name: Trigger Robocorp Cloud process
        uses: robocorp/action-trigger-process
        with:
          api-key: ${{ secrets.ROBOCORP_API_KEY }}
          process-url: ${{ secrets.ROBOCORP_PROCESS_URL }}
          payload: '{"foo":"bar"}'
          await-complete: true
```

##### Configuration

| option         | value   | default                                 | description                                                            |
| -------------- | ------- | --------------------------------------- | ---------------------------------------------------------------------- |
| api-key        | string  |                                         | Workspace API key with `read_runs` and `trigger_processes` permissions |
| process-url    | string  |                                         | The target process URL                                                 |
| payload        | string  | "{}"                                    | Stringified JSON payload passed to process                             |
| await-complete | boolean | false                                   | Should the action await process completion                             |
| timeout        | number  | 120                                     | Process run await timeout in seconds                                   |
| api-endpoint   | string  | https://api.eu1.robocloud.eu/process-v1 | Robocorp workspace API endpoint                                        |
