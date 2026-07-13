import styles from "@/components/landing/landing.module.css";
import TextLogo from "@ssurak/ui/components/TextLogo";

export default function LandingHeader() {
  return (
    <header className="flex items-center justify-between p-4">
      <TextLogo />
      <span className={styles.status}>주문 가능</span>
    </header>
  );
}
