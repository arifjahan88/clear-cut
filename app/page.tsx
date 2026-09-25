
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { SpecsSection } from "@/components/home/SpecsSection";
import { FaqSection } from "@/components/home/FaqSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <FeaturesSection />
        <SpecsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
