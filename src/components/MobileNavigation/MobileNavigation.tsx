import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { brands, type BrandId } from "../../brands/brands";
import { productCatalog } from "../../data/products";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={[styles.navigation, className].filter(Boolean).join(" ")}
      data-brand={brand}
      data-tone={tone}
      data-node-id={brand === "bugaboo" ? "8612:3137" : "8612:3644"}
      aria-label={`${config.name} mobile navigation`}
    >
      <div className={styles.side}>
        <button
          className={styles.iconButton}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MenuIcon />
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {isMenuOpen ? (
            <DebugMenu key="debug-menu" brand={brand} onClose={() => setIsMenuOpen(false)} />
          ) : null}
        </AnimatePresence>,
        document.body,
      )}

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

/**
 * Debug menu — lists every working route in the prototype so we can hop
 * around without rebuilding URLs from memory.
 *
 * Uses plain anchor tags (full page navigation) on purpose: the app is
 * SPA-routed via window.location.pathname parsing on mount, so an anchor
 * click re-runs the route parse with a clean state.
 */
function DebugMenu({ brand, onClose }: { brand: BrandId; onClose: () => void }) {
  const sections: { brand: BrandId; label: string; items: { href: string; label: string; sublabel?: string }[] }[] = [
    {
      brand: "bugaboo",
      label: "Bugaboo",
      items: [
        { href: "/bugaboo", label: "Homepage", sublabel: "Bugaboo home" },
        ...productCatalog.bugaboo.map((p) => ({
          href: `/bugaboo/products/${p.slug}`,
          label: p.title + (p.titleSuffix ? ` ${p.titleSuffix}` : ""),
          sublabel: p.subtitle,
        })),
      ],
    },
    {
      brand: "joolz",
      label: "Joolz",
      items: [
        { href: "/joolz", label: "Homepage", sublabel: "Joolz home" },
        ...productCatalog.joolz.map((p) => ({
          href: `/joolz/products/${p.slug}`,
          label: p.title + (p.titleSuffix ? ` ${p.titleSuffix}` : ""),
          sublabel: p.subtitle,
        })),
      ],
    },
  ];

  return (
    <motion.div
      className={styles.debugMenuRoot}
      data-active-brand={brand}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        className={styles.debugMenuBackdrop}
        type="button"
        aria-label="Close menu"
        onClick={onClose}
      />
      <motion.nav
        className={styles.debugMenu}
        aria-label="Debug navigation"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 36, mass: 0.7 }}
      >
        <div className={styles.debugMenuHeader}>
          <span className={styles.debugMenuKicker}>Debug</span>
          <h2 className={styles.debugMenuTitle}>Working routes</h2>
          <button
            className={styles.debugMenuClose}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {sections.map((section) => (
          <div className={styles.debugMenuSection} key={section.brand} data-brand={section.brand}>
            <p className={styles.debugMenuSectionLabel}>{section.label}</p>
            <ul className={styles.debugMenuList}>
              {section.items.map((item) => (
                <li key={item.href}>
                  <a className={styles.debugMenuItem} href={item.href}>
                    <span className={styles.debugMenuItemLabel}>{item.label}</span>
                    {item.sublabel ? (
                      <span className={styles.debugMenuItemSub}>{item.sublabel}</span>
                    ) : null}
                    <span className={styles.debugMenuItemPath}>{item.href}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.nav>
    </motion.div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
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
