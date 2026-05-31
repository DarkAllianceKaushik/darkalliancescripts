import { Link, useParams } from "wouter";
import { useGetScript } from "@workspace/api-client-react";
import { DiscordButton } from "@/components/discord-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Tag, Calendar, Zap } from "lucide-react";

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const scriptId = Number(id);

  const { data: script, isLoading, isError } = useGetScript(scriptId, {
    query: { enabled: !isNaN(scriptId) },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="anim-fade-in border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold tracking-tight text-lg text-primary">DARK_ALLIANCE_SCRIPTS</span>
          </div>
          <Link href="/" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors duration-200">
            ← BACK
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {isLoading ? (
          <DetailSkeleton />
        ) : isError || !script ? (
          <NotFound />
        ) : (
          <Detail script={script} />
        )}
      </main>

      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">DARK_ALLIANCE_SCRIPTS &mdash; All rights reserved</p>
        </div>
      </footer>

      <DiscordButton />
    </div>
  );
}

type Script = NonNullable<ReturnType<typeof useGetScript>["data"]>;

function Detail({ script }: { script: Script }) {
  const tags = script.tags ? script.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="anim-fade-up inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" /> ALL_SCRIPTS
      </Link>

      {/* Hero image */}
      {script.imageUrl && (
        <div className="anim-fade-up delay-100 aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-card">
          <img src={script.imageUrl} alt={script.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title block */}
      <div className="anim-fade-up delay-200 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs text-primary border-primary/40 bg-primary/5">
            {script.category.toUpperCase()}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(script.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{script.title}</h1>
      </div>

      {/* Divider */}
      <div className="anim-fade-up delay-300 flex items-center gap-3">
        <span className="flex-1 h-px bg-border/50" />
        <span className="text-primary text-xs font-mono opacity-60">///</span>
        <span className="flex-1 h-px bg-border/50" />
      </div>

      {/* Description */}
      <div className="anim-fade-up delay-300">
        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">{script.description}</p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="anim-fade-up delay-400 flex gap-2 flex-wrap items-center">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-muted-foreground bg-secondary border border-border/50 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="anim-fade-up delay-500 pt-4">
        <Button
          className="font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/85 btn-press px-8 py-5 text-base"
          asChild
        >
          <a href={script.scriptUrl} target="_blank" rel="noopener noreferrer">
            GET_SCRIPT <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Ambient bottom glow */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-primary/5 blur-3xl rounded-full" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-5 w-32 bg-muted" />
      <Skeleton className="aspect-video w-full bg-muted rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 bg-muted" />
        <Skeleton className="h-12 w-3/4 bg-muted" />
      </div>
      <Skeleton className="h-32 w-full bg-muted" />
      <Skeleton className="h-12 w-40 bg-muted rounded-md" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="anim-fade-up flex flex-col items-center justify-center text-center py-32 gap-4">
      <p className="font-mono text-primary text-5xl font-bold">404</p>
      <h2 className="text-2xl font-bold">Script Not Found</h2>
      <p className="text-muted-foreground font-mono text-sm">This script doesn't exist or has been unpublished.</p>
      <Link href="/">
        <Button variant="outline" className="font-mono mt-2 btn-press">← BACK TO STORE</Button>
      </Link>
    </div>
  );
}
