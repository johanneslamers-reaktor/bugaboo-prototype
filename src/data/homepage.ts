import type { BrandId } from "../brands/brands";

export type HeroTitle =
  | {
      kind: "plain";
      lines: string[];
    }
  | {
      kind: "highlight";
      before: string;
      highlight: string;
    }
  | {
      kind: "product";
      productName: string;
      productHighlight: string;
      headline: string;
    };

export type HeroContent = {
  nodeId: string;
  eyebrow?: string;
  title: HeroTitle;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  categories: string[][];
  videoSrc?: string;
  posterSrc?: string;
};

export type CategoryCardItem = {
  id: string;
  title: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
};

export type CategoryCarouselContent = {
  nodeId: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  items: CategoryCardItem[];
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductTitleSegment = {
  text: string;
  superscript?: boolean;
};

export type ProductCardItem = {
  id: string;
  badge?: string;
  title: ProductTitleSegment[];
  subtitle: string;
  price: string;
  compareAtPrice?: string;
  images: ProductImage[];
};

export type ProductCarouselContent = {
  nodeId: string;
  title: string;
  items: ProductCardItem[];
};

export type EditorialTitle =
  | {
      kind: "plain";
      lines: string[];
    }
  | {
      kind: "highlight";
      before: string;
      highlight: string;
    };

export type EditorialTitleSegment = {
  text: string;
  serif?: boolean;
};

export type EditorialCardItem = {
  id: string;
  eyebrow: string;
  title: EditorialTitleSegment[];
  imageSrc: string;
  imageAlt: string;
  color?: string;
};

export type EditorialRailContent = {
  nodeId: string;
  title: EditorialTitle;
  subtitle: string;
  ctaLabel: string;
  items: EditorialCardItem[];
};

export type BrandUspTitle =
  | {
      kind: "stacked";
      lines: string[];
    }
  | {
      kind: "highlight";
      before: string;
      highlight: string;
    };

export type BrandUspPoint = {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type BrandUspContent = {
  nodeId: string;
  title: BrandUspTitle;
  imageSrc: string;
  imageAlt: string;
  points: BrandUspPoint[];
  reel: {
    label: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
    videoSrc: string;
  };
};

export const homepageHero: Record<BrandId, Record<"v1" | "v2", HeroContent>> = {
  bugaboo: {
    v1: {
      nodeId: "8612:3105",
      title: {
        kind: "plain",
        lines: ["Engineered for", "the future"],
      },
      subtitle: "Built to move with you today, and designed for what's next.",
      categories: [
        ["Strollers", "Bundles", "Car Seats"],
        ["High Chairs", "Accessories"],
      ],
      videoSrc: "/assets/hero/bugaboo hero mobile 1.mp4",
    },
    v2: {
      nodeId: "8612:3105",
      eyebrow: "Butterfly 2",
      title: {
        kind: "plain",
        lines: ["Travel freely, your way"],
      },
      subtitle: "Designed for life on the move",
      ctaLabel: "Shop now",
      ctaHref: "/bugaboo/products/butterfly-2",
      categories: [
        ["Strollers", "Bundles", "Car Seats"],
        ["High Chairs", "Accessories"],
      ],
      videoSrc: "/assets/hero/bugaboo hero mobile 2.mp4",
    },
  },
  joolz: {
    v1: {
      nodeId: "8612:3610",
      title: {
        kind: "highlight",
        before: "In the little",
        highlight: "moments",
      },
      subtitle: "From first days to messy moments, find what fits your world",
      categories: [["Strollers", "Bundles", "Accessories"]],
      videoSrc: "/assets/hero/joolz hero mobile 1.mp4",
    },
    v2: {
      nodeId: "8612:3610",
      eyebrow: "DISCOVER",
      title: {
        kind: "product",
        productName: "Joolz",
        productHighlight: "Aer²",
        headline: "Incredibly easy",
      },
      subtitle: "One hand for the stroller.\nOne hand for everything else.",
      ctaLabel: "Shop now",
      ctaHref: "/joolz/products/joolz-aer-2",
      categories: [["Strollers", "Bundles", "Accessories"]],
      videoSrc: "/assets/hero/joolz hero mobile 2.mp4",
    },
  },
};

export const homepageBrandUsp: Record<BrandId, BrandUspContent> = {
  bugaboo: {
    nodeId: "8612:3175",
    title: {
      kind: "stacked",
      lines: ["Designed for", "the future"],
    },
    imageSrc: "/assets/brand-usp/bugaboo-designed-future.jpg",
    imageAlt: "Parent and child beside a Bugaboo stroller in tall grass",
    points: [
      {
        title: "Better, by design",
        description:
          "Certified B Corp, committed to reducing impact across everything we do, from materials to production.",
        imageSrc: "/assets/brand-usp/bugaboo-designed-future.jpg",
        imageAlt: "Parent and child beside a Bugaboo stroller in tall grass",
      },
      {
        title: "Built to go further",
        description:
          "Durable materials and thoughtful engineering made to last. Designed to support daily use over time, without compromising on comfort.",
        imageSrc: "/assets/brand-usp/bugaboo-usp2.jpg",
        imageAlt:
          "Parent pushing a Bugaboo stroller through a grassy landscape",
      },
      {
        title: "Made to last",
        description:
          "Refurbished and buyback options designed to keep products in use longer. By extending the life of every product, we reduce waste and create a more responsible system.",
        imageSrc: "/assets/brand-usp/bugaboo-usp3.jpg",
        imageAlt: "Expectant parent standing outdoors behind soft grasses",
      },
    ],
    reel: {
      label: "Play the reel",
      thumbnailSrc: "/assets/brand-usp/bugaboo-reel-thumb.png",
      thumbnailAlt: "Bugaboo reel preview",
      videoSrc: "/assets/brand-usp/bugaboo-reel.mp4",
    },
  },
  joolz: {
    nodeId: "8612:3680",
    title: {
      kind: "highlight",
      before: "Made for",
      highlight: "real life",
    },
    imageSrc: "/assets/brand-usp/joolz-real-life-cutout-ivory.jpg",
    imageAlt: "Parent holding a child behind a Joolz stroller",
    points: [
      {
        title: "Thoughtfully made",
        description:
          "From more sustainable fabrics to responsible production, every choice is made with care.",
        imageSrc: "/assets/brand-usp/joolz-real-life-cutout-ivory.jpg",
        imageAlt: "Parent holding a child behind a Joolz stroller",
      },
      {
        title: "Better for their world",
        description:
          "For every stroller sold, we plant a tree — growing our Birth Forest for future generations.",
        imageSrc: "/assets/brand-usp/joolz-usp2.jpg",
        imageAlt:
          "Child beside a Joolz stroller basket filled with toys and day-trip essentials",
      },
      {
        title: "Built to last",
        description:
          "With a 10-year transferable warranty, made to support your family for years to come.",
        imageSrc: "/assets/brand-usp/joolz-usp3.jpg",
        imageAlt:
          "Parent carrying a child with a folded Joolz stroller on their back",
      },
    ],
    reel: {
      label: "Play the reel",
      thumbnailSrc: "/assets/brand-usp/joolz-reel-thumb.png",
      thumbnailAlt: "Joolz reel preview",
      videoSrc: "/assets/brand-usp/joolz-reel.mp4",
    },
  },
};

export const homepageCategoryCarousel: Record<
  BrandId,
  CategoryCarouselContent
> = {
  bugaboo: {
    nodeId: "8612:3139",
    title: "Explore a stroller category",
    ctaLabel: "Explore all",
    ctaHref: "#strollers",
    items: [
      {
        id: "everyday",
        title: "Everyday, All-terrain",
        description: "For everyday use, anywhere you go",
        imageAlt: "Bugaboo all-terrain stroller",
        imageSrc: "/assets/category/bugaboo-everyday.png",
      },
      {
        id: "travel",
        title: "Travel & Compact",
        description: "Easy to carry, easy to move",
        imageAlt: "Bugaboo compact stroller",
        imageSrc: "/assets/category/bugaboo-travel.png",
      },
      {
        id: "double",
        title: "Double strollers",
        description: "For growing families, from day one",
        imageAlt: "Bugaboo double stroller",
        imageSrc: "/assets/category/bugaboo-double.png",
      },
    ],
  },
  joolz: {
    nodeId: "8612:3645",
    title: "Explore a stroller category",
    ctaLabel: "Explore all",
    ctaHref: "#strollers",
    items: [
      {
        id: "everyday",
        title: "Everyday, All-terrain",
        description: "For whatever your day brings",
        imageAlt: "Joolz all-terrain stroller",
        imageSrc: "/assets/category/joolz-everyday.png",
      },
      {
        id: "travel",
        title: "Everyday, All-terrain",
        description: "For whatever your day brings",
        imageAlt: "Joolz stroller in sand color",
        imageSrc: "/assets/category/joolz-travel.png",
      },
      {
        id: "double",
        title: "Double strollers",
        description: "Grows with your family",
        imageAlt: "Joolz double stroller",
        imageSrc: "/assets/category/joolz-double.png",
      },
    ],
  },
};

export const homepageProductCarousel: Record<BrandId, ProductCarouselContent> =
  {
    bugaboo: {
      nodeId: "8612:3201",
      title: "Loved by parents",
      items: [
        {
          id: "dragonfly-2-in-1",
          badge: "New",
          title: [{ text: "Dragonfly 2-in-1 stroller" }],
          subtitle: "Most comfortable city stroller",
          compareAtPrice: "€ 1.149,00",
          price: "€976,65",
          images: [
            {
              src: "/assets/products/bugaboo-dragonfly-1.png",
              alt: "Bugaboo Dragonfly stroller with bassinet in side view",
            },
            {
              src: "/assets/products/bugaboo-dragonfly-2.png",
              alt: "Bugaboo Dragonfly stroller folded orientation",
            },
            {
              src: "/assets/products/bugaboo-dragonfly-3.png",
              alt: "Bugaboo Dragonfly stroller alternate angle",
            },
          ],
        },
        {
          id: "donkey-6-double",
          badge: "New",
          title: [{ text: "Donkey 6 double stroller" }],
          subtitle: "Convertible, side by side",
          price: "€1.769,00",
          images: [
            {
              src: "/assets/products/bugaboo-donkey-1.png",
              alt: "Bugaboo Donkey 6 double stroller in side view",
            },
            {
              src: "/assets/products/bugaboo-donkey-3.png",
              alt: "Bugaboo Donkey 6 double stroller alternate configuration",
            },
            {
              src: "/assets/products/bugaboo-donkey-4.png",
              alt: "Bugaboo Donkey 6 double stroller folded orientation",
            },
          ],
        },
        {
          id: "fox-5-renew-bundle",
          badge: "Bundle",
          title: [{ text: "Fox 5 Renew Travel System Bundle" }],
          subtitle: "Gets you ready for road trips",
          compareAtPrice: "€ 1.959,00",
          price: "€ 1.769,00",
          images: [
            {
              src: "/assets/products/bugaboo-fox-bundle-1.jpg",
              alt: "Bugaboo Fox 5 Renew travel system bundle",
            },
          ],
        },
      ],
    },
    joolz: {
      nodeId: "8612:3714",
      title: "Loved by parents",
      items: [
        {
          id: "joolz-geo-5",
          badge: "New",
          title: [{ text: "Joolz Geo" }, { text: "5", superscript: true }],
          subtitle: "Most versatile, for all-terrain",
          price: "€ 1899,00",
          images: [
            {
              src: "/assets/products/joolz-geo-1.png",
              alt: "Joolz Geo stroller in forest green",
            },
          ],
        },
        {
          id: "joolz-day-5",
          badge: "New",
          title: [{ text: "Joolz Day" }, { text: "5", superscript: true }],
          subtitle: "Highest comfort, 3-in-1",
          price: "€ 1299,00",
          images: [
            {
              src: "/assets/products/joolz-day-1.jpg",
              alt: "Joolz Day stroller in sand color",
            },
          ],
        },
        {
          id: "joolz-day-5-essentials",
          badge: "Bundle",
          title: [
            { text: "Joolz Day" },
            { text: "5", superscript: true },
            { text: " Essentials Bundle" },
          ],
          subtitle: "Everything you need from day one",
          compareAtPrice: "€ 1679,00",
          price: "€ 1549,00",
          images: [
            {
              src: "/assets/products/joolz-day-bundle-1.jpg",
              alt: "Joolz Day essentials stroller bundle",
            },
          ],
        },
      ],
    },
  };

export const homepageEditorialRail: Record<BrandId, EditorialRailContent> = {
  bugaboo: {
    nodeId: "8656:4286",
    title: {
      kind: "plain",
      lines: ["Perspectives", "on everyday life"],
    },
    subtitle: "Perspectives on navigating the world of parenthood",
    ctaLabel: "More stories",
    items: [
      {
        id: "sustainability",
        eyebrow: "Sustainability",
        title: [
          { text: "Circular stroller engineering for the next-generation" },
        ],
        imageSrc: "/assets/editorial/bugaboo-story-sustainability.jpg",
        imageAlt: "Child walking through tall grass beside an adult",
      },
      {
        id: "design-perspective",
        eyebrow: "Design perspective",
        title: [{ text: "What makes a stroller truly future-ready?" }],
        imageSrc: "/assets/editorial/bugaboo-story-design.jpg",
        imageAlt: "Child smiling from inside a Bugaboo stroller",
      },
      {
        id: "parent-perspective",
        eyebrow: "Parent perspective",
        title: [{ text: "How thoughtful materials shape everyday life" }],
        imageSrc: "/assets/editorial/bugaboo-story-parent.jpg",
        imageAlt: "Parent leaning over a baby on a changing mat",
      },
    ],
  },
  joolz: {
    nodeId: "8612:3830",
    title: {
      kind: "highlight",
      before: "The parent",
      highlight: "hideout",
    },
    subtitle: "Your go-to spot for navigating the wild world of parenthood",
    ctaLabel: "More stories",
    items: [
      {
        id: "real-parent-stories",
        eyebrow: "Real parent stories",
        title: [
          { text: "Raising tiny\nhumans on a\nnot-so-tiny " },
          { text: "planet", serif: true },
        ],
        imageSrc: "/assets/editorial/joolz-story-parent.png",
        imageAlt: "Parent walking with a Joolz stroller",
        color: "#ffcf7e",
      },
      {
        id: "baby-stages",
        eyebrow: "Baby stages",
        title: [
          { text: "Exploring the world\nwith " },
          { text: "curious hands", serif: true },
        ],
        imageSrc: "/assets/editorial/joolz-story-stages.png",
        imageAlt: "Child reaching out while seated",
        color: "#73c27a",
      },
      {
        id: "parent-hacks",
        eyebrow: "Parent hacks",
        title: [
          { text: "Tiny trips with\n" },
          { text: "big stories", serif: true },
        ],
        imageSrc: "/assets/brand-usp/joolz-real-life-cutout.jpg",
        imageAlt: "Parent holding a baby behind a Joolz stroller",
        color: "#d6b6df",
      },
    ],
  },
};
