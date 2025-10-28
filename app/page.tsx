import {
  HeroSection,
  TrustBar,
  CategoryGrid,
  FeaturedProducts,
  SustainabilityBlock,
  NewArrivals,
} from "@/components/home";

// Revalidate every 60 seconds to ensure fresh category data
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <SustainabilityBlock />
      <NewArrivals />
    </>
  );
}
