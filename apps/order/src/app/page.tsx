import Description from "@/components/landing/Description";
import Eyebraw from "@/components/landing/Eyebraw";
import Footer from "@/components/landing/Footer";
import GuideComment from "@/components/landing/GuideComment";
import GuideQrScan from "@/components/landing/GuideQrScan";
import GuideStep from "@/components/landing/GuideStep";
import LandingHeader from "@/components/landing/LandingHeader";
import Title from "@/components/landing/Title";
import styles from "@/components/landing/landing.module.css";

export default function LandingPage() {
  return (
    <div
      className={`w-full min-h-dvh flex flex-col text-black ${styles.layout}`}
    >
      <LandingHeader />

      <main className="flex-1 flex flex-col items-center text-center justify-center py-4.5">
        <Eyebraw />
        <Title />
        <Description />
        <GuideQrScan />
        <GuideComment />
        <GuideStep />
      </main>
      <Footer />
    </div>
  );
}
