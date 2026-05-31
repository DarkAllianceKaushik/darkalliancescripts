import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useAdminListScripts,
  useAdminLogout,
  useAdminDeleteScript,
  useAdminTogglePublish,
  useAdminCreateScript,
  useAdminUpdateScript,
  useAdminUpdateSettings,
  useGetSettings,
  getAdminListScriptsQueryKey,
  getListPublishedScriptsQueryKey,
  getAdminMeQueryKey,
  getGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Zap, Plus, Pencil, Trash2, LogOut, Eye, EyeOff, LayoutDashboard, Settings2, Save } from "lucide-react";
import type { Script, ScriptInput } from "@workspace/api-client-react/src/generated/api.schemas";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scripts, isLoading } = useAdminListScripts();
  const logout = useAdminLogout();
  const deleteScript = useAdminDeleteScript();
  const togglePublish = useAdminTogglePublish();
  const createScript = useAdminCreateScript();
  const updateScript = useAdminUpdateScript();

  const updateSettings = useAdminUpdateSettings();
  const { data: siteSettings } = useGetSettings();
  const [discordUrl, setDiscordUrl] = useState<string>("");

  useEffect(() => {
    if (siteSettings?.discordUrl !== undefined) {
      setDiscordUrl(siteSettings.discordUrl);
    }
  }, [siteSettings?.discordUrl]);

  const handleSaveSettings = () => {
    updateSettings.mutate(
      { data: { discordUrl } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({ title: "SAVED", description: "Discord URL updated." });
        },
        onError: () => {
          toast({ title: "ERROR", description: "Failed to save settings.", variant: "destructive" });
        }
      }
    );
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);

  const [formData, setFormData] = useState<ScriptInput>({
    title: "",
    description: "",
    scriptUrl: "",
    category: "",
    imageUrl: "",
    tags: "",
    published: false
  });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation("/admin");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this script?")) return;
    deleteScript.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListScriptsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPublishedScriptsQueryKey() });
        toast({ title: "DELETED", description: "Script deleted successfully.", variant: "destructive" });
      }
    });
  };

  const handleTogglePublish = (id: number) => {
    togglePublish.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListScriptsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPublishedScriptsQueryKey() });
        toast({ title: "UPDATED", description: "Script publication status toggled." });
      }
    });
  };

  const openNewForm = () => {
    setEditingScript(null);
    setFormData({ title: "", description: "", scriptUrl: "", category: "", imageUrl: "", tags: "", published: false });
    setIsFormOpen(true);
  };

  const openEditForm = (script: Script) => {
    setEditingScript(script);
    setFormData({
      title: script.title,
      description: script.description,
      scriptUrl: script.scriptUrl,
      category: script.category,
      imageUrl: script.imageUrl || "",
      tags: script.tags || "",
      published: script.published
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScript) {
      updateScript.mutate(
        { id: editingScript.id, data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getAdminListScriptsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListPublishedScriptsQueryKey() });
            setIsFormOpen(false);
            toast({ title: "UPDATED", description: "Script updated successfully." });
          }
        }
      );
    } else {
      createScript.mutate(
        { data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getAdminListScriptsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListPublishedScriptsQueryKey() });
            setIsFormOpen(false);
            toast({ title: "CREATED", description: "Script created successfully." });
          }
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold tracking-tight text-lg text-primary">ADMIN_DASHBOARD</span>
            <span className="hidden md:inline font-mono text-xs text-muted-foreground ml-2">— DARK_ALLIANCE_SCRIPTS</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-mono text-xs" data-testid="button-view-store" onClick={() => setLocation("/")}>
              VIEW_STORE
            </Button>
            <Button variant="outline" size="sm" className="font-mono text-xs text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleLogout} disabled={logout.isPending} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" /> LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Scripts</h1>
            <p className="text-muted-foreground font-mono text-sm">Manage your published and draft scripts</p>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-script" onClick={openNewForm} className="font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/85">
                <Plus className="mr-2 h-4 w-4" /> NEW_SCRIPT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] border-border bg-card">
              <DialogHeader>
                <DialogTitle className="font-mono font-bold text-xl">{editingScript ? "EDIT_SCRIPT" : "CREATE_SCRIPT"}</DialogTitle>
                <DialogDescription className="font-mono text-xs text-muted-foreground">
                  Fill in the details for your script.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitForm} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-mono text-xs">TITLE</Label>
                    <Input data-testid="input-title" id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="font-mono bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-mono text-xs">CATEGORY</Label>
                    <Input data-testid="input-category" id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="font-mono bg-background" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-mono text-xs">DESCRIPTION</Label>
                  <Textarea data-testid="input-description" id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="font-mono bg-background h-24" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scriptUrl" className="font-mono text-xs">SCRIPT_URL (Direct Link)</Label>
                  <Input data-testid="input-script-url" id="scriptUrl" type="url" value={formData.scriptUrl} onChange={e => setFormData({...formData, scriptUrl: e.target.value})} required className="font-mono bg-background" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="font-mono text-xs">IMAGE_URL (Optional)</Label>
                    <Input data-testid="input-image-url" id="imageUrl" type="url" value={formData.imageUrl || ""} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="font-mono bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="font-mono text-xs">TAGS (Comma separated)</Label>
                    <Input data-testid="input-tags" id="tags" value={formData.tags || ""} onChange={e => setFormData({...formData, tags: e.target.value})} className="font-mono bg-background" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="published" className="font-mono text-sm font-bold">PUBLISHED</Label>
                    <p className="text-xs font-mono text-muted-foreground">Make this script visible in the public store.</p>
                  </div>
                  <Switch data-testid="switch-published" id="published" checked={formData.published} onCheckedChange={c => setFormData({...formData, published: c})} />
                </div>

                <DialogFooter className="pt-4">
                  <Button data-testid="button-save-script" type="submit" className="font-mono font-bold w-full bg-primary text-primary-foreground hover:bg-primary/85" disabled={createScript.isPending || updateScript.isPending}>
                    {createScript.isPending || updateScript.isPending ? "SAVING..." : "SAVE_SCRIPT"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs">STATUS</TableHead>
                <TableHead className="font-mono text-xs">TITLE</TableHead>
                <TableHead className="font-mono text-xs">CATEGORY</TableHead>
                <TableHead className="font-mono text-xs text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-mono">LOADING...</TableCell>
                </TableRow>
              ) : scripts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-mono">NO_SCRIPTS_FOUND</TableCell>
                </TableRow>
              ) : (
                scripts?.map((script) => (
                  <TableRow key={script.id} data-testid={`row-script-${script.id}`} className="border-border/50 hover:bg-white/5 transition-colors">
                    <TableCell>
                      {script.published ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-mono text-xs">PUBLISHED</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 font-mono text-xs">DRAFT</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{script.title}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {script.category.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-border" data-testid={`button-toggle-publish-${script.id}`} onClick={() => handleTogglePublish(script.id)} title={script.published ? "Unpublish" : "Publish"}>
                          {script.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-border" data-testid={`button-edit-${script.id}`} onClick={() => openEditForm(script)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive" data-testid={`button-delete-${script.id}`} onClick={() => handleDelete(script.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Settings panel */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-extrabold tracking-tight">Settings</h2>
          </div>
          <div className="border border-border/50 rounded-lg bg-card/50 p-6 space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="discordUrl" className="font-mono text-xs">DISCORD_INVITE_URL</Label>
              <p className="text-xs text-muted-foreground font-mono">
                The invite link shown as a floating button on the public store. Leave blank to hide it.
              </p>
              <Input
                id="discordUrl"
                type="url"
                placeholder="https://discord.gg/your-invite"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="font-mono bg-background"
              />
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/85 btn-press"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateSettings.isPending ? "SAVING..." : "SAVE_SETTINGS"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
