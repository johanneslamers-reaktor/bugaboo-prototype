import { useEffect, useState } from "react";
import type { BrandId } from "./brands/brands";
import { BrandUsp } from "./components/BrandUsp";
import { CategoryCarousel } from "./components/CategoryCarousel";
import { EditorialRail } from "./components/EditorialRail";
import { Hero } from "./components/Hero";
import { ProductCarousel } from "./components/ProductCarousel";
import {
  homepageBrandUsp,
  homepageCategoryCarousel,
  homepageEditorialRail,
  homepageHero,
  homepageProductCarousel,
} from "./data/homepage";
import { getDefaultProduct, getProductBySlug } from "./data/products";
import { ProductMasterPage } from "./pages/ProductMasterPage";
import styles from "./App.module.css";

const nextBrand: Record<BrandId, BrandId> = {
  bugaboo: "joolz",
  joolz: "bugaboo",
};

type AppRoute =
  | {
      kind: "homepage";
      brand?: BrandId;
      variant?: "v1" | "v2";
    }
  | {
      kind: "product";
      brand: BrandId;
      slug: string;
    };

function parseRoute(pathname: string): AppRoute {
  const [, brandSegment, productsSegment, slugSegment] = pathname.split("/");

  if (brandSegment === "bugaboo" || brandSegment === "joolz") {
    if (productsSegment === "products" && slugSegment) {
      return {
        kind: "product",
        brand: brandSegment,
        slug: slugSegment,
      };
    }
    // /bugaboo/v1 or /bugaboo/v2 → branded homepage with variant
    // /bugaboo or /joolz (no variant) → default to v1
    const variant = productsSegment === "v2" ? "v2" : "v1";
    return { kind: "homepage", brand: brandSegment, variant };
  }

  return { kind: "homepage" };
}

export default function App() {
  const route = parseRoute(window.location.pathname);
  const initialBrand: BrandId =
    route.kind === "product" ? route.brand : (route.brand ?? "bugaboo");
  const [brand, setBrand] = useState<BrandId>(initialBrand);
  const pageBrand = route.kind === "product" ? route.brand : brand;
  const product =
    route.kind === "product"
      ? (getProductBySlug(route.brand, route.slug) ??
        getDefaultProduct(route.brand))
      : null;

  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView();
    });
  }, []);

  return (
    <main className={styles.page} data-brand={pageBrand}>
      <div className={styles.previewGrid}>
        <section
          className={styles.previewPanel}
          aria-label={`${pageBrand} prototype preview`}
        >
          <div className={styles.phoneCanvas}>
            {route.kind === "product" && product ? (
              <ProductMasterPage brand={route.brand} product={product} />
            ) : (
              <>
                <Hero
                  brand={brand}
                  content={homepageHero[brand]}
                  onLogoDoubleClick={() => setBrand(nextBrand[brand])}
                />
                <CategoryCarousel
                  brand={brand}
                  content={homepageCategoryCarousel[brand]}
                />
                <BrandUsp brand={brand} content={homepageBrandUsp[brand]} />
                <ProductCarousel
                  brand={brand}
                  content={homepageProductCarousel[brand]}
                />
                <EditorialRail
                  brand={brand}
                  content={homepageEditorialRail[brand]}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
