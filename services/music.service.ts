import { api } from "@/lib/api";

export type ChartPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface ChartMovement {
  direction: "up" | "down" | "same" | "new";
  change: number | null;
}

export interface RankedArtist {
  rank: number;
  previousRank: number | null;
  peakRank: number;
  periodsOnChart: number;
  movement: ChartMovement;
  artist: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  };
}

export interface RankedTrack {
  rank: number;
  previousRank: number | null;
  peakRank: number;
  periodsOnChart: number;
  movement: ChartMovement;
  track: {
    id: string;
    title: string;
    slug: string;
    durationMs: number;
    coverUrl: string | null;
    audioUrl: string;
    artists: Array<{ id: string; name: string }>;
    favoriteCount: number;
    isFavorite: boolean;
  };
}

export interface MusicDashboardData {
  genre: { name: string; slug: string };
  period: ChartPeriod;
  artists: RankedArtist[];
  composers: RankedArtist[];
  trending: RankedTrack[];
}

export const musicService = {
  getDashboard: async (period: ChartPeriod) => {
    const response = await api.get<MusicDashboardData>("/music/dashboard", {
      params: { period },
    });
    return response.data;
  },

  addFavorite: async (trackId: string) => {
    const response = await api.post(`/music/tracks/${trackId}/favorite`);
    return response.data;
  },

  removeFavorite: async (trackId: string) => {
    const response = await api.delete(`/music/tracks/${trackId}/favorite`);
    return response.data;
  },
};
