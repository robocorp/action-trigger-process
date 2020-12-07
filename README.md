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
          process-secret: ${{ secrets.ROBOCORP__CLOUD_SECRET }}
          process-url: ${{ secrets.ROBOCORP_PROCESS_URL }}
          payload: '{"foo":"bar"}'
          await-complete: true
```

##### Configuration

| option         | value   | default | description                                |
| -------------- | ------- | ------- | ------------------------------------------ |
| process-secret | string  |         | The target process API access secret key   |
| process-url    | string  |         | The target process URL in form             |
| payload        | string  | "{}"    | Stringified JSON payload passed to process |
| await-complete | boolean | false   | Should the action await process completion |
| timeout        | number  | 120     | Process run await timeout in seconds       |
