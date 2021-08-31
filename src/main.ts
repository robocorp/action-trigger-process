import { getInput, setFailed, setOutput } from '@actions/core';
import fetch from 'node-fetch';
import { sleep } from './lib/helpers';

const headers = {
  Authorization: `RC-WSKEY ${getInput('api-key')}`,
  'Content-Type': 'application/json',
};

/**
 * Trigger a Control Room process
 */
const triggerProcess = async (): Promise<string> => {
  const payload = getInput('payload');
  const body: Record<string, unknown> = payload && payload.length ? JSON.parse(payload) : {};

  const url = `${getInput('api-endpoint')}/workspaces/${getInput('workspace-id')}/processes/${getInput('process-id')}/runs`;

  const response = await fetch(url, { method: 'POST', body: JSON.stringify({ variables: body }), headers });
  const json = await response.json();

  if (!json.id) {
    throw Error(`Failed to start process - ${JSON.stringify(json)}`);
  }

  const { id } = json;

  console.info(`Process ${id} triggered`);

  return `${url}/${id}`;
};

/**
 * Wait for a Control Room process to complete
 */
const awaitProcess = async (processUrl: string): Promise<boolean> => {
  const timeout = +getInput('timeout') * 1000;
  const endTime = new Date().getTime() + timeout;

  let attempt = 1;

  while (new Date().getTime() < endTime) {
    try {
      const response = await fetch(processUrl, { headers });
      const json = await response.json();

      if (json.state === 'COMPL') {
        setOutput('run-id', json.id);
        setOutput('duration', json.duration);
        setOutput('robotrun-ids', json.robotRuns.map(({ id }: { id: string }) => id).join(','));
        setOutput('state', json.result);

        if (json.result === 'ERR') {
          console.info(`Process ${json.id} failed with an error`);

          const shouldFail = getInput('fail-on-robot-fail');
          return !(shouldFail === 'true' || shouldFail === '1');
        }

        console.info(`Process ${json.id} completed succesfully in ${json.duration} seconds`);
        return true;
      }

      if (json.errorCode && json.errorCode.length) {
        console.info(`Process failed with error code ${json.errorCode}.`);
        return false;
      }

      if (json.state === 'IP') {
        console.info(`Process still running. Attempt ${attempt}.`);
      }

      if (json.state === 'INI' || json.state === 'IND') {
        console.info(`Process initializing. Attempt ${attempt}.`);
      }

      attempt += 1;
    } catch (e) {
      console.error(e);
    }

    await sleep(8);
  }

  throw new Error(`Timeout reached before the robot completed`);
};

/**
 * Trigger the action
 */
const run = async (): Promise<void> => {
  try {
    const processUrl = await triggerProcess();

    const awaitComplete = getInput('await-complete');

    if (awaitComplete.length && (awaitComplete === 'true' || awaitComplete === '1')) {
      const response = await awaitProcess(processUrl);

      if (!response) {
        setFailed('Robot failed to execute');
      }
    }
  } catch (err) {
    setFailed(err.message);
  }
};

run();
