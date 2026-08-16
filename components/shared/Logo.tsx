import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Streaming Web home page"
      className="group relative z-10 grid size-20 place-items-center bg-[#09bcae] transition-transform hover:scale-105 lg:size-24"
      style={{
        clipPath:
          "polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
      }}
    >
      <span
        className="grid size-[calc(100%-4px)] place-items-center bg-white text-lg font-bold text-[#09bcae] lg:text-xl"
        style={{
          clipPath:
            "polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
        }}
      >
        LOGO
      </span>
    </Link>
  );
};

export default Logo;
