import BannerDashboard from "@/components/client/main/banner/BannerDashboard";
import MusicDashboard from "@/components/client/main/music/MusicDashboard";
import { Link } from "lucide-react";

export const metadata = {
  title: "Home | Streaming App",
  description: "Explore music, charts, artists, composers, and videos.",
};

export default function HomePage() {
  return (
    <>
      <section id="music" aria-label="Music">
        <MusicDashboard />
      </section>

      <section id="banner" aria-label="Banner">
        <BannerDashboard />
      </section>

      <section
        id="video"
        className="min-h-96 bg-white px-4 py-16 sm:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-360">
          <div className="group/title flex w-fit items-center gap-1">
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Video
            </h2>
            <a
              href="#video"
              aria-label="Link to Video section"
              title="Link to Video section"
              className="grid size-9 place-items-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-[#08b9b2] focus-visible:opacity-100 group-hover/title:opacity-100"
            >
              <Link className="size-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
