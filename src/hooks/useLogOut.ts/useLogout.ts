import assert from "assert";
import { FlowType, type KratosHookArgs } from "../types";
import { useKratosClient } from "../useKratosClient";
import { useCallback } from "react";
import axios from "axios";
import { type FrontendApi } from "@ory/kratos-client";

interface LogOutFunctionParams {
  sessionToken?: string;
}

async function nativeLogout(
  client: FrontendApi,
  sessionToken: string,
): Promise<void> {
  try {
    await client.performNativeLogout({
      performNativeLogoutBody: {
        session_token: sessionToken,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 403) {
        // @TODO: Error Type
        throw new Error(`Invalid Session Token`);
      }
    }

    throw error;
  }
}

async function browserLogout(client: FrontendApi): Promise<void> {
  try {
    const { data: LogoutFlow } = await client.createBrowserLogoutFlow();

    await client.updateLogoutFlow({ token: LogoutFlow.logout_token });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 401) {
        // @TODO: Error Type
        throw new Error(`Invalid Session`);
      }
    }

    throw error;
  }
}

export function useLogout(props: KratosHookArgs): {
  logout: (logoutParams: LogOutFunctionParams) => Promise<void>;
} {
  const { flowType, kratos } = props;
  const client = useKratosClient(kratos);

  const logout = useCallback(
    async ({ sessionToken }: LogOutFunctionParams) => {
      if (flowType === FlowType.API) {
        assert(
          typeof sessionToken === "string",
          `sessionToken parameter must be defined when using FlowType API`,
        );

        await nativeLogout(client, sessionToken);
      } else {
        await browserLogout(client);
      }
    },
    [flowType],
  );

  return { logout };
}
