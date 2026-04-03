import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectGallery from "@/components/sections/ProjectGallery";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <ProjectGallery />
      <Footer />
    </main>
  );
}
