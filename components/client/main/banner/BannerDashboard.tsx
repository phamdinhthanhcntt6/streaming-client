"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState } from "react";

const items = [
  { index: 1, imgSrc: "/banner.png" },
  { index: 2, imgSrc: "/banner.png" },
];

const BannerDashboard = () => {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  return (
    <div className="w-full overflow-hidden bg-white">
      <Carousel className="w-full" opts={{ loop: true }} plugins={[autoplay]}>
        <CarouselContent className="ml-0">
          {items.map((item) => (
            <CarouselItem key={item.index} className="pl-0">
              <Image
                alt={`Banner ${item.index}`}
                src={item.imgSrc}
                width={3960}
                height={840}
                className="block h-auto w-full object-cover"
                priority={item.index === 1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BannerDashboard;
