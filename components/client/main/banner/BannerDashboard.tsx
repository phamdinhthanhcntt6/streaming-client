"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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

  const { data: items = [], isPending } = useQuery({
    queryKey: ["images", "banners"],
    queryFn: () => imageService.getByFolder("banners"),
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return <div className="aspect-33/7 w-full animate-pulse bg-slate-100" />;
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
