import MarketingHeader from "./components/MarketingHeader";
import MarketingFooter from "./components/MarketingFooter";
import HeroSection from "./components/HeroSection";
import TrustHighlights from "./components/TrustHighlights";
import AboutPreview from "./components/AboutPreview";
import ServicesSection from "./components/ServicesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import ProjectsSection from "./components/ProjectsSection";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";

export default function ManufacturingHome() {
  document.title = "Manufex";

  return (
    <div className="manufacturing-site">
      <MarketingHeader />
      <main>
        <HeroSection />
        <TrustHighlights />
        <AboutPreview />
        {/* <ServicesSection /> */}
        {/* <WhyChooseUs /> */}
        {/* <ProjectsSection /> */}
        <StatsSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
