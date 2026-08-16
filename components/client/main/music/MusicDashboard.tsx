"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  type ChartMovement,
  type ChartPeriod,
  type MusicDashboardData,
  type RankedArtist,
  type RankedTrack,
  musicService,
} from "@/services/music.service";
import { useAuthStore } from "@/stores/auth.store";
import {
  ChevronDown,
  Flame,
  Heart,
  Link,
  Minus,
  MoreHorizontal,
  Music2,
  Play,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const periodOptions: Array<{ label: string; value: ChartPeriod }> = [
  { label: "Today", value: "DAILY" },
  { label: "Week", value: "WEEKLY" },
  { label: "Month", value: "MONTHLY" },
];

const periodUnit: Record<ChartPeriod, string> = {
  DAILY: "Days",
  WEEKLY: "Weeks",
  MONTHLY: "Months",
};

function Movement({ movement }: { movement: ChartMovement }) {
  if (movement.direction === "up") {
    return <TrendingUp className="size-4 fill-emerald-500 text-emerald-500" />;
  }

  if (movement.direction === "down") {
    return <TrendingDown className="size-4 fill-rose-500 text-rose-500" />;
  }

  if (movement.direction === "new") {
    return (
      <span className="size-2 rounded-full bg-blue-500" title="New entry" />
    );
  }

  return <Minus className="size-4 text-slate-400" />;
}

function ArtistChart({
  title,
  entries,
  period,
}: {
  title: string;
  entries: RankedArtist[];
  period: ChartPeriod;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="min-w-0 rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-4">
      <h2 className="px-2 pb-3 text-xl font-bold text-slate-800 sm:text-2xl">
        {title}{" "}
        <span className="font-semibold text-slate-500">{entries.length}</span>
      </h2>
      <div className="space-y-1">
        {entries.map((entry, index) => {
          const selected = selectedId
            ? selectedId === entry.artist.id
            : index === 1;

          return (
            <button
              type="button"
              key={entry.artist.id}
              onClick={() => setSelectedId(entry.artist.id)}
              className={`grid w-full grid-cols-[1.5rem_3.5rem_1fr] items-center gap-2 rounded-xl px-2 py-2 text-left transition sm:grid-cols-[1.75rem_3.5rem_1fr] ${
                selected ? "bg-sky-100/80" : "hover:bg-slate-50"
              }`}
            >
              <span className="text-center text-lg font-semibold text-slate-500">
                {entry.rank}
              </span>
              <Avatar className="size-14 rounded-xl">
                <AvatarImage
                  src={entry.artist.avatarUrl || undefined}
                  alt={entry.artist.name}
                  className="rounded-xl"
                />
                <AvatarFallback className="rounded-xl font-bold">
                  {entry.artist.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate text-base font-bold text-slate-800 sm:text-lg">
                  {entry.artist.name}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500 sm:text-sm">
                  {entry.previousRank ?? "New"} Last · {entry.peakRank} Peak ·{" "}
                  {entry.periodsOnChart} {periodUnit[period]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TrendingChart({
  entries,
  period,
  onPeriodChange,
  onFavorite,
}: {
  entries: RankedTrack[];
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  onFavorite: (entry: RankedTrack) => void;
}) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  return (
    <section className="min-w-0 rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-4">
      <div className="flex flex-col gap-3 px-2 pb-3 sm:flex-row sm:items-center">
        <h2 className="flex shrink-0 items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
          <Flame className="size-7 fill-orange-500 text-orange-500" />
          Hot trending
        </h2>
        <div className="flex items-center gap-5 sm:ml-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPeriodChange(option.value)}
              className={`border-b-2 pb-1 text-sm font-semibold transition sm:text-base ${
                period === option.value
                  ? "border-slate-600 text-slate-700"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {entries.map((entry, index) => {
          const selected = selectedTrackId
            ? selectedTrackId === entry.track.id
            : index === 1;

          return (
            <div
              key={entry.track.id}
              className={`grid grid-cols-[2rem_1.2rem_4.75rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-2 py-2 transition sm:grid-cols-[2rem_1.5rem_4.75rem_minmax(0,1fr)_auto] ${
                selected ? "bg-sky-100/80" : "hover:bg-slate-50"
              }`}
            >
              <span className="text-center text-lg font-semibold text-slate-500">
                {entry.rank}
              </span>
              <span className="flex flex-col items-center gap-1 text-[10px] text-slate-500">
                <span>{entry.previousRank ?? ""}</span>
                <Movement movement={entry.movement} />
              </span>
              <button
                type="button"
                onClick={() => setSelectedTrackId(entry.track.id)}
                className="group relative"
                aria-label={`Play ${entry.track.title}`}
              >
                <Avatar className="size-19 rounded-xl">
                  <AvatarImage
                    src={entry.track.coverUrl || undefined}
                    alt={entry.track.title}
                    className="rounded-xl"
                  />
                  <AvatarFallback className="rounded-xl bg-slate-200">
                    <Music2 />
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute inset-0 grid place-items-center rounded-xl bg-slate-950/30 transition ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow">
                    <Play className="ml-0.5 size-4 fill-current" />
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrackId(entry.track.id)}
                className="min-w-0 text-left"
              >
                <span className="block truncate text-base font-bold text-slate-800 sm:text-lg">
                  {entry.track.title}
                </span>
                <span className="mt-1 block truncate text-sm text-slate-500">
                  {entry.track.artists.map((artist) => artist.name).join(" & ")}
                </span>
              </button>
              <div className="flex items-center gap-1 sm:gap-2">
                {selected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onFavorite(entry)}
                      className={`grid size-9 place-items-center rounded-full transition hover:bg-white/70 ${entry.track.isFavorite ? "text-rose-500" : "text-blue-500"}`}
                      aria-label={
                        entry.track.isFavorite
                          ? "Remove favorite"
                          : "Add favorite"
                      }
                    >
                      <Heart
                        className={`size-6 ${entry.track.isFavorite ? "fill-current" : "fill-blue-500"}`}
                      />
                    </button>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-white/70"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="size-5" />
                    </button>
                  </>
                ) : (
                  <span className="w-14 text-right text-sm text-slate-500">
                    {formatDuration(entry.track.durationMs)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatDuration(durationMs: number) {
  const seconds = Math.floor(durationMs / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(250px,1fr)_minmax(430px,1.7fr)_minmax(250px,1fr)]">
      {[0, 1, 2].map((column) => (
        <div
          key={column}
          className="h-184 animate-pulse rounded-2xl bg-white/80"
        />
      ))}
    </div>
  );
}

export default function MusicDashboard() {
  const [period, setPeriod] = useState<ChartPeriod>("DAILY");
  const [dashboard, setDashboard] = useState<MusicDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    if (authStatus === "idle" || authStatus === "loading") return;

    let active = true;

    musicService
      .getDashboard(period)
      .then((data) => {
        if (active) {
          setDashboard(data);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError("Unable to load music charts. Please try again.");
      });

    return () => {
      active = false;
    };
  }, [period, authStatus]);

  const handlePeriodChange = (nextPeriod: ChartPeriod) => {
    setError(null);
    setPeriod(nextPeriod);
  };

  const handleFavorite = async (entry: RankedTrack) => {
    if (authStatus !== "authenticated") {
      toast.error("Please sign in to save favorite tracks.");
      return;
    }

    const nextFavorite = !entry.track.isFavorite;
    const updateFavorite = (value: boolean) => {
      setDashboard((current) =>
        current
          ? {
              ...current,
              trending: current.trending.map((item) =>
                item.track.id === entry.track.id
                  ? {
                      ...item,
                      track: {
                        ...item.track,
                        isFavorite: value,
                        favoriteCount: Math.max(
                          0,
                          item.track.favoriteCount + (value ? 1 : -1),
                        ),
                      },
                    }
                  : item,
              ),
            }
          : current,
      );
    };

    updateFavorite(nextFavorite);

    try {
      if (nextFavorite) await musicService.addFavorite(entry.track.id);
      else await musicService.removeFavorite(entry.track.id);
    } catch {
      updateFavorite(!nextFavorite);
      toast.error("Unable to update favorite. Please try again.");
    }
  };

  return (
    <div className="w-full px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-360">
        <div className="mb-5 flex items-center gap-2 px-1">
          <Music2 className="size-7 fill-[#08b9b2] text-[#08b9b2]" />
          <div className="group/title flex items-center gap-1">
            <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
              Music
            </h1>
            <a
              href="#music"
              aria-label="Link to Music section"
              title="Link to Music section"
              className="grid size-8 place-items-center rounded-lg text-slate-400 opacity-0 transition hover:bg-white hover:text-[#08b9b2] focus-visible:opacity-100 group-hover/title:opacity-100"
            >
              <Link className="size-5" />
            </a>
          </div>
          <button
            type="button"
            className="ml-1 flex items-center gap-1 text-base font-semibold text-slate-500"
          >
            {dashboard?.genre.name || "Pop"}
            <ChevronDown className="size-5" />
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl bg-white p-10 text-center text-rose-600">
            {error}
          </div>
        ) : !dashboard ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(250px,1fr)_minmax(430px,1.75fr)_minmax(250px,1fr)]">
            <ArtistChart
              title="Artist"
              entries={dashboard.artists}
              period={period}
            />
            <TrendingChart
              entries={dashboard.trending}
              period={period}
              onPeriodChange={handlePeriodChange}
              onFavorite={handleFavorite}
            />
            <ArtistChart
              title="Composer"
              entries={dashboard.composers}
              period={period}
            />
          </div>
        )}
      </div>
    </div>
  );
}
