import Hero from "@/components/home/Hero";
import SecondBanner from "@/components/home/SecondBanner";
import Categories from "@/components/home/Categories";
import Story from "@/components/home/Story";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <SecondBanner />
      <Categories />
      <Story />
      <Testimonials />
      <Newsletter />
    </>
  );
}