import { useMemo, useState } from "react";
import type { BrandId } from "../../brands/brands";
import { MobileNavigation } from "../../components/MobileNavigation";
import { ProductAccordion } from "../../components/ProductAccordion";
import { ProductBundle } from "../../components/ProductBundle";
import { ProductCrossSell } from "../../components/ProductCrossSell";
import { ProductFeatureBenefits } from "../../components/ProductFeatureBenefits";
import { ProductFloatingCta } from "../../components/ProductFloatingCta";
import { ProductGallery } from "../../components/ProductGallery";
import { ProductImpact } from "../../components/ProductImpact";
import { ProductReasons } from "../../components/ProductReasons";
import { ProductSummary } from "../../components/ProductSummary";
import { ProductUsp } from "../../components/ProductUsp";
import { ProductVideoStory } from "../../components/ProductVideoStory";
import type { ProductDetail } from "../../data/products";
import styles from "./ProductMasterPage.module.css";

type ProductMasterPageProps = {
  brand: BrandId;
  product: ProductDetail;
};

export function ProductMasterPage({ brand, product }: ProductMasterPageProps) {
  const [selectedColorwayId, setSelectedColorwayId] = useState(product.colorways[0].id);
  const selectedColorway = useMemo(() => (
    product.colorways.find((colorway) => colorway.id === selectedColorwayId) ?? product.colorways[0]
  ), [product.colorways, selectedColorwayId]);

  return (
    <article className={styles.page} data-brand={brand}>
      <MobileNavigation brand={brand} className={styles.navigation} tone="dark" />
      <ProductGallery brand={brand} colorway={selectedColorway} productTitle={product.title} />

      <div className={styles.productContent}>
        <ProductSummary
          brand={brand}
          product={product}
          selectedColorway={selectedColorway}
          onColorwayChange={setSelectedColorwayId}
        />
        <ProductReasons brand={brand} items={product.reasons} />
        <ProductAccordion brand={brand} items={product.accordions} />
        <ProductImpact brand={brand} content={product.impact} />
        {product.featureBenefits ? (
          <ProductFeatureBenefits brand={brand} content={product.featureBenefits} />
        ) : null}
        {product.bundle ? (
          <ProductBundle brand={brand} content={product.bundle} />
        ) : null}
        {product.crossSell ? (
          <ProductCrossSell brand={brand} content={product.crossSell} />
        ) : null}
        {product.productUsp ? (
          <ProductUsp brand={brand} content={product.productUsp} />
        ) : null}
        {product.videoStory ? (
          <ProductVideoStory brand={brand} content={product.videoStory} />
        ) : null}
      </div>

      <ProductFloatingCta
        brand={brand}
        compareAtPrice={product.floatingCta?.compareAtPrice}
        financing={product.floatingCta?.financing}
        price={product.price}
        productTitle={`${product.title}${product.titleSuffix ?? ""}`}
      />
    </article>
  );
}
