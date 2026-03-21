import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import DarkVeil from "@/components/DarkVeil";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DarkVeil />
      <Header />
      <main className="z-20 relative w-full max-w-7xl px-4 pt-0 md:pt-0 mx-auto -mt-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
