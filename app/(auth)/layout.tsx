import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-900 bg-opacity-95 p-4 sm:p-8 bg-auth">
      {/* 2-column container */}
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden h-auto min-h-150">
        {/* Left column: Form content */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {children}
        </div>

        {/* Right column: Image (Hidden on small screens) */}
        <div className="hidden lg:block lg:w-1/2 p-4">
          <Image
            src="/image-auth.png"
            alt="image"
            width={500}
            height={500}
            className="w-full h-full bg-cover bg-center rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
