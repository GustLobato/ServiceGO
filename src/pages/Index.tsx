import PublicLayout from "@/components/layouts/PublicLayout";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

const Index = () => (
  <PublicLayout>
    <Hero />
    <HowItWorks />
    <Categories />
    <Testimonials />
    <CTA />
  </PublicLayout>
);

export default Index;
