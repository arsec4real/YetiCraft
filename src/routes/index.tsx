import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Copy,
  Check,
  Youtube,
  Instagram,
  Twitch,
  MessageCircle,
  Upload,
  Server,
  Sparkles,
} from "lucide-react";
import defaultAvatar from "@/assets/prajwol.jpg";
import defaultServerIcon from "@/assets/server-icon.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prajwol_God — Owner of YetiCraft Minecraft Server" },
      {
        name: "description",
        content:
          "Official portfolio of Prajwol_God, owner of the YetiCraft Minecraft server. Join via Java or Bedrock and connect on social media.",
      },
      { property: "og:title", content: "Prajwol_God — YetiCraft Owner" },
      {
        property: "og:description",
        content: "Join YetiCraft on Java & Bedrock. Follow Prajwol_God's content.",
      },
    ],
  }),
  component: Index,
});

const JAVA_IP = "play.yeticraft.fun:19168";
const BEDROCK_IP = "play.yeticraft.fun:19650";

const SOCIALS = [
  { name: "YouTube", url: "https://www.youtube.com/@Prajwolgod", Icon: Youtube, color: "#ff2d55" },
  { name: "TikTok", url: "https://www.tiktok.com/404?fromUrl=/yeticraft1", Icon: Sparkles, color: "#25f4ee" },
  { name: "Discord", url: "https://discord.gg/qWeDPM9q5g", Icon: MessageCircle, color: "#5865f2" },
];

function useStoredImage(key: string, fallback: string) {
  const [src, setSrc] = useState<string>(fallback);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (stored) setSrc(stored);
  }, [key]);
  const update = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSrc(result);
      try {
        localStorage.setItem(key, result);
      } catch {
        toast.error("Image too large to save locally");
      }
    };
    reader.readAsDataURL(file);
  };
  return [src, update] as const;
}

