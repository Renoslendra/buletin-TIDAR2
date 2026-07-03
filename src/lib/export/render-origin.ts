export function getExportRenderOrigin(requestUrl: string) {
  const explicitExportBaseUrl = process.env.EXPORT_BASE_URL?.trim();
  if (explicitExportBaseUrl) {
    return new URL(explicitExportBaseUrl).origin;
  }

  if (process.env.NODE_ENV === "production") {
    const port = process.env.PORT?.trim() || "3000";
    return `http://127.0.0.1:${port}`;
  }

  const appBaseUrl = process.env.APP_BASE_URL?.trim();
  if (appBaseUrl) {
    return new URL(appBaseUrl).origin;
  }

  return new URL(requestUrl).origin;
}
