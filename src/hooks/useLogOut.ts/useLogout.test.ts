/* eslint-disable @typescript-eslint/no-floating-promises */
import { renderHook } from "@testing-library/react-hooks";
import { useLogout } from "./useLogout";
import { FlowType } from "../types";
import nock from "nock";

describe("useLogOutHook", () => {
  describe("with API FlowType", () => {
    it("#logout should not throw on a succesful logout", async () => {
      nock("https://kratos.local/")
        .delete("/self-service/logout/api")
        .reply(204);

      const { result } = renderHook(() =>
        useLogout({
          flowType: FlowType.API,
          kratos: { basePath: "https://kratos.local" },
        }),
      );

      expect(result.current.logout).toBeDefined();

      expect(
        result.current.logout({ sessionToken: "valid-token" }),
      ).resolves.not.toThrow();
    });

    it("#logout should handle an invalid session", () => {
      nock("https://kratos.local/")
        .delete("/self-service/logout/api")
        .reply(403);

      const { result } = renderHook(() =>
        useLogout({
          flowType: FlowType.API,
          kratos: { basePath: "https://kratos.local" },
        }),
      );

      expect(result.current.logout).toBeDefined();

      expect(
        result.current.logout({ sessionToken: "invalid-token" }),
      ).rejects.toThrowError();
    });
  });
});
