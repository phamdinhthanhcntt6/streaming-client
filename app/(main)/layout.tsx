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
      <main className="mx-auto mt-2 flex w-full max-w-360 flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
