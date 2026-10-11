import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import OemOdmSection from "@/components/home/OemOdmSection";
import WhyVerigo from "@/components/home/WhyVerigo";
import InquiryBanner from "@/components/home/InquiryBanner";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <CategoryShowcase />
        <FeaturedProducts />
        <OemOdmSection />
        <WhyVerigo />
        <InquiryBanner />
      </main>
    </>
  );
}
