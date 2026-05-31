import { Router, type IRouter } from "express";
import { eq, and, ilike, or, sql } from "drizzle-orm";
import { db, scriptsTable } from "@workspace/db";
import {
  ListPublishedScriptsQueryParams,
  GetScriptParams,
  GetScriptStatsResponse,
  ListPublishedScriptsResponse,
  GetScriptResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/scripts/stats", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      category: scriptsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(scriptsTable)
    .where(eq(scriptsTable.published, true))
    .groupBy(scriptsTable.category);

  const totalPublished = rows.reduce((sum, r) => sum + r.count, 0);

  const categories = rows.map((r) => ({ name: r.category, count: r.count }));

  res.json(
    GetScriptStatsResponse.parse({
      totalPublished,
      categories,
    }),
  );
});

router.get("/scripts", async (req, res): Promise<void> => {
  const parsed = ListPublishedScriptsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search } = parsed.data;

  let conditions = [eq(scriptsTable.published, true)];

  if (category) {
    conditions.push(eq(scriptsTable.category, category));
  }

  if (search) {
    conditions.push(
      or(
        ilike(scriptsTable.title, `%${search}%`),
        ilike(scriptsTable.description, `%${search}%`),
      )!,
    );
  }

  const scripts = await db
    .select()
    .from(scriptsTable)
    .where(and(...conditions))
    .orderBy(scriptsTable.createdAt);

  res.json(ListPublishedScriptsResponse.parse(scripts.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))));
});

router.get("/scripts/:id", async (req, res): Promise<void> => {
  const params = GetScriptParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [script] = await db
    .select()
    .from(scriptsTable)
    .where(and(eq(scriptsTable.id, params.data.id), eq(scriptsTable.published, true)));

  if (!script) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  res.json(GetScriptResponse.parse({
    ...script,
    createdAt: script.createdAt.toISOString(),
    updatedAt: script.updatedAt.toISOString(),
  }));
});

export default router;
