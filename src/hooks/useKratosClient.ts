import {
  Configuration,
  type ConfigurationParameters,
  FrontendApi,
} from "@ory/kratos-client";
import { useMemo } from "react";

export function useKratosClient(
  configuration?: ConfigurationParameters,
): FrontendApi {
  const client = useMemo(
    () => new FrontendApi(new Configuration(configuration)),
    [configuration],
  );

  return client;
}
