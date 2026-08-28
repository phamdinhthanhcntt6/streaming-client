import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col mt-2">{children}</main>
      <Footer />
    </div>
  );
}
