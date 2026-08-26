import { api } from "@/lib/api";

export interface ImageAsset {
  id: string;
  path: string;
  folder: string;
  url: string;
}

interface ImagesResponse {
  images: ImageAsset[];
}

export const imageService = {
  getByFolder: async (folder: string) => {
    const response = await api.get<ImagesResponse>("/images", {
      params: { folder },
    });
    return response.data.images;
  },
};
