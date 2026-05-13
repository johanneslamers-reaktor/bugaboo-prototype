import type { BrandId } from "../../brands/brands";
import type { CategoryCardItem } from "../../data/homepage";
import styles from "./CategoryCard.module.css";

type CategoryCardProps = {
  brand: BrandId;
  item: CategoryCardItem;
};

export function CategoryCard({ brand, item }: CategoryCardProps) {
  return (
    <article className={styles.card} data-brand={brand}>
      <div className={styles.inner}>
        <div className={styles.media}>
          <img
            className={styles.image}
            src={item.imageSrc}
            alt={item.imageAlt}
            loading="lazy"
            decoding="async"
            draggable={false}
            width={260}
            height={260}
          />
        </div>

        <div className={styles.copy}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>
    </article>
  );
}
