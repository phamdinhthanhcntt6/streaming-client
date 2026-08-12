import { Hexagon } from "lucide-react";

const Logo = () => {
  return (
    <div className="w-16 h-16 bg-emerald-400 text-white rounded-lg flex items-center justify-center transform rotate-45 mb-2 shadow-lg">
      <Hexagon className="w-8 h-8 -rotate-45" fill="currentColor" />
    </div>
  );
};

export default Logo;
