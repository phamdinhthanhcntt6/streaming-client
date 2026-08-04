import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 bg-opacity-95 p-4 sm:p-8 bg-auth">
      {/* Container 2 cột */}
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden h-auto min-h-150">
        {/* Cột trái: Form nội dung */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {children}
        </div>

        {/* Cột phải: Hình ảnh (Ẩn trên màn hình nhỏ) */}
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
