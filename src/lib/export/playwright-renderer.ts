import { chromium, type Page } from "playwright";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getExportRenderOrigin } from "@/lib/export/render-origin";

type RenderBulletinOptions<T> = {
  requestUrl: string;
  bulletinId: string;
  session?: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceScaleFactor?: number;
  render: (page: Page) => Promise<T>;
};

export async function renderBulletinWithPlaywright<T>({
  requestUrl,
  bulletinId,
  session,
  viewport,
  deviceScaleFactor,
  render,
}: RenderBulletinOptions<T>) {
  const renderOrigin = getExportRenderOrigin(requestUrl);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor,
    });

    if (session) {
      await page.context().addCookies([
        {
          name: SESSION_COOKIE,
          value: session,
          url: renderOrigin,
          httpOnly: true,
          sameSite: "Lax",
        },
      ]);
    }

    const response = await page.goto(`${renderOrigin}/bulletins/${bulletinId}/preview?print=1`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    if (!response?.ok()) {
      throw new Error(
        `Preview buletin gagal dimuat. HTTP status: ${response?.status() ?? "unknown"}.`,
      );
    }

    const target = page.locator("#bulletin-page");
    await target.waitFor({ state: "visible", timeout: 30000 });
    await page.evaluate(() => document.fonts?.ready.then(() => undefined));
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);

    return await render(page);
  } finally {
    await browser.close().catch(() => undefined);
  }
}
