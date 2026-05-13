import { brands, type BrandId } from "../../brands/brands";
import styles from "./MobileNavigation.module.css";

type MobileNavigationProps = {
  brand: BrandId;
  className?: string;
  onLogoDoubleClick?: () => void;
  tone?: "light" | "dark";
};

export function MobileNavigation({
  brand,
  className,
  onLogoDoubleClick,
  tone = "light",
}: MobileNavigationProps) {
  const config = brands[brand];

  return (
    <header
      className={[styles.navigation, className].filter(Boolean).join(" ")}
      data-brand={brand}
      data-tone={tone}
      data-node-id={brand === "bugaboo" ? "8612:3137" : "8612:3644"}
      aria-label={`${config.name} mobile navigation`}
    >
      <div className={styles.side}>
        <button className={styles.iconButton} type="button" aria-label="Open menu">
          <MenuIcon />
        </button>
      </div>

      <button
        className={styles.logoButton}
        type="button"
        aria-label={`${config.name} home`}
        onDoubleClick={onLogoDoubleClick}
      >
        <span className={styles.logoFrame}>
          <img
            className={styles.logoAsset}
            src={config.navigation.logoSrc}
            alt={config.navigation.logoAlt}
            width={config.navigation.logoWidth}
            height={config.navigation.logoHeight}
          />
        </span>
      </button>

      <div className={styles.side}>
        <button className={styles.iconButton} type="button" aria-label="Search">
          <SearchIcon />
        </button>
        <button className={styles.iconButton} type="button" aria-label="Open basket">
          <BasketIcon />
        </button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8.5h14" />
      <path d="M5 15.5h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.4" cy="10.4" r="5.6" />
      <path d="m14.7 14.7 4.1 4.1" />
    </svg>
  );
}

function BasketIcon() {
  return (
    <svg className={styles.basketIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.1 8.6V6.9a3.9 3.9 0 0 1 7.8 0v1.7" />
      <path d="M5.8 8.6h12.4l-.8 9.8H6.6L5.8 8.6Z" />
    </svg>
  );
}
