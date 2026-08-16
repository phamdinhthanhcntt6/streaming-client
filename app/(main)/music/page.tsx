import { redirect } from "next/navigation";

export const metadata = {
  title: "Music | Streaming App",
  description: "Explore music and the most interesting live streams",
};

const MusicPage = () => {
  redirect("/#music");
};

export default MusicPage;
