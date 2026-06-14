import Description from "@/components/landing/Description";
import Eyebrow from "@/components/landing/Eyebrow";
import Footer from "@/components/landing/Footer";
import GuideComment from "@/components/landing/GuideComment";
import GuideStep from "@/components/landing/GuideStep";
import LandingHeader from "@/components/landing/LandingHeader";
import Title from "@/components/landing/Title";
import QrScan from "@spaceorder/ui/components/qr-scan/QrScan";

export default function LandingPage() {
  return (
    <div className="landing-layout w-full min-h-dvh flex flex-col text-black">
      <LandingHeader />

      <main className="flex-1 flex flex-col items-center text-center justify-center py-4.5">
        <Eyebrow />
        <Title />
        <Description />
        <QrScan />
        <GuideComment />
        <GuideStep />
      </main>
      <Footer />
    </div>
  );
}
