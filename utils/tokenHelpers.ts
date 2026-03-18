// utils/tokenHelpers.ts
export const getRolesFromToken = (accessToken: string) => {
  const payload = JSON.parse(
    Buffer.from(accessToken.split(".")[1], "base64").toString("utf-8")
  );
  return payload.roles?.map((r: number) => Number(r)) ?? [];
};