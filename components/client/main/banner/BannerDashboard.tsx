"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getApiErrorMessage } from "@/lib/api-error";
import { imageService } from "@/services/image.service";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";

const BannerDashboard = () => {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  const {
    data: items = [],
    error,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["images", "banners"],
    queryFn: () => imageService.getByFolder("banners"),
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return <div className="aspect-33/7 w-full animate-pulse bg-slate-100" />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex min-h-32 w-full flex-col items-center justify-center gap-3 bg-white px-4 text-center text-rose-600"
      >
        <p>
          {getApiErrorMessage(
            error,
            "Unable to load banners. Please try again.",
          )}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-lg bg-[#01579B] px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isFetching ? "Trying again..." : "Try again"}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-[#ebeef0]">
      <Carousel className="w-full" opts={{ loop: true }} plugins={[autoplay]}>
        <CarouselContent className="ml-0">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-0">
              <Image
                alt={`Banner ${index + 1}`}
                src={item.url}
                width={3960}
                height={840}
                className="block h-auto w-full object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BannerDashboard;
