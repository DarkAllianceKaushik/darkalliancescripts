import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  AdminUpdateSettingsBody,
  AdminUpdateSettingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SESSION_KEY = "admin_authenticated";

async function ensureSettingsRow() {
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1));
  if (!row) {
    await db.insert(siteSettingsTable).values({ id: 1, discordUrl: "" });
  }
}

router.get("/settings", async (req, res): Promise<void> => {
  await ensureSettingsRow();
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1));
  res.json(GetSettingsResponse.parse({ discordUrl: row?.discordUrl ?? "" }));
});

router.patch("/admin/settings", async (req, res): Promise<void> => {
  if (!req.session?.[SESSION_KEY]) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = AdminUpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await ensureSettingsRow();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.discordUrl !== undefined) updateData.discordUrl = parsed.data.discordUrl;

  const [row] = await db
    .update(siteSettingsTable)
    .set(updateData)
    .where(eq(siteSettingsTable.id, 1))
    .returning();

  res.json(AdminUpdateSettingsResponse.parse({ discordUrl: row?.discordUrl ?? "" }));
});

export default router;
