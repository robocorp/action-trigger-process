export type TriggerRunResponse = {
  id: string;
  workItemIds: string[];
};

export type RunStatusResponse = {
  id: string;
  result: string;
  state: string;
  errorCode: string;
  workspaceId: string;
  processId: string;
  processName: string;
  duration: number;
  robotRuns: Array<{ id: string }>;
  runNo: number;
};
