import styles from "./qr-scan.module.css";

export default function QrScan() {
  return (
    <div
      className="relative w-[216px] h-[216px] mb-5"
      role="img"
      aria-label="QR 코드 스캔 영역"
    >
      <div className="absolute inset-0 rounded-3xl bg-white shadow-lg overflow-hidden">
        <svg
          className="absolute inset-8.5 opacity-90 fill-black"
          width="148"
          height="148"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M0 0h28v28H0z M6 6v16h16V6z M10 10h8v8h-8z" />
          <path d="M72 0h28v28H72z M78 6v16h16V6z M82 10h8v8h-8z" />
          <path d="M0 72h28v28H0z M6 78v16h16V78z M10 82h8v8h-8z" />
          <rect x="36" y="4" width="6" height="6" />
          <rect x="48" y="4" width="6" height="6" />
          <rect x="42" y="14" width="6" height="6" />
          <rect x="54" y="14" width="6" height="6" />
          <rect x="36" y="24" width="6" height="6" />
          <rect x="60" y="24" width="6" height="6" />
          <rect x="4" y="36" width="6" height="6" />
          <rect x="16" y="36" width="6" height="6" />
          <rect x="40" y="38" width="6" height="6" />
          <rect x="52" y="38" width="6" height="6" />
          <rect x="72" y="38" width="6" height="6" />
          <rect x="90" y="36" width="6" height="6" />
          <rect x="10" y="48" width="6" height="6" />
          <rect x="34" y="50" width="6" height="6" />
          <rect x="46" y="50" width="6" height="6" />
          <rect x="64" y="48" width="6" height="6" />
          <rect x="82" y="48" width="6" height="6" />
          <rect x="40" y="62" width="6" height="6" />
          <rect x="56" y="62" width="6" height="6" />
          <rect x="72" y="60" width="6" height="6" />
          <rect x="90" y="62" width="6" height="6" />
          <rect x="38" y="74" width="6" height="6" />
          <rect x="50" y="74" width="6" height="6" />
          <rect x="68" y="74" width="6" height="6" />
          <rect x="84" y="74" width="6" height="6" />
          <rect x="44" y="86" width="6" height="6" />
          <rect x="60" y="88" width="6" height="6" />
          <rect x="76" y="86" width="6" height="6" />
          <rect x="90" y="88" width="6" height="6" />
        </svg>
        <div className={styles.scanline} />
      </div>
      {[styles.tl, styles.tr, styles.bl, styles.br].map((corner) => (
        <span key={corner} className={`${styles.corner} ${corner}`} />
      ))}
    </div>
  );
}