function FloatingCube({
  delay = 0,
  size = 60,
  x = "10%",
  y = "20%",
  color = "#5fd0ff",
}: {
  delay?: number;
  size?: number;
  x?: string;
  y?: string;
  color?: string;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: size, height: size, perspective: 600 }}
      animate={{ y: [0, -25, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 14 + delay * 2, repeat: Infinity, ease: "linear" }}
      >
        {(
          [
            { t: `translateZ(${size / 2}px)` },
            { t: `rotateY(180deg) translateZ(${size / 2}px)` },
            { t: `rotateY(90deg) translateZ(${size / 2}px)` },
            { t: `rotateY(-90deg) translateZ(${size / 2}px)` },
            { t: `rotateX(90deg) translateZ(${size / 2}px)` },
            { t: `rotateX(-90deg) translateZ(${size / 2}px)` },
          ] as const
        ).map((face, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-md border"
            style={{
              transform: face.t,
              background: `linear-gradient(135deg, ${color}55, ${color}22)`,
              borderColor: `${color}88`,
              boxShadow: `inset 0 0 20px ${color}44, 0 0 30px ${color}33`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} IP copied!`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={copy}
      className="group flex items-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-300 ring-1 ring-cyan-400/40 transition hover:bg-cyan-400/20 hover:ring-cyan-300"
      aria-label={`Copy ${label} IP`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ImageUploader({
  src,
  onUpload,
  shape,
  alt,
}: {
  src: string;
  onUpload: (file: File) => void;
  shape: "circle" | "square";
  alt: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const radiusClass = shape === "circle" ? "rounded-full" : "rounded-2xl";
  return (
    <div className="group relative" style={{ perspective: 1000 }}>
      <motion.div
        whileHover={{ rotateY: 12, rotateX: -8, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative overflow-hidden ${radiusClass} ring-4 ring-cyan-400/40`}
      >
        <img
          src={src}
          alt={alt}
          className={`h-44 w-44 object-cover ${radiusClass} md:h-56 md:w-56`}
          loading="lazy"
          width={224}
          height={224}
        />
        <div
          className={`pointer-events-none absolute inset-0 ${radiusClass}`}
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%)",
          }}
        />
      </motion.div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Index() {
  const [avatar, setAvatar] = useStoredImage("yc_avatar", defaultAvatar);
  const [serverIcon, setServerIcon] = useStoredImage("yc_server_icon", defaultServerIcon);

  return (
    <div
      className="relative min-h-screen overflow-hidden text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% -10%, #1e3a8a55, transparent), radial-gradient(900px 500px at 90% 10%, #0891b266, transparent), linear-gradient(180deg, #050816 0%, #0a1024 60%, #050816 100%)",
      }}
    >
      <Toaster theme="dark" position="top-center" richColors />

      {/* Floating 3D cubes */}
      <FloatingCube x="5%" y="15%" size={70} color="#22d3ee" delay={0} />
      <FloatingCube x="85%" y="20%" size={50} color="#a78bfa" delay={1} />
      <FloatingCube x="10%" y="70%" size={45} color="#34d399" delay={2} />
      <FloatingCube x="80%" y="75%" size={65} color="#f472b6" delay={1.5} />
      <FloatingCube x="50%" y="8%" size={40} color="#fbbf24" delay={0.5} />
      <FloatingCube x="92%" y="55%" size={35} color="#60a5fa" delay={2.5} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-cyan-300">
            <Sparkles className="h-4 w-4" /> YETICRAFT
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/40 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Server Online
          </div>
        </motion.div>

        {/* Hero */}
        <section className="grid items-center gap-12 md:grid-cols-[auto_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="flex justify-center md:justify-start"
          >
            <ImageUploader
              src={avatar}
              onUpload={setAvatar}
              shape="circle"
              alt="Prajwol_God avatar"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center md:text-left"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Owner & Founder
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
              Prajwol_God
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300 md:text-xl">
              Builder of worlds. Creator of{" "}
              <span className="font-semibold text-cyan-300">YetiCraft</span> — a Minecraft server
              where adventure never endes.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
              {["Survival", "PvP", "Vanilla", "Cracked Friendly"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Server Card */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl md:p-10"
          style={{ boxShadow: "0 30px 80px -20px rgba(34, 211, 238, 0.25)" }}
        >
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <ImageUploader
              src={serverIcon}
              onUpload={setServerIcon}
              shape="square"
              alt="YetiCraft server icon"
            />

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                <Server className="h-4 w-4" /> JOIN THE SERVER
              </div>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">YetiCraft Network</h2>
              <p className="mt-2 text-slate-300">
                Cross-play enabled. Pick your edition below and copy the IP to join.
              </p>

              <div className="mt-6 space-y-3">
                <IpRow label="Java Edition" ip={JAVA_IP} accent="cyan" />
                <IpRow label="Bedrock Edition" ip={BEDROCK_IP} accent="violet" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Socials */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Follow Prajwol_God
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {SOCIALS.map(({ name, url, Icon, color }, i) => (
              <motion.a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition"
                style={{
                  boxShadow: `0 0 0 0 ${color}00`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${color}33, transparent 70%)`,
                  }}
                />
                <Icon className="relative h-7 w-7" style={{ color }} />
                <span className="relative text-sm font-medium text-slate-200">{name}</span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        <footer className="mt-20 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Prajwol_God · YetiCraft. Not affiliated with Mojang.
        </footer>
      </main>
    </div>
  );
}

function IpRow({
  label,
  ip,
  accent,
}: {
  label: string;
  ip: string;
  accent: "cyan" | "violet";
}) {
  const accentBg = accent === "cyan" ? "bg-cyan-400/10" : "bg-violet-400/10";
  const accentText = accent === "cyan" ? "text-cyan-300" : "text-violet-300";
  const accentRing = accent === "cyan" ? "ring-cyan-400/30" : "ring-violet-400/30";
  return (
    <div
      className={`flex flex-col items-stretch gap-3 rounded-xl ${accentBg} p-4 ring-1 ${accentRing} sm:flex-row sm:items-center sm:justify-between`}
    >
      <div>
        <div className={`text-xs font-semibold uppercase tracking-widest ${accentText}`}>
          {label}
        </div>
        <div className="mt-1 font-mono text-lg font-semibold text-white">{ip}</div>
      </div>
      <CopyButton value={ip} label={label} />
    </div>
  );
}