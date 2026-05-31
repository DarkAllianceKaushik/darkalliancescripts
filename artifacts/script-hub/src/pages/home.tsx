import { useState } from "react";
import { Link } from "wouter";
import { useListPublishedScripts, useGetScriptStats } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Code2, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="blur2">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>

      {/* Background glow blobs */}
      <ellipse cx="320" cy="240" rx="200" ry="200" fill="url(#glow1)" filter="url(#blur1)" />
      <ellipse cx="480" cy="120" rx="100" ry="100" fill="url(#glow2)" filter="url(#blur1)" />

      {/* Grid lines — faint tech grid */}
      {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600].map((x) => (
        <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#dc2626" strokeOpacity="0.06" strokeWidth="1" />
      ))}
      {[0, 60, 120, 180, 240, 300, 360, 420, 480].map((y) => (
        <line key={`hg-${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#dc2626" strokeOpacity="0.06" strokeWidth="1" />
      ))}

      {/* Main central hexagon */}
      <polygon
        points="300,80 390,130 390,230 300,280 210,230 210,130"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        fill="#dc2626"
        fillOpacity="0.04"
      />
      {/* Inner hex */}
      <polygon
        points="300,115 360,148 360,214 300,247 240,214 240,148"
        stroke="#ef4444"
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="#ef4444"
        fillOpacity="0.03"
      />

      {/* Central orb */}
      <circle cx="300" cy="180" r="38" fill="url(#orbGrad)" fillOpacity="0.15" />
      <circle cx="300" cy="180" r="38" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="300" cy="180" r="24" fill="url(#orbGrad)" fillOpacity="0.25" />
      <circle cx="300" cy="180" r="24" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="300" cy="180" r="10" fill="#ef4444" fillOpacity="0.8" />
      <circle cx="300" cy="180" r="10" filter="url(#blur2)" fill="#ef4444" fillOpacity="0.6" />

      {/* Orbiting rings */}
      <ellipse cx="300" cy="180" rx="70" ry="20" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.3" fill="none" strokeDasharray="6 4" />
      <ellipse cx="300" cy="180" rx="20" ry="70" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.2" fill="none" strokeDasharray="4 6" />

      {/* Satellite dots on orbits */}
      <circle cx="370" cy="180" r="4" fill="#ef4444" fillOpacity="0.9" />
      <circle cx="370" cy="180" r="6" fill="#ef4444" fillOpacity="0.2" filter="url(#blur2)" />
      <circle cx="230" cy="180" r="3" fill="#dc2626" fillOpacity="0.7" />
      <circle cx="300" cy="250" r="4" fill="#ef4444" fillOpacity="0.8" />
      <circle cx="300" cy="110" r="3" fill="#dc2626" fillOpacity="0.6" />

      {/* Corner hex decorations */}
      <polygon points="520,40 548,55 548,85 520,100 492,85 492,55" stroke="#dc2626" strokeOpacity="0.4" strokeWidth="1" fill="#dc2626" fillOpacity="0.03" />
      <circle cx="520" cy="70" r="8" fill="#ef4444" fillOpacity="0.5" />

      <polygon points="80,340 108,355 108,385 80,400 52,385 52,355" stroke="#dc2626" strokeOpacity="0.3" strokeWidth="1" fill="#dc2626" fillOpacity="0.02" />
      <circle cx="80" cy="370" r="6" fill="#ef4444" fillOpacity="0.4" />

      {/* Connecting lines from center to corners */}
      <line x1="300" y1="180" x2="520" y2="70" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="300" y1="180" x2="80" y2="370" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="300" y1="180" x2="560" y2="400" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="300" y1="180" x2="40" y2="100" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.15" />

      {/* Floating data nodes */}
      <rect x="440" y="290" width="60" height="36" rx="4" stroke="#dc2626" strokeOpacity="0.4" strokeWidth="1" fill="#dc2626" fillOpacity="0.04" />
      <line x1="444" y1="302" x2="496" y2="302" stroke="#ef4444" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="444" y1="312" x2="480" y2="312" stroke="#ef4444" strokeOpacity="0.25" strokeWidth="1" />
      <line x1="444" y1="320" x2="488" y2="320" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="1" />

      <rect x="90" y="170" width="60" height="36" rx="4" stroke="#dc2626" strokeOpacity="0.35" strokeWidth="1" fill="#dc2626" fillOpacity="0.04" />
      <line x1="94" y1="182" x2="146" y2="182" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="1" />
      <line x1="94" y1="192" x2="130" y2="192" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="94" y1="200" x2="138" y2="200" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="1" />

      <rect x="200" y="350" width="60" height="36" rx="4" stroke="#dc2626" strokeOpacity="0.3" strokeWidth="1" fill="#dc2626" fillOpacity="0.03" />
      <line x1="204" y1="362" x2="256" y2="362" stroke="#ef4444" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="204" y1="372" x2="240" y2="372" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="204" y1="380" x2="248" y2="380" stroke="#ef4444" strokeOpacity="0.15" strokeWidth="1" />

      {/* Corner cross targets */}
      {[
        [50, 50], [550, 50], [50, 450], [550, 450],
      ].map(([cx, cy]) => (
        <g key={`cross-${cx}-${cy}`}>
          <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#dc2626" strokeOpacity="0.4" strokeWidth="1" />
          <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#dc2626" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2" fill="#dc2626" fillOpacity="0.5" />
        </g>
      ))}

      {/* Decorative arcs */}
      <path d="M 160 420 Q 300 360 440 420" stroke="#dc2626" strokeOpacity="0.2" strokeWidth="1" fill="none" />
      <path d="M 120 460 Q 300 390 480 460" stroke="#dc2626" strokeOpacity="0.12" strokeWidth="1" fill="none" />

      {/* Small scatter dots */}
      {[
        [140, 80, 2.5, 0.5], [460, 150, 2, 0.4], [380, 400, 2.5, 0.45],
        [100, 290, 1.5, 0.35], [530, 320, 2, 0.4], [240, 430, 1.5, 0.3],
        [490, 230, 2, 0.45], [160, 340, 1.5, 0.3],
      ].map(([x, y, r, o]) => (
        <circle key={`dot-${x}-${y}`} cx={x} cy={y} r={r} fill="#ef4444" fillOpacity={o} />
      ))}
    </svg>
  );
}

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
            <span className="font-mono font-bold tracking-tight text-lg text-primary">DARK_ALLIANCE_SCRIPTS</span>
          </div>
          <Link href="/admin" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
            OWNER_LOGIN
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,_hsla(0,90%,35%,0.12)_0%,_transparent_70%)]" />

        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8 py-16 md:py-20">
          {/* Left — text */}
          <div className="flex flex-col space-y-5 z-10">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase">
              <span className="w-8 h-px bg-primary inline-block" />
              The Underground Collection
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Dark <span className="text-primary font-mono">Alliance</span>
              <br />Scripts
            </h1>
            <p className="text-muted-foreground text-base max-w-sm">
              Premium scripts handpicked for serious players. Grab what you need, dominate what you play.
            </p>
            {stats && (
              <div className="flex gap-3 text-xs font-mono text-muted-foreground pt-1">
                <span className="bg-secondary border border-border/50 px-3 py-1.5 rounded">[{stats.totalPublished}] SCRIPTS</span>
                <span className="bg-secondary border border-border/50 px-3 py-1.5 rounded">[{stats.categories.length}] CATEGORIES</span>
              </div>
            )}
          </div>

          {/* Right — vector graphic */}
          <div className="relative h-72 md:h-96 flex items-center justify-center">
            <HeroGraphic />
          </div>
        </div>
      </div>

      {/* Scripts section */}
      <section className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
              data-testid="input-search"
              className="pl-9 font-mono bg-card border-border focus-visible:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={category === "" ? "default" : "secondary"}
              className="cursor-pointer font-mono"
              data-testid="filter-all"
              onClick={() => setCategory("")}
            >
              ALL
            </Badge>
            {stats?.categories.map(cat => (
              <Badge
                key={cat.name}
                variant={category === cat.name ? "default" : "secondary"}
                className="cursor-pointer font-mono"
                data-testid={`filter-${cat.name.toLowerCase()}`}
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
                data-testid={`card-script-${script.id}`}
                className="bg-card border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-[0_0_24px_rgba(220,38,38,0.15)] group flex flex-col animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                {script.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg border-b border-border/50">
                    <img
                      src={script.imageUrl}
                      alt={script.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="font-mono text-xs text-primary border-primary/40 bg-primary/5">
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
                    className="w-full font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/85"
                    asChild
                    data-testid={`button-get-script-${script.id}`}
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
      </section>

      <footer className="border-t border-border/50 mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">DARK_ALLIANCE_SCRIPTS &mdash; All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
