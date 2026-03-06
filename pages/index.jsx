"use client";
import { useState, useEffect, useMemo } from "react";

// ─── CONFIG — edit this per client deployment ─────────────────────────────────
const CLIENT = {
  name:        "Chicago International Film Festival",
  logoText:    "CIFF",
  logoUrl:     "https://pbs.twimg.com/profile_images/1881808955409604609/T4VpCtpd_400x400.jpg",
  accentColor: "#111111",
  handles: {
    twitter:   "chifilmfest",
    instagram: "chifilmfest",
    youtube:   "chicagointernationalfilmfe5164",
    tiktok:    "chifilmfest",
    linkedin:  "cinemachicago",
    facebook:  "chicagofilmfestival",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// Apify actor IDs
const ACTORS = {
  twitter:   "apidojo~tweet-scraper",
  instagram: "apify~instagram-profile-scraper",
  youtube:   "streamers~youtube-scraper",
  tiktok:    "clockworks~tiktok-scraper",
  linkedin:  "dev_fusion~Linkedin-Company-Scraper",
  facebook:  "apify~facebook-pages-scraper",
};

const PLATFORMS = [
  { id:"twitter",   name:"X / Twitter", accent:"#1d9bf0", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id:"instagram", name:"Instagram",   accent:"#e1306c", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { id:"youtube",   name:"YouTube",     accent:"#FF0000", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id:"tiktok",    name:"TikTok",      accent:"#ff0050", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg> },
  { id:"linkedin",  name:"LinkedIn",    accent:"#0A66C2", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id:"facebook",  name:"Facebook",    accent:"#1877F2", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
];

const TIME_RANGES = [
  { id:"7d",  label:"7 days",   days:7 },
  { id:"30d", label:"30 days",  days:30 },
  { id:"6m",  label:"6 months", days:182 },
  { id:"1y",  label:"1 year",   days:365 },
];

// ─── Apify helpers ────────────────────────────────────────────────────────────


async function runActor(actorId, input) {
  const resp = await fetch(
    `/api/refresh`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ actorId, input }) }
  );
  if (!resp.ok) throw new Error(`Actor ${actorId} failed: ${resp.status}`);
  return resp.json();
}

// Extract follower count + top posts from each platform's response
function parseTwitter(data) {
  const profile = data?.[0];
  return {
    followers: profile?.author?.followers ?? null,
    posts: (data || []).slice(0, 6).map(t => ({
      id: t.id, platform: "twitter",
      content: t.full_text || t.text || "",
      likes: t.likeCount || 0,
      comments: t.replyCount || 0,
      shares: t.retweetCount || 0,
      date: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "",
    })).sort((a,b) => b.likes - a.likes).slice(0,2),
  };
}

function parseInstagram(data) {
  const profile = data?.[0];
  return {
    followers: profile?.followersCount ?? null,
    posts: (profile?.latestPosts || []).slice(0, 6).map(p => ({
      id: p.id, platform: "instagram",
      content: p.caption || "",
      likes: p.likesCount || 0,
      comments: p.commentsCount || 0,
      shares: 0,
      date: p.timestamp ? new Date(p.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "",
    })).sort((a,b) => b.likes - a.likes).slice(0,2),
  };
}

function parseYoutube(data) {
  const channel = data?.[0];
  return {
    followers: channel?.subscriberCount ?? null,
    posts: (data || []).filter(i => i.type === "video").slice(0,6).map(v => ({
      id: v.id, platform: "youtube",
      content: v.title || "",
      likes: v.likes || 0,
      comments: v.commentsCount || 0,
      shares: 0,
      date: v.date ? new Date(v.date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "",
    })).sort((a,b) => b.likes - a.likes).slice(0,2),
  };
}

function parseTiktok(data) {
  const profile = data?.find(i => i.authorMeta);
  return {
    followers: profile?.authorMeta?.fans ?? null,
    posts: (data || []).filter(i => i.text).slice(0,6).map(v => ({
      id: v.id, platform: "tiktok",
      content: v.text || "",
      likes: v.diggCount || 0,
      comments: v.commentCount || 0,
      shares: v.shareCount || 0,
      date: v.createTimeISO ? new Date(v.createTimeISO).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "",
    })).sort((a,b) => b.likes - a.likes).slice(0,2),
  };
}

function parseLinkedin(data) {
  const company = data?.[0];
  const followerStr = company?.followers || company?.followersCount || "";
  const followers = typeof followerStr === "number" ? followerStr :
    parseInt((followerStr+"").replace(/[^0-9]/g,"")) || null;
  return { followers, posts: [] };
}

function parseFacebook(data) {
  const page = data?.[0];
  return {
    followers: page?.followers ?? page?.likes ?? null,
    posts: (page?.posts || []).slice(0,6).map(p => ({
      id: p.postId || p.id, platform: "facebook",
      content: p.text || p.message || "",
      likes: p.likes || 0,
      comments: p.comments || 0,
      shares: p.shares || 0,
      date: p.time ? new Date(p.time).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "",
    })).sort((a,b) => b.likes - a.likes).slice(0,2),
  };
}

// Actor input builders
function buildInput(platformId, handle) {
  switch(platformId) {
    case "twitter":
      return { startUrls: [{ url: `https://twitter.com/${handle}` }], maxTweets: 20, addUserInfo: true };
    case "instagram":
      return { usernames: [handle] };
    case "youtube":
      return { startUrls: [{ url: `https://www.youtube.com/@${handle}` }], maxVideos: 10 };
    case "tiktok":
      return { profiles: [`https://www.tiktok.com/@${handle}`], resultsPerPage: 20 };
    case "linkedin":
  return { companyUrls: [`https://www.linkedin.com/company/${handle}/`] };
    case "facebook":
      return { startUrls: [{ url: `https://www.facebook.com/${handle}` }], maxPosts: 10 };
    default: return {};
  }
}

const PARSERS = { twitter: parseTwitter, instagram: parseInstagram, youtube: parseYoutube, tiktok: parseTiktok, linkedin: parseLinkedin, facebook: parseFacebook };

// ─── History helpers ──────────────────────────────────────────────────────────
function addToHistory(history, value) {
  const now = Date.now();
  const updated = [...(history || []), { ts: now, value }];
  // Keep max 365 entries, dedupe same-day
  const byDay = {};
  updated.forEach(p => {
    const day = new Date(p.ts).toDateString();
    byDay[day] = p;
  });
  return Object.values(byDay).sort((a,b) => a.ts - b.ts).slice(-365);
}

function historyForRange(history, days) {
  if (!history || history.length < 2) return [];
  const cutoff = Date.now() - days * 86400000;
  const filtered = history.filter(p => p.ts >= cutoff);
  if (filtered.length < 2) return history.slice(-2).map(p => p.value);
  return filtered.map(p => p.value);
}

function growthOver(history, days) {
  const pts = historyForRange(history, days);
  if (pts.length < 2) return 0;
  return pts[pts.length-1] - pts[0];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n==null) return "—";
  if (n>=1e6)  return (n/1e6).toFixed(1)+"M";
  if (n>=1e3)  return (n/1e3).toFixed(1)+"K";
  return n.toLocaleString();
}

// ─── Chart ────────────────────────────────────────────────────────────────────
function AreaChart({ historyPts, accent, rangeId, small=false }) {
  const data = useMemo(() => {
    const days = TIME_RANGES.find(r=>r.id===rangeId)?.days||30;
    return historyForRange(historyPts, days);
  }, [historyPts, rangeId]);

  if (!data || data.length < 2) return (
    <div style={{height: small?48:72, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontSize:11,color:"#9ca3af"}}>Not enough data yet</span>
    </div>
  );

  const max=Math.max(...data), min=Math.min(...data), rng=max-min||1;
  const W=400, H=small?48:72;
  const pts=data.map((v,i)=>[(i/(data.length-1))*W, H-((v-min)/rng)*(H-8)-4]);
  const gid=`ac-${accent.replace("#","")}-${rangeId}-${small}-${data.length}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:"block",height:H}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={[...pts.map(([x,y])=>`${x},${y}`),`${W},${H}`,`0,${H}`].join(" ")} fill={`url(#${gid})`}/>
      <polyline points={pts.map(([x,y])=>`${x},${y}`).join(" ")} fill="none" stroke={accent} strokeWidth={small?"1.5":"2"} strokeLinejoin="round"/>
      {!small&&<circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={accent}/>}
    </svg>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post, rank }) {
  const p=PLATFORMS.find(x=>x.id===post.platform);
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
      {rank&&<div style={{position:"absolute",top:12,right:14,fontSize:32,fontWeight:900,color:"#f3f4f6",lineHeight:1,userSelect:"none"}}>#{rank}</div>}
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
        <span style={{color:p?.accent,display:"flex"}}>{p?.icon}</span>
        <span style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:"0.04em"}}>{p?.name}</span>
        <span style={{marginLeft:"auto",fontSize:11,color:"#9ca3af"}}>{post.date}</span>
      </div>
      <p style={{fontSize:13,color:"#374151",lineHeight:1.55,marginBottom:12,paddingRight:28}}>{post.content||"—"}</p>
      <div style={{display:"flex",gap:16,paddingTop:10,borderTop:"1px solid #f3f4f6"}}>
        {[["❤",post.likes,"#ef4444"],["💬",post.comments,"#6b7280"],["↗",post.shares,"#3b82f6"]].map(([ic,v,c],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:12}}>{ic}</span>
            <span style={{fontSize:13,fontWeight:700,color:c}}>{fmt(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function ClientLogo({ size=75 }) {
  const { accentColor, logoUrl, logoText, name } = CLIENT;
  if (logoUrl) return <img src={logoUrl} alt={name} style={{width:size,height:size,borderRadius:8,objectFit:"contain"}}/>;
  return (
    <div style={{width:size,height:size,borderRadius:8,background:accentColor,display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:size*0.3,color:"#fff",fontWeight:900,letterSpacing:"0.04em",flexShrink:0}}>
      {(logoText||name).slice(0,4).toUpperCase()}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab]               = useState("overview");
  const [growthRange, setGrowthRange] = useState("30d");
  const [postPeriod, setPostPeriod] = useState("recent");
  const [loading, setLoading]       = useState(false);
  const [loadingPlatform, setLoadingPlatform] = useState({});
  const [lastSync, setLastSync]     = useState(null);
  const [followers, setFollowers]   = useState({});
  const [histories, setHistories]   = useState({});
  const [posts, setPosts]           = useState({});
  const [errors, setErrors]         = useState({});

  const accent = CLIENT.accentColor;

  // Load persisted data from storage
  useEffect(() => {
    (async () => {
      try {
        const f  = JSON.parse(localStorage.getItem("dash_followers") || "null");
        if (f)  setFollowers(f);
        const h  = JSON.parse(localStorage.getItem("dash_histories") || "null");
        if (h)  setHistories(h);
        const p  = JSON.parse(localStorage.getItem("dash_posts") || "null");
        if (p)  setPosts(p);
        const ls = localStorage.getItem("dash_synced");
        if (ls) setLastSync(ls);
      } catch(_) {}
    })();
  }, []);

  const persist = async (f, h, p) => {
    try {
      localStorage.setItem("dash_followers", JSON.stringify(f));
      localStorage.setItem("dash_histories", JSON.stringify(h));
      localStorage.setItem("dash_posts", JSON.stringify(p));
      const now = new Date().toLocaleString();
      localStorage.setItem("dash_synced", now);
      setLastSync(now);
    } catch(_) {}
  };

  const refresh = async () => {
    setLoading(true);
    setErrors({});

    const newFollowers = { ...followers };
    const newHistories = { ...histories };
    const newPosts     = { ...posts };
    const newErrors    = {};

    await Promise.all(PLATFORMS.map(async (p) => {
      setLoadingPlatform(prev => ({ ...prev, [p.id]: true }));
      try {
        const input = buildInput(p.id, CLIENT.handles[p.id]);
        const data  = await runActor(ACTORS[p.id], input);
        const parsed = PARSERS[p.id](data);

        if (parsed.followers != null) {
          newFollowers[p.id] = parsed.followers;
          newHistories[p.id] = addToHistory(newHistories[p.id], parsed.followers);
        }
        if (parsed.posts?.length) {
          newPosts[p.id] = parsed.posts;
        }
      } catch(e) {
        console.error(`${p.id} error:`, e);
        newErrors[p.id] = e.message;
      }
      setLoadingPlatform(prev => ({ ...prev, [p.id]: false }));
    }));

    setFollowers(newFollowers);
    setHistories(newHistories);
    setPosts(newPosts);
    setErrors(newErrors);
    await persist(newFollowers, newHistories, newPosts);
    setLoading(false);
  };

  const totalFollowers = PLATFORMS.reduce((s,p) => s + (followers[p.id]||0), 0);
  const growthDays     = TIME_RANGES.find(r=>r.id===growthRange)?.days||30;
  const totalGrowth    = PLATFORMS.reduce((s,p) => s + growthOver(histories[p.id], growthDays), 0);
  const growthLabel    = TIME_RANGES.find(r=>r.id===growthRange)?.label||"30 days";

  const topPosts = useMemo(() => {
    const all = PLATFORMS.flatMap(p => (posts[p.id]||[]));
    return all.sort((a,b) => b.likes - a.likes).slice(0,6);
  }, [posts]);

  const hasData = totalFollowers > 0;

  const tabStyle = (t) => ({
    padding:"10px 0", cursor:"pointer", fontSize:12, fontWeight:700,
    letterSpacing:"0.06em", textTransform:"uppercase",
    color: tab===t ? "#111" : "#9ca3af",
    borderBottom: tab===t ? `2px solid ${accent}` : "2px solid transparent",
    transition:"all 0.15s", whiteSpace:"nowrap",
  });

  const segBtn = (active) => ({
    padding:"6px 14px", border:`1px solid ${active?"#111":"#e5e7eb"}`,
    borderRadius:6, background:active?"#111":"#fff",
    color:active?"#fff":"#6b7280", fontSize:12, fontWeight:600,
    cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
  });

  return (
    <div style={{minHeight:"100vh",background:"#f4f4f2",fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f4f4f2}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px}
        .fade{animation:fi 0.25s ease}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;transition:box-shadow 0.2s}
        .card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.08)}
        .spin{animation:sp 1s linear infinite}@keyframes sp{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Header ── */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:16,height:90}}>
          <ClientLogo size={75}/>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:800,color:"#111",lineHeight:1}}>{CLIENT.name}</div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:1,fontWeight:500}}>Social Dashboard</div>
          </div>
          {lastSync && <span style={{fontSize:11,color:"#d1d5db"}}>Synced {lastSync}</span>}
          <button onClick={refresh} disabled={loading}
            style={{background:"#111",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",
              fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:loading?"not-allowed":"pointer",
              display:"flex",alignItems:"center",gap:6,letterSpacing:"0.04em",opacity:loading?0.7:1}}>
            {loading
              ? <><span className="spin" style={{display:"inline-block",width:12,height:12,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%"}}/> Syncing...</>
              : "↻ Refresh Data"}
          </button>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px"}}>

        {/* ── No data state ── */}
        {!hasData && !loading && (
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:"48px 32px",textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:32,marginBottom:12}}>📡</div>
            <div style={{fontSize:18,fontWeight:800,color:"#111",marginBottom:8}}>No data yet</div>
            <p style={{fontSize:14,color:"#6b7280",marginBottom:20,maxWidth:360,margin:"0 auto 20px"}}>
              Hit Refresh Data to fetch live follower counts and top posts from all 6 platforms.
            </p>
            <button onClick={refresh}
              style={{background:"#111",color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              ↻ Fetch Live Data
            </button>
          </div>
        )}

        {/* ── Hero card ── */}
        {hasData && (
          <div style={{
            borderRadius:16, marginBottom:24, position:"relative", overflow:"hidden",
            background:`linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
            border:`1px solid ${accent}30`, padding:"28px 32px",
          }}>
            <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:`${accent}10`,pointerEvents:"none"}}/>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:accent,marginBottom:8}}>Total Audience</div>
                <div style={{fontSize:56,fontWeight:900,color:"#111",lineHeight:1,letterSpacing:"-0.02em"}}>{fmt(totalFollowers)}</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,flexWrap:"wrap"}}>
                  <div style={{
                    display:"inline-flex",alignItems:"center",gap:6,
                    background: totalGrowth>=0?"#dcfce7":"#fee2e2",
                    border:`1px solid ${totalGrowth>=0?"#86efac":"#fca5a5"}`,
                    borderRadius:20, padding:"5px 12px",
                  }}>
                    <span style={{fontSize:13,fontWeight:800,color:totalGrowth>=0?"#16a34a":"#dc2626"}}>
                      {totalGrowth>=0?"↑":"↓"} {totalGrowth>=0?"+":""}{fmt(totalGrowth)}
                    </span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:2,background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:"3px 4px"}}>
                    {TIME_RANGES.map(r=>(
                      <button key={r.id} onClick={()=>setGrowthRange(r.id)}
                        style={{padding:"3px 10px",borderRadius:16,border:"none",
                          background:growthRange===r.id?accent:"transparent",
                          color:growthRange===r.id?"#fff":"#6b7280",
                          fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Per-platform pills */}
              <div style={{display:"flex",flexDirection:"column",gap:7,minWidth:220}}>
                {PLATFORMS.map(p => {
                  const chg = growthOver(histories[p.id], growthDays);
                  const isLoading = loadingPlatform[p.id];
                  const hasError = errors[p.id];
                  return (
                    <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:8,padding:"6px 10px",border:"1px solid #f3f4f6"}}>
                      <span style={{color:p.accent,display:"flex",flexShrink:0}}>{p.icon}</span>
                      <span style={{fontSize:11,color:"#6b7280",fontWeight:500,flex:1}}>{p.name}</span>
                      {isLoading
                        ? <span className="spin" style={{width:10,height:10,border:"2px solid #e5e7eb",borderTopColor:p.accent,borderRadius:"50%",display:"inline-block"}}/>
                        : hasError
                        ? <span style={{fontSize:10,color:"#f87171"}}>error</span>
                        : <>
                          <span style={{fontSize:12,fontWeight:800,color:"#111"}}>{fmt(followers[p.id])}</span>
                          {chg !== 0 && <span style={{fontSize:11,fontWeight:700,color:chg>=0?"#16a34a":"#dc2626",minWidth:48,textAlign:"right"}}>{chg>=0?"+":""}{fmt(chg)}</span>}
                        </>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        {hasData && (
          <>
            <div style={{display:"flex",gap:24,borderBottom:"2px solid #e5e7eb",marginBottom:24}}>
              {["overview","growth","top posts","breakdown"].map(t=>(
                <div key={t} style={tabStyle(t)} onClick={()=>setTab(t)}>{t}</div>
              ))}
            </div>

            {/* ══ OVERVIEW ══ */}
            {tab==="overview" && (
              <div className="fade" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                {PLATFORMS.map(p => {
                  const chg = growthOver(histories[p.id], growthDays);
                  return (
                    <div key={p.id} className="card">
                      <div style={{borderTop:`3px solid ${p.accent}`,padding:"16px 18px"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <span style={{color:p.accent,display:"flex"}}>{p.icon}</span>
                            <span style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:"0.04em",textTransform:"uppercase"}}>{p.name}</span>
                          </div>
                          <span style={{fontSize:11,color:"#9ca3af"}}>{CLIENT.handles[p.id]}</span>
                        </div>
                        <div style={{fontSize:36,fontWeight:900,color:"#111",letterSpacing:"-0.02em",marginBottom:4}}>
                          {loadingPlatform[p.id]
                            ? <span style={{fontSize:14,color:"#9ca3af"}}>Fetching...</span>
                            : fmt(followers[p.id])}
                        </div>
                        {!loadingPlatform[p.id] && (
                          <div style={{fontSize:12,fontWeight:700,color:chg>=0?"#16a34a":"#dc2626",marginBottom:14}}>
                            {chg!==0 && <>{chg>=0?"↑ +":"↓ "}{fmt(Math.abs(chg))}</>}
                            <span style={{fontWeight:500,color:"#9ca3af",marginLeft:4}}>in {growthLabel}</span>
                          </div>
                        )}
                        <AreaChart historyPts={histories[p.id]} accent={p.accent} rangeId={growthRange} small/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ GROWTH ══ */}
            {tab==="growth" && (
              <div className="fade">
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginRight:4}}>Period</span>
                  {TIME_RANGES.map(r=>(
                    <button key={r.id} style={segBtn(growthRange===r.id)} onClick={()=>setGrowthRange(r.id)}>{r.label}</button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14,marginBottom:16}}>
                  {PLATFORMS.map(p => {
                    const chg = growthOver(histories[p.id], growthDays);
                    const pct = histories[p.id]?.length > 1
                      ? (((followers[p.id]||0) - ((histories[p.id]||[])[0]?.value||0)) / (((histories[p.id]||[])[0]?.value)||1) * 100).toFixed(1)
                      : "0.0";
                    return (
                      <div key={p.id} className="card">
                        <div style={{borderTop:`3px solid ${p.accent}`,padding:"16px 18px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                            <span style={{color:p.accent,display:"flex"}}>{p.icon}</span>
                            <span style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.04em"}}>{p.name}</span>
                            <span style={{marginLeft:"auto",fontSize:20,fontWeight:900,color:"#111"}}>{fmt(followers[p.id])}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                            <span style={{fontSize:12,fontWeight:700,color:chg>=0?"#16a34a":"#dc2626"}}>
                              {chg>=0?"↑ +":"↓ "}{fmt(Math.abs(chg))}
                              <span style={{fontWeight:500,color:"#9ca3af",marginLeft:4}}>in {growthLabel}</span>
                            </span>
                            <span style={{fontSize:12,fontWeight:700,color:chg>=0?"#16a34a":"#dc2626"}}>{chg>=0?"+":""}{pct}%</span>
                          </div>
                          <AreaChart historyPts={histories[p.id]} accent={p.accent} rangeId={growthRange}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Combined chart */}
                <div className="card">
                  <div style={{padding:"20px 22px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:800,color:"#111"}}>Combined Audience Growth</div>
                      <div style={{fontSize:13,fontWeight:700,color:totalGrowth>=0?"#16a34a":"#dc2626"}}>
                        {totalGrowth>=0?"↑ +":"↓ "}{fmt(Math.abs(totalGrowth))}
                        <span style={{fontWeight:500,color:"#9ca3af",marginLeft:4}}>in {growthLabel}</span>
                      </div>
                    </div>
                    {/* Build combined history by summing across platforms per timestamp */}
                    {(() => {
                      const allPts = PLATFORMS.flatMap(p =>
                        (histories[p.id]||[]).map(h => h.ts)
                      );
                      const uniqueDays = [...new Set(allPts.map(ts => new Date(ts).toDateString()))].sort();
                      const days = TIME_RANGES.find(r=>r.id===growthRange)?.days||30;
                      const cutoff = Date.now() - days * 86400000;
                      const combined = uniqueDays
                        .filter(day => new Date(day).getTime() >= cutoff)
                        .map(day => ({
                          day,
                          value: PLATFORMS.reduce((sum, p) => {
                            const h = histories[p.id]||[];
                            const entry = h.find(e => new Date(e.ts).toDateString() === day);
                            return sum + (entry?.value || followers[p.id] || 0);
                          }, 0)
                        }));
                      if (combined.length < 2) return <div style={{fontSize:12,color:"#9ca3af",padding:"20px 0"}}>Refresh a few times over several days to see combined growth trends.</div>;
                      const vals = combined.map(c=>c.value);
                      const max=Math.max(...vals), min=Math.min(...vals), rng=max-min||1;
                      const W=800, H=80;
                      const pts=vals.map((v,i)=>[(i/(vals.length-1))*W, H-((v-min)/rng)*(H-10)-5]);
                      return (
                        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height:80,display:"block"}}>
                          <defs>
                            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={accent} stopOpacity="0.2"/>
                              <stop offset="100%" stopColor={accent} stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <polygon points={[...pts.map(([x,y])=>`${x},${y}`),`${W},${H}`,`0,${H}`].join(" ")} fill="url(#cg)"/>
                          <polyline points={pts.map(([x,y])=>`${x},${y}`).join(" ")} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
                        </svg>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ══ TOP POSTS ══ */}
            {tab==="top posts" && (
              <div className="fade">
                {topPosts.length === 0 ? (
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#9ca3af"}}>
                    <div style={{fontSize:24,marginBottom:8}}>📝</div>
                    <div style={{fontSize:14}}>No posts yet — hit Refresh Data to fetch top posts from all platforms.</div>
                  </div>
                ) : (
                  <>
                    <div style={{marginBottom:28}}>
                      <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9ca3af",marginBottom:12}}>🏆 Top Posts — All Platforms</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                        {topPosts.map((post,i) => <PostCard key={post.id||i} post={post} rank={i+1}/>)}
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9ca3af",marginBottom:12}}>Best Per Platform</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                      {PLATFORMS.map(p => {
                        const platformPosts = posts[p.id];
                        if (!platformPosts?.length) return null;
                        return <PostCard key={p.id} post={platformPosts[0]}/>;
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ══ BREAKDOWN ══ */}
            {tab==="breakdown" && (
              <div className="fade">
                <div className="card" style={{padding:"24px 28px"}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#111",marginBottom:20}}>Audience Share by Platform</div>
                  {PLATFORMS.map(p => {
                    const val = followers[p.id]||0;
                    const pct = totalFollowers?(val/totalFollowers)*100:0;
                    return (
                      <div key={p.id} style={{marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <span style={{color:p.accent,display:"flex"}}>{p.icon}</span>
                            <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{p.name}</span>
                            <span style={{fontSize:11,color:"#9ca3af"}}>{CLIENT.handles[p.id]}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <span style={{fontSize:11,color:"#9ca3af"}}>{pct.toFixed(1)}%</span>
                            <span style={{fontSize:14,fontWeight:800,color:"#111",minWidth:56,textAlign:"right"}}>{fmt(val)}</span>
                          </div>
                        </div>
                        <div style={{height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:p.accent,borderRadius:3,transition:"width 0.6s ease",opacity:0.85}}/>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,marginTop:4,borderTop:"2px solid #f3f4f6"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em"}}>Total</span>
                    <span style={{fontSize:22,fontWeight:900,color:"#111"}}>{fmt(totalFollowers)}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{marginTop:40,paddingTop:20,borderTop:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:"#d1d5db"}}>Powered by Dash</span>
          {lastSync && <span style={{fontSize:11,color:"#d1d5db"}}>Last synced: {lastSync}</span>}
        </div>
      </div>
    </div>
  );
}
