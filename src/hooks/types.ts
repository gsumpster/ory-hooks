import { type ConfigurationParameters } from "@ory/kratos-client";

export enum FlowType {
  BROWSER,
  API,
}

export interface KratosHookArgs {
  flowType: FlowType;
  kratos?: ConfigurationParameters;
}
