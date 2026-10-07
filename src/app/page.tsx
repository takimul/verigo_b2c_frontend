import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <CategoryShowcase />
        <FeaturedProducts />
      </main>
    </>
  );
}
