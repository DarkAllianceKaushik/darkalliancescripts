import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, scriptsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminCreateScriptBody,
  AdminUpdateScriptBody,
  AdminUpdateScriptParams,
  AdminDeleteScriptParams,
  AdminTogglePublishParams,
  AdminListScriptsResponse,
  AdminLoginResponse,
  AdminMeResponse,
  AdminUpdateScriptResponse,
  AdminTogglePublishResponse,
} from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_KEY = "admin_authenticated";

const router: IRouter = Router();

function requireAdmin(req: any, res: any): boolean {
  if (!req.session?.[SESSION_KEY]) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  req.session[SESSION_KEY] = true;
  res.json(AdminLoginResponse.parse({ success: true }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {});
  res.json({ success: true });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authenticated = !!req.session?.[SESSION_KEY];
  res.json(AdminMeResponse.parse({ authenticated }));
});

router.get("/admin/scripts", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const scripts = await db
    .select()
    .from(scriptsTable)
    .orderBy(desc(scriptsTable.createdAt));

  res.json(AdminListScriptsResponse.parse(scripts.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))));
});

router.post("/admin/scripts", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const parsed = AdminCreateScriptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [script] = await db
    .insert(scriptsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      scriptUrl: parsed.data.scriptUrl,
      category: parsed.data.category,
      published: parsed.data.published ?? false,
      imageUrl: parsed.data.imageUrl ?? null,
      tags: parsed.data.tags ?? null,
    })
    .returning();

  res.status(201).json({ ...script, createdAt: script.createdAt.toISOString(), updatedAt: script.updatedAt.toISOString() });
});

router.patch("/admin/scripts/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const params = AdminUpdateScriptParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AdminUpdateScriptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.scriptUrl !== undefined) updateData.scriptUrl = parsed.data.scriptUrl;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.published !== undefined) updateData.published = parsed.data.published;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;

  const [script] = await db
    .update(scriptsTable)
    .set(updateData)
    .where(eq(scriptsTable.id, params.data.id))
    .returning();

  if (!script) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  res.json(AdminUpdateScriptResponse.parse({ ...script, createdAt: script.createdAt.toISOString(), updatedAt: script.updatedAt.toISOString() }));
});

router.delete("/admin/scripts/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const params = AdminDeleteScriptParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [script] = await db
    .delete(scriptsTable)
    .where(eq(scriptsTable.id, params.data.id))
    .returning();

  if (!script) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  res.sendStatus(204);
});

router.patch("/admin/scripts/:id/toggle-publish", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const params = AdminTogglePublishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(scriptsTable)
    .where(eq(scriptsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  const [script] = await db
    .update(scriptsTable)
    .set({ published: !existing.published })
    .where(eq(scriptsTable.id, params.data.id))
    .returning();

  res.json(AdminTogglePublishResponse.parse({ ...script, createdAt: script.createdAt.toISOString(), updatedAt: script.updatedAt.toISOString() }));
});

export default router;
