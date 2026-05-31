import { useState } from "react";
import { Link } from "wouter";
import { useListPublishedScripts, useGetScriptStats } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Code2, Layers, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  
  const { data: scripts, isLoading: scriptsLoading } = useListPublishedScripts(
    { search: search || undefined, category: category || undefined },
    { query: { keepPreviousData: true } }
  );

  const { data: stats } = useGetScriptStats();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold tracking-tight text-lg text-primary">SCRIPT_HUB</span>
          </div>
          <Link href="/admin" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
            OWNER_LOGIN
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Curated <span className="text-primary font-mono">Developer Tools</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A high-quality store of automation tools, code snippets, and utilities for serious builders.
          </p>
          {stats && (
            <div className="flex gap-4 text-sm font-mono text-muted-foreground mt-4">
              <span className="bg-secondary px-2 py-1 rounded">[{stats.totalPublished}] SCRIPTS</span>
              <span className="bg-secondary px-2 py-1 rounded">[{stats.categories.length}] CATEGORIES</span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
              className="pl-9 font-mono bg-card border-border focus-visible:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={category === "" ? "default" : "secondary"}
              className="cursor-pointer font-mono"
              onClick={() => setCategory("")}
            >
              ALL
            </Badge>
            {stats?.categories.map(cat => (
              <Badge 
                key={cat.name}
                variant={category === cat.name ? "default" : "secondary"}
                className="cursor-pointer font-mono"
                onClick={() => setCategory(cat.name)}
              >
                {cat.name.toUpperCase()} [{cat.count}]
              </Badge>
            ))}
          </div>
        </div>

        {scriptsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-card border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : scripts?.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-lg bg-card/50">
            <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No scripts found</h3>
            <p className="text-muted-foreground font-mono text-sm">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts?.map((script, index) => (
              <Card 
                key={script.id} 
                className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,170,0.1)] group flex flex-col animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                {script.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg border-b border-border/50">
                    <img 
                      src={script.imageUrl} 
                      alt={script.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 bg-primary/5">
                      {script.category.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">{script.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">{script.description}</p>
                  {script.tags && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {script.tags.split(',').map(tag => (
                        <span key={tag} className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/90" 
                    asChild
                  >
                    <a href={script.scriptUrl} target="_blank" rel="noopener noreferrer">
                      GET_SCRIPT <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
