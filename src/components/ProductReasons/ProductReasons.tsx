import type { BrandId } from "../../brands/brands";
import type { ProductReasonItem } from "../../data/products";
import styles from "./ProductReasons.module.css";

type ProductReasonsProps = {
  brand: BrandId;
  items: ProductReasonItem[];
};

export function ProductReasons({ brand, items }: ProductReasonsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.reasons}
      data-brand={brand}
      data-node-id={brand === "joolz" ? "8677:5138" : "8618:3573"}
    >
      <ul className={styles.list} aria-label="Reasons to buy">
        {items.map((item, index) => (
          <li
            className={styles.item}
            data-node-id={getReasonNodeId(brand, index)}
            key={item.id}
          >
            <span className={styles.iconFrame} aria-hidden="true">
              <ReasonIcon id={item.id} />
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getReasonNodeId(brand: BrandId, index: number) {
  if (brand === "joolz") {
    return ["8677:5139", "8677:5144", "8677:5148"][index] ?? "8677:5139";
  }

  return ["8618:3575", "8618:3581", "8618:3586"][index] ?? "8618:3575";
}

const reasonIconSrc: Record<ProductReasonItem["id"], string> = {
  delivery: "/assets/pdp/reasons/delivery.svg",
  trial: "/assets/pdp/reasons/trial.svg",
  warranty: "/assets/pdp/reasons/warranty.svg",
};

function ReasonIcon({ id }: { id: ProductReasonItem["id"] }) {
  return <img className={styles.iconAsset} src={reasonIconSrc[id]} alt="" loading="lazy" />;
}
