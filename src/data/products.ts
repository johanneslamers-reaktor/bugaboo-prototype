import type { BrandId } from "../brands/brands";

export type ProductGalleryMedia = {
  id: string;
  type?: "image" | "video";
  src: string;
  posterSrc?: string;
  alt: string;
  fit: "product" | "cover" | "width";
};

export type ProductColorway = {
  id: string;
  name: string;
  swatch: string;
  thumbnailSrc?: string;
  media: ProductGalleryMedia[];
};

export type ProductDetail = {
  brand: BrandId;
  slug: string;
  aliases?: string[];
  brandLabel: string;
  title: string;
  titleSuffix?: string;
  subtitle: string;
  price: string;
  rating: string;
  reviewCount: string;
  stockStatus: string;
  description: string;
  reasons: ProductReasonItem[];
  /**
   * Optional autoplay carousel of reasons (Bugaboo PDPs).
   * If set, `ProductReasonsCarousel` renders in place of the static `reasons` list.
   */
  reasonsCarousel?: ProductReasonsCarouselContent;
  floatingCta?: ProductFloatingCtaContent;
  featureBenefits?: ProductFeatureBenefitsContent;
  bundle?: ProductBundleContent;
  crossSell?: ProductCrossSellContent;
  productUsp?: ProductUspContent;
  videoStory?: ProductVideoStoryContent;
  storyShop?: ProductStoryShopContent;
  sustainability?: ProductSustainabilityContent;
  shopTheLook?: ProductShopTheLookContent;
  reviews?: ProductReviewsContent;
  impact: ProductImpactContent;
  accordions: ProductAccordionItem[];
  colorways: ProductColorway[];
};

/**
 * Static customer-reviews block — surfaced at the bottom of the PDP for
 * user testing only. No real data fetching or filtering; the checkboxes
 * and "view reviews" CTA are visual only.
 */
export type ProductReviewsContent = {
  overall: {
    rating: number;
    outOf: number;
    count: number;
  };
  photos: { src: string; alt: string }[];
  /** How many photos exist in total (drives the "Show all (N)" overlay). */
  photoTotal: number;
  subRatings: { label: string; rating: number; outOf: number }[];
  distribution: {
    /** Total reviews shown beside the "Reviews" heading. */
    total: number;
    buckets: { label: "Excellent" | "Great" | "Average" | "Poor" | "Bad"; percent: number }[];
  };
};

export type ProductFloatingCtaContent = {
  compareAtPrice?: string;
  financing?: {
    monthlyPrice: string;
    provider: string;
  };
};

export type ProductReasonItem = {
  id: "trial" | "delivery" | "warranty";
  label: string;
};

export type ProductReasonsCarouselItem = {
  id: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
};

export type ProductReasonsCarouselContent = {
  items: ProductReasonsCarouselItem[];
};

export type ProductImpactContent = {
  nodeId: string;
  hero: {
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
  };
  items: ProductImpactItem[];
};

export type ProductImpactItem = {
  id: "materials" | "footprint" | "warranty" | "tree" | "bottles";
  label: string;
  iconSrc?: string;
  iconAlt?: string;
};

export type ProductFeatureBenefitsContent = {
  nodeId: string;
  title: string;
  items: ProductFeatureBenefitItem[];
};

export type ProductFeatureBenefitItem = {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  iconAlt?: string;
  media: {
    type?: "image" | "video";
    src: string;
    posterSrc?: string;
    alt: string;
    overlayTitle?: string;
    objectPosition?: string;
  };
  hotspots?: {
    id: string;
    x: number;
    y: number;
    title: string;
    body: string;
    imageSrc?: string;
    imageAlt?: string;
  }[];
};

export type ProductBundleContent = {
  nodeId: string;
  eyebrow: string;
  heading: string;
  variants: ProductBundleVariant[];
};

export type ProductBundleVariant = {
  id: string;
  label: string;
  saveLabel: string;
  brandLabel: string;
  title: string;
  heroImageSrc: string;
  heroImageAlt: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  compareAtPrice: string;
  price: string;
  ctaLabel: string;
  items: {
    id: string;
    imageSrc: string;
    imageAlt: string;
  }[];
};

export type ProductShopTheLookContent = {
  nodeId: string;
  /** Optional eyebrow shown above the section title. */
  eyebrow?: string;
  title: string;
  /** Optional top hero image shown above the body copy. */
  topImage?: { src: string; alt: string };
  subheading: string;
  body: string;
  link: {
    label: string;
    href: string;
    /** "chevron" (bugaboo) | "plus-circle" (joolz). Default chevron. */
    icon?: "chevron" | "plus-circle";
  };
  /** The hero image at the bottom on which hotspots can be placed. */
  heroImage: { src: string; alt: string };
  /**
   * Always-visible product cards. Hotspots reference them by index so a
   * click on a dot scrolls the card row to that product.
   */
  products: ProductShopTheLookProduct[];
  /** Optional dots placed on the hero image, each linked to a product. */
  hotspots?: ProductShopTheLookHotspot[];
};

export type ProductShopTheLookProduct = {
  id: string;
  title: string;
  /** e.g. "Heritage Black • €161,95" or two separate values. */
  colorLabel: string;
  price: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
};

export type ProductShopTheLookHotspot = {
  id: string;
  x: number;
  y: number;
  /** Index into the products array that this hotspot opens. */
  productIndex: number;
};

export type ProductSustainabilityContent = {
  nodeId: string;
  eyebrow: string;
  title: string;
  /** Optional top hero image (bugaboo shows a detail shot). */
  topImage?: {
    src: string;
    alt: string;
  };
  /** Optional decorative illustration (joolz tree mascot, etc). */
  decoration?: {
    src: string;
    alt: string;
  };
  subheading: string;
  body: string;
  link: {
    label: string;
    href: string;
    /** "chevron" (bugaboo) | "plus-circle" (joolz). Default chevron. */
    icon?: "chevron" | "plus-circle";
  };
  /**
   * Interactive gallery: an array of images shown one at a time, switchable
   * via thumbnails. Each image can have 0+ hotspots that reveal a tooltip
   * when clicked.
   */
  gallery: ProductSustainabilityImage[];
  /** Optional pagination label (joolz shows "1/3"). */
  thumbnailsCounter?: string;
};

export type ProductSustainabilityImage = {
  id: string;
  src: string;
  alt: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  hotspots: ProductSustainabilityHotspot[];
};

export type ProductSustainabilityHotspot = {
  id: string;
  /** Position in % of the image (0-100). */
  x: number;
  y: number;
  title: string;
  body: string;
  /** Optional icon shown to the left of the tooltip content. */
  iconSrc?: string;
  iconAlt?: string;
};

export type ProductCrossSellContent = {
  nodeId: string;
  title: string;
  items: ProductCrossSellItem[];
};

export type ProductCrossSellItem = {
  id: string;
  title: string;
  subtitle?: string;
  colorLabel: string;
  stockStatus: string;
  price: string;
  compareAtPrice?: string;
  rating?: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  swatches: {
    id: string;
    color: string;
    label: string;
  }[];
  moreColorsLabel?: string;
};

export type ProductUspContent = {
  nodeId: string;
  title:
    | {
        kind: "stacked";
        lines: string[];
      }
    | {
        kind: "highlight";
        before: string;
        highlight: string;
      };
  imageSrc: string;
  imageAlt: string;
  reel: {
    label: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
    videoSrc: string;
  };
  points: {
    id: string;
    title: string;
    description: string;
  }[];
};

export type ProductVideoStoryContent = {
  nodeId: string;
  videoSrc?: string;
  posterSrc: string;
  posterAlt: string;
  title:
    | {
        kind: "plain";
        lines: string[];
      }
    | {
        kind: "split";
        strong: string;
        accent: string;
      };
  ariaLabel: string;
};

export type ProductStoryShopContent = {
  nodeId: string;
  eyebrow: string;
  title:
    | {
        kind: "plain";
        lines: string[];
      }
    | {
        kind: "highlight";
        lines: {
          text: string;
          emphasis?: string;
        }[];
      };
  author: {
    name: string;
    role: string;
    avatarSrc: string;
    avatarAlt: string;
  };
  lead: {
    strong: string;
    muted: string;
  };
  body: string;
  ctaLabel: string;
  inspirationImage: {
    id: string;
    src: string;
    alt: string;
    objectPosition?: string;
  };
  products: ProductStoryShopCard[];
  decorationSrc?: string;
  decorationAlt?: string;
};

export type ProductStoryShopCard = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export type ProductAccordionItem = {
  id: string;
  title: string;
  content?: string[];
  panel?: ProductAccordionPanel;
};

export type ProductAccordionPanel =
  | ProductFeaturePanel
  | ProductSpecificationPanel
  | ProductBoxPanel;

export type ProductFeaturePanel = {
  type: "features";
  nodeId: string;
  heading: string;
  features: {
    title: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition?: string;
    imageScale?: number;
  }[];
  otherHeading: string;
  otherFeatures: string[];
};

export type ProductSpecificationPanel = {
  type: "specifications";
  nodeId: string;
  sections: {
    title?: string;
    bullets?: string[];
    text?: string;
    imageSrc?: string;
    imageAlt?: string;
  }[];
};

export type ProductBoxPanel = {
  type: "box";
  nodeId: string;
  imageSrc: string;
  imageAlt: string;
  items: {
    title: string;
    description: string;
  }[];
};

function makeProductGalleryMedia({
  altPrefix,
  basePath,
  count,
  extension,
  fit = "width",
}: {
  altPrefix: string;
  basePath: string;
  count: number;
  extension: string;
  fit?: ProductGalleryMedia["fit"];
}): ProductGalleryMedia[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      id: `${basePath.split("/").at(-1)}-${number}`,
      src: `${basePath}/gallery-${number}.${extension}`,
      alt: `${altPrefix}, image ${index + 1}`,
      fit,
    };
  });
}

export const productCatalog: Record<BrandId, ProductDetail[]> = {
  bugaboo: [
    {
      brand: "bugaboo",
      slug: "fox-5-renew",
      aliases: ["dragonfly-2-in-1-stroller", "dragonfly-2-in-1"],
      brandLabel: "Bugaboo",
      title: "Fox 5 Renew",
      subtitle: "All-terrain comfort stroller",
      price: "€ 1.299,00",
      rating: "4.8",
      reviewCount: "235 Reviews",
      stockStatus: "In stock",
      description: "Explore nature in ultimate comfort while creating the most nurturing space for your newborn. More sustainably crafted, the Fox 5 Renew is engineered for effortless strolls on all terrains.",
      floatingCta: {
        compareAtPrice: "€ 1.799,00",
        financing: {
          monthlyPrice: "47 €/month",
          provider: "Klarna",
        },
      },
      reasons: [
        { id: "trial", label: "Try for 100 days" },
        { id: "delivery", label: "Free delivery and returns" },
        { id: "warranty", label: "4-year warranty" },
      ],
      reasonsCarousel: {
        items: [
          {
            id: "trial",
            label: "Buy and try for 100 days",
            iconSrc: "/assets/pdp/reasons/bugaboo/trial.svg",
            iconAlt: "Try at home icon",
          },
          {
            id: "delivery",
            label: "Free delivery and returns",
            iconSrc: "/assets/pdp/reasons/bugaboo/delivery.svg",
            iconAlt: "Free delivery icon",
          },
          {
            id: "warranty",
            label: "Extended 4-year warranty",
            iconSrc: "/assets/pdp/reasons/bugaboo/warranty.svg",
            iconAlt: "Warranty icon",
          },
          {
            id: "klarna",
            label: "Buy now, pay later with Klarna",
            iconSrc: "/assets/pdp/reasons/bugaboo/klarna.svg",
            iconAlt: "Klarna icon",
          },
        ],
      },
      reviews: {
        overall: { rating: 4.7, outOf: 5, count: 98 },
        photos: [
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-02.avif", alt: "Customer photo" },
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-03.avif", alt: "Customer photo" },
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-04.avif", alt: "Customer photo" },
        ],
        photoTotal: 3,
        subRatings: [
          { label: "Quality", rating: 4.4, outOf: 5 },
          { label: "Value for money", rating: 4.1, outOf: 5 },
        ],
        distribution: {
          total: 18,
          buckets: [
            { label: "Excellent", percent: 84 },
            { label: "Great", percent: 9 },
            { label: "Average", percent: 3 },
            { label: "Poor", percent: 2 },
            { label: "Bad", percent: 2 },
          ],
        },
      },
      impact: {
        nodeId: "8618:3552",
        hero: {
          title: "New breathable PureBreeze™ mattress",
          subtitle: "Dual sides for all-season comfort",
          imageSrc: "/assets/pdp/benefits/bugaboo/purebreeze-mattress.png",
          imageAlt: "PureBreeze mattress detail",
        },
        items: [
          {
            id: "footprint",
            label: "CO₂ footprint reduced by 16% with recycled aluminum",
            iconSrc: "/assets/pdp/benefits/bugaboo/co2.svg",
            iconAlt: "CO₂ footprint icon",
          },
          {
            id: "materials",
            label: "Made with 60% recycled aluminum",
            iconSrc: "/assets/pdp/benefits/bugaboo/aluminum.svg",
            iconAlt: "Recycled aluminum icon",
          },
          {
            id: "tree",
            label: "Crafted with FSC®-certified beechwood",
            iconSrc: "/assets/pdp/benefits/bugaboo/fsc-wood.svg",
            iconAlt: "FSC-certified beechwood icon",
          },
        ],
      },
      bundle: {
        nodeId: "8677:5872",
        eyebrow: "Bundle & save",
        heading: "Everything you need for your Fox 5 Renew.",
        variants: [
          {
            id: "travel-system",
            label: "Travel system",
            saveLabel: "You save € 274,95",
            brandLabel: "Bugaboo",
            title: "Fox 5 Renew Travel System Bundle",
            heroImageSrc: "/assets/pdp/bundles/bugaboo/travel-system-hero.jpg",
            heroImageAlt: "Bugaboo Fox 5 Renew travel system bundle outdoors",
            thumbnailSrc: "/assets/pdp/bundles/bugaboo/thumb.png",
            thumbnailAlt: "Bugaboo Fox 5 Renew bundle thumbnail",
            compareAtPrice: "€ 2.729,00",
            price: "€ 2.159,00",
            ctaLabel: "Shop bundle",
            items: [
              {
                id: "stroller",
                imageSrc: "/assets/pdp/bundles/bugaboo/stroller.png",
                imageAlt: "Fox 5 Renew stroller with bassinet",
              },
              {
                id: "seat",
                imageSrc: "/assets/pdp/bundles/bugaboo/seat.png",
                imageAlt: "Fox 5 Renew seat fabric",
              },
              {
                id: "bag",
                imageSrc: "/assets/pdp/bundles/bugaboo/bag.png",
                imageAlt: "Bugaboo transport bag",
              },
              {
                id: "bassinet",
                imageSrc: "/assets/pdp/bundles/bugaboo/bassinet.png",
                imageAlt: "Fox 5 Renew bassinet",
              },
              {
                id: "car-seat",
                imageSrc: "/assets/pdp/bundles/bugaboo/car-seat.png",
                imageAlt: "Bugaboo car seat accessory",
              },
            ],
          },
          {
            id: "ultimate-newborn",
            label: "Ultimate newborn",
            saveLabel: "You save € 274,95",
            brandLabel: "Bugaboo",
            title: "Fox 5 Renew Ultimate Newborn Bundle",
            heroImageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/hero.jpg",
            heroImageAlt: "Mother holding Bugaboo Fox 5 Renew newborn bassinet outdoors",
            thumbnailSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/thumb.png",
            thumbnailAlt: "Fox 5 Renew bassinet thumbnail",
            compareAtPrice: "€ 2.563,95",
            price: "€ 2.289,00",
            ctaLabel: "Shop bundle",
            items: [
              {
                id: "cup-holder",
                imageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/cup-holder.png",
                imageAlt: "Bugaboo cup holder",
              },
              {
                id: "changing-bag",
                imageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/changing-bag.png",
                imageAlt: "Bugaboo changing bag",
              },
              {
                id: "car-seat",
                imageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/car-seat.png",
                imageAlt: "Bugaboo car seat",
              },
              {
                id: "footmuff",
                imageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/footmuff.png",
                imageAlt: "Bugaboo seat liner",
              },
              {
                id: "stargazer-toy",
                imageSrc: "/assets/pdp/bundles/bugaboo/ultimate-newborn/stargazer-toy.png",
                imageAlt: "Stargazer hanging toy",
              },
            ],
          },
        ],
      },
      featureBenefits: {
        nodeId: "8663:3727",
        title: "Features & Benefits",
        items: [
          {
            id: "one-hand-control",
            title: "Effortless one-hand control",
            description: "Engineered to make every day easier. With just one hand, you can adjust the handlebar, recline the seat, and even fold the stroller.",
            media: {
              type: "video",
              src: "/assets/pdp/feature-benefits/bugaboo/one-hand-control.mp4",
              posterSrc: "/assets/pdp/feature-benefits/bugaboo/one-hand-control.jpg",
              alt: "Bugaboo Fox 5 Renew stroller being pushed along a coastal path",
              objectPosition: "50% 50%",
            },
          },
          {
            id: "extendable-canopy",
            title: "Extendable UPF sun canopy",
            description: "Extra coverage when you need it most, with breathable fabrics and built-in ventilation for a cool, protected ride.",
            media: {
              src: "/assets/pdp/feature-benefits/bugaboo/canopy.jpg",
              alt: "Bugaboo Fox 5 Renew sun canopy detail",
              objectPosition: "35% 50%",
            },
            hotspots: [
              {
                id: "materials",
                x: 50,
                y: 80,
                title: "Materials for the future",
                body: "Crafted with recycled fabrics, bio-based material, and recycled aluminum.",
                imageSrc: "/assets/pdp/feature-benefits/bugaboo/materials-thumb.jpg",
                imageAlt: "Bugaboo recycled fabric texture",
              },
            ],
          },
          {
            id: "smooth-rides",
            title: "Bigger wheels, smoother rides",
            description: "Extra-large all-terrain wheels and advanced suspension absorb shocks and uneven terrain, so it’s a smooth, stable ride wherever you go.",
            media: {
              src: "/assets/pdp/feature-benefits/bugaboo/wheels.jpg",
              alt: "Bugaboo Fox 5 Renew wheel and suspension detail",
              objectPosition: "50% 50%",
            },
            hotspots: [
              {
                id: "suspension",
                x: 63,
                y: 55,
                title: "All-terrain suspension",
                body: "Large wheels and advanced suspension help absorb shocks and keep the ride smooth on uneven paths.",
              },
            ],
          },
        ],
      },
      crossSell: {
        nodeId: "8618:4200",
        title: "Essential add-ons",
        items: [
          {
            id: "cup-holder",
            title: "Cup holder",
            subtitle: "Easily attaches to handlebar",
            colorLabel: "Black",
            stockStatus: "In stock",
            price: "€ 79,00",
            rating: "4.8",
            imageSrc: "/assets/pdp/cross-sell/bugaboo/cup-holder.png",
            imageAlt: "Bugaboo cup holder",
            swatches: [{ id: "black", color: "#10100c", label: "Black" }],
          },
          {
            id: "backpack",
            title: "Backpack",
            subtitle: "Keeps everything you need",
            colorLabel: "Dark indigo",
            stockStatus: "In stock",
            price: "€ 169,00",
            rating: "4.6",
            badge: "New",
            imageSrc: "/assets/pdp/cross-sell/bugaboo/backpack.png",
            imageAlt: "Bugaboo backpack",
            swatches: [
              { id: "black", color: "#10100c", label: "Black" },
              { id: "stone", color: "#898989", label: "Stone" },
              { id: "indigo", color: "#434252", label: "Dark indigo" },
            ],
          },
          {
            id: "baby-nest",
            title: "Baby nest",
            subtitle: "Perfect for all weather",
            colorLabel: "Black",
            stockStatus: "In stock",
            price: "€ 199,00",
            rating: "4.9",
            imageSrc: "/assets/pdp/cross-sell/bugaboo/baby-nest.png",
            imageAlt: "Bugaboo baby nest",
            swatches: [
              { id: "black", color: "#10100c", label: "Black" },
              { id: "taupe", color: "#b2a89f", label: "Taupe" },
            ],
          },
          {
            id: "parasol",
            title: "Parasol",
            subtitle: "Protecting on sunny days",
            colorLabel: "Black",
            stockStatus: "In stock",
            price: "€ 59,00",
            rating: "4.4",
            imageSrc: "/assets/pdp/cross-sell/bugaboo/parasol.png",
            imageAlt: "Bugaboo parasol",
            swatches: [
              { id: "black", color: "#10100c", label: "Black" },
              { id: "stone", color: "#898989", label: "Stone" },
              { id: "indigo", color: "#434252", label: "Dark indigo" },
            ],
          },
        ],
      },
      productUsp: {
        nodeId: "8618:2335",
        title: {
          kind: "stacked",
          lines: ["Moves", "with you"],
        },
        imageSrc: "/assets/pdp/product-usp/bugaboo/moves-with-you.jpg",
        imageAlt: "Bugaboo Fox 5 Renew stroller on a coastal path",
        points: [
          {
            id: "explore",
            title: "Explore without limits",
            description:
              "Go wherever the day takes you with confidence and ease, powered by large all-terrain wheels and advanced suspension.",
          },
          {
            id: "control",
            title: "Control in every move",
            description:
              "Responsive handling and one-hand control make tight turns, curbs, and everyday routes feel effortless.",
          },
          {
            id: "comfort",
            title: "Comfort you can trust",
            description:
              "A roomy seat, smooth suspension, and all-season comfort help keep every ride calm.",
          },
        ],
        reel: {
          label: "Play the reel",
          thumbnailSrc: "/assets/pdp/product-usp/bugaboo/reel-thumb.jpg",
          thumbnailAlt: "Bugaboo reel preview",
          videoSrc: "/assets/brand-usp/bugaboo-reel.mp4",
        },
      },
      videoStory: {
        nodeId: "8618:2358",
        posterSrc: "/assets/pdp/video-story/bugaboo/poster.jpg",
        posterAlt: "Bugaboo Fox 5 Renew wheels on textured pavement",
        title: {
          kind: "plain",
          lines: ["Go further,", "together"],
        },
        ariaLabel: "Bugaboo Fox 5 Renew video story",
      },
      storyShop: {
        nodeId: "8618:4399",
        eyebrow: "Parent perspective",
        title: {
          kind: "plain",
          lines: ["How parenthood has", "opened up our world"],
        },
        author: {
          name: "By Luca",
          role: "Father of Liam",
          avatarSrc: "/assets/pdp/story-shop/bugaboo/avatar.png",
          avatarAlt: "Portrait of Luca",
        },
        lead: {
          strong: "Becoming a parent changed everything, not how I expected though.",
          muted: " I thought life would get smaller. Instead, it opened everything up.",
        },
        body:
          "The Bugaboo Fox 5 Renew made it easy. All-terrain, smooth to steer, and comfortable from the start, it moves effortlessly from city streets to park paths. It gave me confidence to go further.",
        ctaLabel: "Read the full story",
        inspirationImage: {
          id: "walk",
          src: "/assets/pdp/story-shop/bugaboo/story-01.jpg",
          alt: "Luca walking with a Bugaboo stroller outdoors",
          objectPosition: "center",
        },
        products: [
          {
            id: "luca-setup",
            label: "See Luca's setup",
            title: "Ultimate newborn bundle",
            subtitle: "Forrest Green",
            imageSrc: "/assets/pdp/story-shop/bugaboo/setup.png",
            imageAlt: "Bugaboo Fox 5 Renew setup",
          },
          {
            id: "fox-5-renew",
            label: "Featured product",
            title: "Bugaboo Fox 5 Renew",
            subtitle: "Heritage Black",
            imageSrc: "/assets/pdp/bugaboo-fox/colorways/heritage-black.png",
            imageAlt: "Bugaboo Fox 5 Renew stroller",
          },
          {
            id: "backpack",
            label: "Add to the setup",
            title: "Bugaboo backpack",
            subtitle: "Dark Indigo",
            imageSrc: "/assets/pdp/cross-sell/bugaboo/backpack.png",
            imageAlt: "Bugaboo backpack",
          },
        ],
      },
      sustainability: {
        nodeId: "8618:2421",
        eyebrow: "Rooted in responsibility",
        title: "Made to last, made right",
        topImage: {
          src: "/assets/pdp/sustainability/bugaboo/detail.jpg",
          alt: "Bugaboo Fox 5 folding mechanism detail on natural wood",
        },
        subheading: "Bio-based materials",
        body: "Made with recycled and bio-based materials, the Fox 5 reduces CO₂ emissions by 30% while being designed for long-lasting, repairable use.",
        link: {
          label: "More about materials",
          href: "#materials",
          icon: "chevron",
        },
        gallery: [
          {
            id: "harness",
            src: "/assets/pdp/sustainability/bugaboo/thumb-2.jpg",
            alt: "Bugaboo Fox 5 wheels",
            thumbnailSrc: "/assets/pdp/sustainability/bugaboo/thumb-2.jpg",
            thumbnailAlt: "Wheel detail",
            hotspots: [
              {
                id: "folding-button",
                x: 54.7,
                y: 26.2,
                title: "Fold and maneuver with one hand",
                body: "Extra-large puncture-proof wheels and advanced suspension absorb bumps and uneven ground.",
                iconSrc: "/assets/pdp/sustainability/bugaboo/featured-thumb.jpg",
                iconAlt: "Folding mechanism close-up",
              },
            ],
          },
          {
            id: "wheels",
            src: "/assets/pdp/sustainability/bugaboo/thumb-1.jpg",
            alt: "Bugaboo Fox 5 harness detail",
            thumbnailSrc: "/assets/pdp/sustainability/bugaboo/thumb-1.jpg",
            thumbnailAlt: "Harness detail",
            hotspots: [],
          },
          {
            id: "seat",
            src: "/assets/pdp/sustainability/bugaboo/thumb-3.jpg",
            alt: "Bugaboo Fox 5 seat",
            thumbnailSrc: "/assets/pdp/sustainability/bugaboo/thumb-3.jpg",
            thumbnailAlt: "Seat view",
            hotspots: [],
          },
          {
            id: "frame",
            src: "/assets/pdp/sustainability/bugaboo/thumb-4.jpg",
            alt: "Bugaboo Fox 5 frame",
            thumbnailSrc: "/assets/pdp/sustainability/bugaboo/thumb-4.jpg",
            thumbnailAlt: "Frame view",
            hotspots: [],
          },
        ],
      },
      shopTheLook: {
        nodeId: "8677:6556",
        eyebrow: "Thoughtfully paired",
        title: "Meet the\nNest bassinet",
        topImage: {
          src: "/assets/pdp/shop-the-look/bugaboo/top-image.jpg",
          alt: "Parent with newborn in Bugaboo bassinet",
        },
        subheading: "Comfortable, supportive bassinet",
        body: "Convenient carry straps and a secure, sturdy construction let you lift the pod without interrupting your baby's nap. Thoughtfully constructed for stability and softness, it offers a calm, protected space wherever you go.",
        link: {
          label: "View product",
          href: "#shop-the-look",
          icon: "chevron",
        },
        heroImage: {
          src: "/assets/pdp/shop-the-look/bugaboo/feature-bg.jpg",
          alt: "Lifestyle shot with Bugaboo carry bag",
        },
        products: [
          {
            id: "baby-nest",
            title: "Baby nest",
            colorLabel: "Heritage Black",
            price: "€161,95",
            thumbnailSrc: "/assets/pdp/shop-the-look/bugaboo/product-1.png",
            thumbnailAlt: "Bugaboo baby nest bag",
          },
        ],
        hotspots: [
          { id: "bag", x: 50, y: 60, productIndex: 0 },
        ],
      },
      accordions: [
        {
          id: "features",
          title: "Features",
          panel: {
            type: "features",
            nodeId: "8677:5361",
            heading: "The details behind the Fox 5 Renew",
            features: [
              {
                title: "360 ISOFIX Base: With swivel convenience",
                imageSrc: "/assets/pdp/accordion/bugaboo/feature-isofix.png",
                imageAlt: "Bugaboo 360 ISOFIX base",
                imageScale: 1.12,
              },
              {
                title: "Extra-large all-terrain wheels and advanced suspension",
                imageSrc: "/assets/pdp/accordion/bugaboo/feature-wheels.png",
                imageAlt: "Bugaboo Fox 5 Renew wheel detail",
                imagePosition: "62% 50%",
              },
              {
                title: "Large basket for everything you need",
                imageSrc: "/assets/pdp/accordion/bugaboo/feature-basket.png",
                imageAlt: "Bugaboo Fox 5 Renew underseat basket",
                imagePosition: "36% 50%",
              },
              {
                title: "Sun canopy with SPF 50 protection",
                imageSrc: "/assets/pdp/accordion/bugaboo/feature-canopy.png",
                imageAlt: "Bugaboo Fox 5 Renew sun canopy",
                imagePosition: "36% 50%",
              },
            ],
            otherHeading: "Other key features",
            otherFeatures: [
              "Fox 5 Renew: The ultimate go-anywhere stroller, more consciously crafted",
              "With one-hand fold and seamless steering",
            ],
          },
        },
        {
          id: "specifications",
          title: "Specifications & Dimensions",
          panel: {
            type: "specifications",
            nodeId: "8677:5391",
            sections: [
              {
                title: "Weight (fully assembled)",
                bullets: [
                  "With seat: 12.3 kg (26.45 lbs).",
                  "With bassinet: 13.3 kg (29.32 lbs)",
                  "Age range From birth to about 4 years (max. 22 kg/50 lbs)",
                ],
              },
              {
                title: "Dimensions",
                bullets: [
                  "Wheels Front wheels: 22 cm (8.5 inches).",
                  "Rear wheels: 30 cm (12 inches).",
                  "Handlebar height 92 - 108 cm (36.2 - 42.5 inches)",
                  "Seat Width: 39 cm (15.4 inches).",
                  "Length: 50 cm (19.7 inches), extendable by 10 cm (4 inches).",
                ],
              },
              {
                imageSrc: "/assets/pdp/accordion/bugaboo/spec-dimensions.jpg",
                imageAlt: "Bugaboo Fox 5 Renew dimensions diagram",
              },
              {
                title: "Max. capacity",
                bullets: [
                  "On the seat 22 kg (50 lbs)",
                  "In the bassinet 9 kg (20 lbs)",
                  "Large underseat basket 10 kg (22 lbs), 45 liters (12 gallons)",
                ],
              },
              {
                title: "Materials",
                bullets: [
                  "Fabrics Outside: 100% recycled polyester (on sun canopy, seat, bassinet, and apron).",
                  "Lining: 100% polyester.",
                  "Filling 1: 100% polyester.",
                  "Filling 2: 100% polyurethane foam.",
                  "Handlebar grips 100% vegan leather",
                  "Mattress Outside: 100% polyester.",
                  "Filling: 100% polyurethane foam.",
                ],
              },
              {
                title: "Care instructions",
                text: "Washing and cleaning All fabrics are machine washable at 30°C (86°F). Remove the bassinet stiffeners before washing. The vegan leather grips can be cleaned with a damp cloth. Always consult the washing label for exact instructions.",
              },
            ],
          },
        },
        {
          id: "box",
          title: "What’s in the box",
          panel: {
            type: "box",
            nodeId: "8677:5436",
            imageSrc: "/assets/pdp/accordion/bugaboo/box-stroller-base.png",
            imageAlt: "Bugaboo Fox 5 Renew stroller base bundle",
            items: [
              {
                title: "Stroller base",
                description: "The hardware for your Bugaboo Fox 5 Renew. Includes wheels, wheel caps, and grips.",
              },
              {
                title: "Seat",
                description: "Reversible and reclinable seat. Includes the seat/bassinet frame, seat fabric, seat hardware, five-point safety harness, adjustable seat footrest, and rotating carry handle.",
              },
              {
                title: "PureBreeze™ mattress",
                description: "With dual sides and enhanced breathability for year-round comfort.",
              },
              {
                title: "Sun canopy",
                description: "Extendable and height-adjustable, with UPF 50+ protection and a peek-a-boo panel. Includes fabrics, wires, and clamps.",
              },
              {
                title: "Underseat basket",
                description: "With extendable panels. Maximum 10 kg (22 lbs) or 39 liters (10.3 gallons).",
              },
            ],
          },
        },
      ],
      colorways: [
        {
          id: "midnight-black",
          name: "Heritage black",
          swatch: "#161616",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/heritage-black.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in heritage black",
            basePath: "/assets/pdp/bugaboo-fox/heritage-black",
            count: 9,
            extension: "avif",
          }),
        },
        {
          id: "desert-taupe",
          name: "Desert taupe",
          swatch: "#cab2ab",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/desert-taupe.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in desert taupe",
            basePath: "/assets/pdp/bugaboo-fox/desert-taupe",
            count: 3,
            extension: "avif",
          }),
        },
        {
          id: "forest-green",
          name: "Forest green",
          swatch: "#23382f",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/forest-green.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in forest green",
            basePath: "/assets/pdp/bugaboo-fox/forest-green",
            count: 3,
            extension: "avif",
          }),
        },
        {
          id: "graphite",
          name: "Grey",
          swatch: "#6f7473",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/graphite.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in grey",
            basePath: "/assets/pdp/bugaboo-fox/graphite",
            count: 3,
            extension: "avif",
          }),
        },
        {
          id: "midnight-blue",
          name: "Deep indigo",
          swatch: "#171c31",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/midnight-blue.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in deep indigo",
            basePath: "/assets/pdp/bugaboo-fox/midnight-blue",
            count: 3,
            extension: "avif",
          }),
        },
        {
          id: "espresso",
          name: "Cocoa brown",
          swatch: "#2b211c",
          thumbnailSrc: "/assets/pdp/bugaboo-fox/colorways/cocoa-brown.avif",
          media: makeProductGalleryMedia({
            altPrefix: "Bugaboo Fox 5 Renew in cocoa brown",
            basePath: "/assets/pdp/bugaboo-fox/cocoa-brown",
            count: 3,
            extension: "avif",
          }),
        },
      ],
    },
    {
      brand: "bugaboo",
      slug: "donkey-6-double-stroller",
      aliases: ["donkey-6-double"],
      brandLabel: "Bugaboo",
      title: "Donkey 6 double stroller",
      subtitle: "Convertible, side by side",
      price: "€ 1.799,00",
      rating: "4.7",
      reviewCount: "128 Reviews",
      stockStatus: "In stock",
      description: "Convert from mono to duo to twin with a side-by-side design made for everyday family life.",
      reasons: [
        { id: "trial", label: "Try for 100 days" },
        { id: "delivery", label: "Free delivery and returns" },
        { id: "warranty", label: "4-year warranty" },
      ],
      reasonsCarousel: {
        items: [
          {
            id: "trial",
            label: "Buy and try for 100 days",
            iconSrc: "/assets/pdp/reasons/bugaboo/trial.svg",
            iconAlt: "Try at home icon",
          },
          {
            id: "delivery",
            label: "Free delivery and returns",
            iconSrc: "/assets/pdp/reasons/bugaboo/delivery.svg",
            iconAlt: "Free delivery icon",
          },
          {
            id: "warranty",
            label: "Extended 4-year warranty",
            iconSrc: "/assets/pdp/reasons/bugaboo/warranty.svg",
            iconAlt: "Warranty icon",
          },
          {
            id: "klarna",
            label: "Buy now, pay later with Klarna",
            iconSrc: "/assets/pdp/reasons/bugaboo/klarna.svg",
            iconAlt: "Klarna icon",
          },
        ],
      },
      reviews: {
        overall: { rating: 4.7, outOf: 5, count: 98 },
        photos: [
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-02.avif", alt: "Customer photo" },
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-03.avif", alt: "Customer photo" },
          { src: "/assets/pdp/bugaboo-fox/heritage-black/gallery-04.avif", alt: "Customer photo" },
        ],
        photoTotal: 3,
        subRatings: [
          { label: "Quality", rating: 4.4, outOf: 5 },
          { label: "Value for money", rating: 4.1, outOf: 5 },
        ],
        distribution: {
          total: 18,
          buckets: [
            { label: "Excellent", percent: 84 },
            { label: "Great", percent: 9 },
            { label: "Average", percent: 3 },
            { label: "Poor", percent: 2 },
            { label: "Bad", percent: 2 },
          ],
        },
      },
      impact: {
        nodeId: "8618:3552",
        hero: {
          title: "New breathable PureBreeze™ mattress",
          subtitle: "Dual sides for all-season comfort",
          imageSrc: "/assets/pdp/benefits/bugaboo/purebreeze-mattress.png",
          imageAlt: "PureBreeze mattress detail",
        },
        items: [
          {
            id: "materials",
            label: "Crafted with recycled fabrics, recycled aluminum, and bio-based material",
            iconSrc: "/assets/pdp/benefits/bugaboo/crafted.svg",
            iconAlt: "Crafted materials icon",
          },
          {
            id: "footprint",
            label: "CO2 footprint reduced by 30% since 2019",
            iconSrc: "/assets/pdp/benefits/bugaboo/co2.svg",
            iconAlt: "CO2 footprint icon",
          },
          {
            id: "warranty",
            label: "Extended 4-year warranty",
            iconSrc: "/assets/pdp/benefits/bugaboo/warranty.svg",
            iconAlt: "Warranty icon",
          },
        ],
      },
      accordions: [
        {
          id: "features",
          title: "Features",
          content: [
            "Expandable side-by-side setup for one child, two siblings, or twins.",
            "Large wheels and balanced handling for everyday family errands.",
          ],
        },
        {
          id: "specifications",
          title: "Specifications & Dimensions",
          content: [
            "Convertible mono, duo, and twin configurations with adjustable storage space.",
          ],
        },
        {
          id: "box",
          title: "What’s in the box",
          content: [
            "Stroller frame, wheels, seat fabrics, sun canopies, baskets, and required configuration hardware.",
          ],
        },
      ],
      colorways: [
        {
          id: "midnight-black",
          name: "Midnight black",
          swatch: "#161616",
          media: [
            {
              id: "donkey-side",
              src: "/assets/products/bugaboo-donkey-1.png",
              alt: "Bugaboo Donkey 6 double stroller side view",
              fit: "product",
            },
            {
              id: "donkey-config",
              src: "/assets/products/bugaboo-donkey-3.png",
              alt: "Bugaboo Donkey 6 double stroller alternate configuration",
              fit: "product",
            },
            {
              id: "donkey-folded",
              src: "/assets/products/bugaboo-donkey-4.png",
              alt: "Bugaboo Donkey 6 double stroller folded",
              fit: "product",
            },
          ],
        },
      ],
    },
  ],
  joolz: [
    {
      brand: "joolz",
      slug: "joolz-aer-2",
      aliases: ["joolz-aer2", "joolz-day-5", "joolz-day5"],
      brandLabel: "Joolz",
      title: "Joolz Aer",
      titleSuffix: "2",
      subtitle: "Stroller + bassinet",
      price: "€ 1.299,00",
      rating: "4.8",
      reviewCount: "Reviews",
      stockStatus: "In stock",
      description: "Discover the new Joolz Day5, the fifth-generation upgrade of our beloved Joolz Day model, a favorite of parents worldwide. This special 3-in-1 stroller is a cuddle on wheels, combining the finest comfort and best protection with the best support for your little one(s).",
      floatingCta: {
        compareAtPrice: "€ 1.999,00",
        financing: {
          monthlyPrice: "47 €",
          provider: "Klarna",
        },
      },
      reasons: [
        { id: "trial", label: "Try for 100 days" },
        { id: "delivery", label: "Free delivery and returns" },
        { id: "warranty", label: "4-year warranty" },
      ],
      reasonsCarousel: {
        items: [
          {
            id: "warranty",
            label: "10 year transferrable warranty",
            iconSrc: "/assets/pdp/reasons/joolz/warranty.svg",
            iconAlt: "Warranty icon",
          },
          {
            id: "delivery",
            label: "Free standard delivery",
            iconSrc: "/assets/pdp/reasons/joolz/delivery.svg",
            iconAlt: "Free delivery icon",
          },
          {
            id: "returns",
            label: "Free returns within 30 days",
            iconSrc: "/assets/pdp/reasons/joolz/returns.svg",
            iconAlt: "Free returns icon",
          },
          {
            id: "klarna",
            label: "Buy now, pay later with Klarna",
            iconSrc: "/assets/pdp/reasons/joolz/klarna.svg",
            iconAlt: "Klarna icon",
          },
        ],
      },
      featureBenefits: {
        nodeId: "8612:5030",
        title: "Features & Benefits",
        items: [
          {
            id: "cloud-soft-cot",
            title: "Effortless one-hand control",
            description: "Explore further with ease. Extra-large puncture-proof wheels and advanced suspension absorb bumps and uneven ground.",
            iconSrc: "/assets/pdp/feature-benefits/joolz/cloud-icon.png",
            iconAlt: "Cloud soft cot icon",
            media: {
              type: "video",
              src: "/assets/hero/joolz-hero.mp4",
              alt: "Baby resting in a soft cot",
              overlayTitle: "Cloud soft cot",
              objectPosition: "50% 50%",
            },
          },
          {
            id: "spacious-basket",
            title: "Extra-large, spacious basket",
            description: "Be well prepared with the largest shopping basket, with a capacity of up to 15 kg (60L). Easy access from all sides.",
            iconSrc: "/assets/pdp/feature-benefits/joolz/basket-icon.svg",
            iconAlt: "Spacious basket icon",
            media: {
              src: "/assets/pdp/feature-benefits/joolz/basket.jpg",
              alt: "Joolz stroller basket detail",
              objectPosition: "42% 50%",
            },
          },
          {
            id: "smooth-rides",
            title: "Bigger wheels, smoother rides",
            description: "With 4-wheel suspension, these puncture-proof tires and one-hand operation ensure smooth rides on any terrain.",
            iconSrc: "/assets/pdp/feature-benefits/joolz/wheels-icon.png",
            iconAlt: "Suspension wheels icon",
            media: {
              src: "/assets/pdp/feature-benefits/joolz/wheels.jpg",
              alt: "Joolz stroller wheels on a path",
              objectPosition: "50% 18%",
            },
          },
        ],
      },
      crossSell: {
        nodeId: "8612:5032",
        title: "Essential add-ons",
        items: [
          {
            id: "seat-liner",
            title: "Seat liner",
            subtitle: "Premium, soft comfort",
            colorLabel: "Black",
            stockStatus: "Low stock",
            price: "€ 59,00",
            rating: "4.2",
            imageSrc: "/assets/pdp/cross-sell/joolz/seat-liner.png",
            imageAlt: "Joolz seat liner accessory",
            swatches: [
              { id: "black", color: "#646e63", label: "Black" },
              { id: "cream", color: "#e5dacd", label: "Cream" },
            ],
          },
          {
            id: "transport-bag",
            title: "Transport bag",
            subtitle: "Protected on the go",
            colorLabel: "Space black",
            stockStatus: "In stock",
            price: "€ 79,95",
            rating: "4.8",
            imageSrc: "/assets/pdp/cross-sell/joolz/transport-bag.png",
            imageAlt: "Joolz transport bag accessory",
            swatches: [
              { id: "space-black", color: "#252525", label: "Space black" },
            ],
          },
          {
            id: "organiser",
            title: "Organiser",
            subtitle: "Versatile, secure storage",
            colorLabel: "Sandy taupe",
            stockStatus: "In stock",
            price: "€ 54,95",
            rating: "4.6",
            imageSrc: "/assets/pdp/cross-sell/joolz/organiser.png",
            imageAlt: "Joolz organiser accessory",
            swatches: [
              { id: "sandy-taupe", color: "#c0afa5", label: "Sandy taupe" },
              { id: "forest-green", color: "#646e63", label: "Forest green" },
              { id: "space-black", color: "#252525", label: "Space black" },
            ],
          },
          {
            id: "cup-holder",
            title: "Cup holder",
            subtitle: "Clips easily onto handlebar",
            colorLabel: "Space black",
            stockStatus: "In stock",
            price: "€ 24,95",
            rating: "4.4",
            imageSrc: "/assets/pdp/cross-sell/joolz/cup-holder.png",
            imageAlt: "Joolz cup holder accessory",
            swatches: [
              { id: "space-black", color: "#252525", label: "Space black" },
            ],
          },
        ],
      },
      productUsp: {
        nodeId: "8612:4989",
        title: {
          kind: "highlight",
          before: "Settle in",
          highlight: "Anywhere",
        },
        imageSrc: "/assets/pdp/product-usp/joolz/settle-anywhere.png",
        imageAlt: "Baby resting in a Joolz stroller cot",
        points: [
          {
            id: "protected",
            title: "Protected & at ease",
            description:
              "Like a little cocoon on wheels, so your baby can nap through the noise and you can enjoy the silence while it lasts.",
          },
          {
            id: "closeness",
            title: "Closeness that feels right",
            description:
              "Keep your baby comfortably close with a setup that feels natural from the first stroll.",
          },
          {
            id: "smooth-days",
            title: "Smooth days, together",
            description:
              "Easy handling and soft support help every outing feel calmer, from quick errands to long walks.",
          },
        ],
        reel: {
          label: "Play the reel",
          thumbnailSrc: "/assets/pdp/product-usp/joolz/reel-thumb.png",
          thumbnailAlt: "Joolz reel preview",
          videoSrc: "/assets/brand-usp/joolz-reel.mp4",
        },
      },
      videoStory: {
        nodeId: "8612:5017",
        videoSrc: "/assets/pdp/video-story/joolz/aer2-easy-to-carry.mp4",
        posterSrc: "/assets/pdp/video-story/joolz/aer2-easy-to-carry-poster.jpg",
        posterAlt: "Parent carrying a folded Joolz Aer 2 stroller",
        title: {
          kind: "split",
          strong: "Easy to carry,",
          accent: "easy to bring along",
        },
        ariaLabel: "Joolz Aer 2 — easy to carry video",
      },
      storyShop: {
        nodeId: "8612:5055",
        eyebrow: "Parent perspective",
        title: {
          kind: "highlight",
          lines: [
            { text: "How parenthood" },
            { text: "kept us ", emphasis: "moving" },
          ],
        },
        author: {
          name: "By Mila",
          role: "Mother of Otis",
          avatarSrc: "/assets/pdp/story-shop/joolz/avatar.jpg",
          avatarAlt: "Portrait of Mila",
        },
        lead: {
          strong:
            "Becoming a parent changed everything, but not how I expected. I thought getting out the door",
          muted:
            " would take forever, that every plan needed planning. Instead, we just go. A quick coffee while he naps, hopping on trams.",
        },
        body:
          "The Joolz Aer 2 makes that easy. Lightweight, compact, and effortless from the start, it fits into days on the move. From narrow sidewalks to overhead compartments, it's always ready. It gave me the confidence to go.",
        ctaLabel: "Read the full story",
        decorationSrc: "/assets/pdp/story-shop/joolz/smile-bg.svg",
        decorationAlt: "",
        inspirationImage: {
          id: "city",
          src: "/assets/pdp/story-shop/joolz/story-01.png",
          alt: "Mila walking through the city with a Joolz stroller",
          objectPosition: "center",
        },
        products: [
          {
            id: "mila-setup",
            label: "See Mila's setup",
            title: "Forrest Green",
            subtitle: "Rain cover",
            imageSrc: "/assets/pdp/story-shop/joolz/setup.png",
            imageAlt: "Joolz Aer2 setup",
          },
          {
            id: "aer2-travel-bag",
            label: "Add to the setup",
            title: "Aer2 travel bag",
            subtitle: "Forest Green",
            imageSrc: "/assets/pdp/cross-sell/joolz/travel-bag.jpg",
            imageAlt: "Joolz Aer2 travel bag",
          },
          {
            id: "sun-canopy",
            label: "For every day",
            title: "Sun canopy",
            subtitle: "Dark Cherry Red",
            imageSrc: "/assets/pdp/cross-sell/joolz/sun-canopy.png",
            imageAlt: "Joolz sun canopy",
          },
        ],
      },
      reviews: {
        overall: { rating: 4.7, outOf: 5, count: 98 },
        photos: [
          { src: "/assets/pdp/joolz-aer/sandy-taupe/gallery-02.jpg", alt: "Customer photo" },
          { src: "/assets/pdp/joolz-aer/sandy-taupe/gallery-03.jpg", alt: "Customer photo" },
          { src: "/assets/pdp/joolz-aer/sandy-taupe/gallery-04.jpg", alt: "Customer photo" },
        ],
        photoTotal: 3,
        subRatings: [
          { label: "Quality", rating: 4.4, outOf: 5 },
          { label: "Value for money", rating: 4.1, outOf: 5 },
        ],
        distribution: {
          total: 18,
          buckets: [
            { label: "Excellent", percent: 84 },
            { label: "Great", percent: 9 },
            { label: "Average", percent: 3 },
            { label: "Poor", percent: 2 },
            { label: "Bad", percent: 2 },
          ],
        },
      },
      impact: {
        nodeId: "8677:5113",
        hero: {
          title: "One stroller, one tree",
          subtitle: "+185.000 trees and counting",
          imageSrc: "/assets/pdp/benefits/joolz/tree-hero.png",
          imageAlt: "Joolz one stroller one tree campaign",
        },
        items: [
          {
            id: "tree",
            label: "Aer2 owners helped plant 200.000+ trees",
            iconSrc: "/assets/pdp/benefits/joolz/trees-planted.png",
            iconAlt: "Trees planted icon",
          },
          {
            id: "materials",
            label: "Premium materials, lower impact -30% CO₂ footprint",
            iconSrc: "/assets/pdp/benefits/joolz/premium-materials.png",
            iconAlt: "Premium materials icon",
          },
          {
            id: "bottles",
            label: "+90 recycled bottles user per stroller",
            iconSrc: "/assets/pdp/benefits/joolz/recycled-bottles.png",
            iconAlt: "Recycled bottles icon",
          },
        ],
      },
      sustainability: {
        nodeId: "8612:6206",
        eyebrow: "Sustainability",
        title: "40.000\ntrees planted",
        decoration: {
          src: "/assets/pdp/sustainability/joolz/tree-mascot.svg",
          alt: "Joolz tree mascot illustration",
        },
        subheading: "We plant a tree for every stroller",
        body: "Made with recycled and bio-based materials, the Aer 2 reduces CO₂ emissions by 30%, while being designed for long-lasting, repairable use.",
        link: {
          label: "More about materials",
          href: "#sustainability",
          icon: "chevron",
        },
        gallery: [
          {
            id: "fabric",
            src: "/assets/pdp/sustainability/joolz/feature-bg.jpg",
            alt: "Joolz Aer 2 stroller fabric detail",
            thumbnailSrc: "/assets/pdp/sustainability/joolz/thumb-1.png",
            thumbnailAlt: "Fabric detail",
            hotspots: [
              {
                id: "fabric-story",
                x: 31.3,
                y: 38.5,
                title: "Recycled PET bottles",
                body: "Each Aer 2 uses 90+ recycled PET bottles in its fabric, lowering material impact without losing comfort.",
                iconSrc: "/assets/pdp/sustainability/joolz/pet-bottle.jpg",
                iconAlt: "Recycled PET bottle on green background",
              },
            ],
          },
          {
            id: "frame",
            src: "/assets/pdp/sustainability/joolz/thumb-2.jpg",
            alt: "Joolz Aer 2 frame",
            thumbnailSrc: "/assets/pdp/sustainability/joolz/thumb-2.jpg",
            thumbnailAlt: "Frame view",
            hotspots: [],
          },
          {
            id: "wheels",
            src: "/assets/pdp/sustainability/joolz/thumb-3.jpg",
            alt: "Joolz Aer 2 wheels",
            thumbnailSrc: "/assets/pdp/sustainability/joolz/thumb-3.jpg",
            thumbnailAlt: "Wheel detail",
            hotspots: [],
          },
        ],
      },
      shopTheLook: {
        nodeId: "8612:5105",
        eyebrow: "Made to match",
        title: "Meet the Aer2\nbasket bag",
        topImage: {
          src: "/assets/pdp/shop-the-look/joolz/top-image.jpg",
          alt: "Joolz Aer 2 with parent using one-hand fold",
        },
        subheading: "18L of extra storage under your seat",
        body: "Extra room for everything your day brings. Designed to fit seamlessly under the Joolz Aer2, this lightweight storage bag keeps daily essentials close at hand, from snacks and toys to groceries on the go. Easy to attach, easy to carry, and ready for every outing.",
        link: {
          label: "View product",
          href: "#shop-the-look",
          icon: "chevron",
        },
        heroImage: {
          src: "/assets/pdp/shop-the-look/joolz/feature-bg.jpg",
          alt: "Parent with baby and Joolz Aer 2 stroller in urban setting",
        },
        products: [
          {
            id: "basket-bag",
            title: "Joolz Aer2 basket bag",
            colorLabel: "Space Black",
            price: "€49,95",
            thumbnailSrc: "/assets/pdp/shop-the-look/joolz/product-1.jpg",
            thumbnailAlt: "Joolz Aer 2 basket bag",
          },
          {
            id: "parasol",
            title: "Parasol",
            colorLabel: "Sandy Taupe",
            price: "€49,95",
            thumbnailSrc: "/assets/pdp/shop-the-look/joolz/product-2.jpg",
            thumbnailAlt: "Joolz parasol",
          },
          {
            id: "seat-liner",
            title: "Breathable seat liner",
            colorLabel: "Forest Green",
            price: "€49,95",
            thumbnailSrc: "/assets/pdp/shop-the-look/joolz/product-3.jpg",
            thumbnailAlt: "Joolz breathable seat liner",
          },
        ],
        hotspots: [
          { id: "bag", x: 50, y: 64, productIndex: 0 },
        ],
      },
      accordions: [
        {
          id: "features",
          title: "Features",
          panel: {
            type: "features",
            nodeId: "8722:5310",
            heading: "The details behind the Joolz Aer²",
            features: [
              {
                title: "Extended sun hood with UPF 50+ protection",
                imageSrc: "/assets/pdp/accordion/joolz/feature-canopy.jpg",
                imageAlt: "Joolz Aer 2 extended sun hood",
              },
              {
                title: "Ergonomic seat, supporting up to 22 kg",
                imageSrc: "/assets/pdp/accordion/joolz/feature-seat.jpg",
                imageAlt: "Joolz Aer 2 ergonomic seat",
              },
              {
                title: "One-hand steering, with a high handlebar",
                imageSrc: "/assets/pdp/accordion/joolz/feature-handlebar.jpg",
                imageAlt: "Joolz Aer 2 handlebar",
              },
              {
                title: "Large wheels with suspension",
                imageSrc: "/assets/pdp/accordion/joolz/feature-wheels.jpg",
                imageAlt: "Joolz Aer 2 wheels with suspension",
              },
            ],
            otherHeading: "Other key features",
            otherFeatures: [
              "3 sleeping positions: seated, relaxed, and sleep, all adjustable with one-hand.",
              "Consciously crafted, premium materials made from bio-based plastic",
            ],
          },
        },
        {
          id: "specifications",
          title: "Specifications & Dimensions",
          panel: {
            type: "specifications",
            nodeId: "8722:5338",
            sections: [
              {
                title: "Age and weight range",
                bullets: ["From birth", "0 - 22 kg"],
              },
              {
                title: "Dimensions — Unfolded",
                bullets: ["Length: 85 cm", "Width: 45 cm", "Height: 106.5 cm"],
              },
              {
                title: "Dimensions — Folded",
                bullets: ["Length: 53 cm", "Width: 44 cm", "Height: 23.5 cm"],
              },
              {
                title: "Sizes",
                bullets: [
                  "Mattress length: 77 cm",
                  "Mattress width: 32 cm",
                  "Mattress height: 3 cm",
                  "Front wheel size: 14.4 cm",
                  "Rear wheel size: 15.5 cm",
                  "Seat sitting area length: 35.5 cm",
                  "Seat sitting area width: 38 cm",
                  "Seat backrest length: 55 cm",
                  "Seat backrest width: 34 cm",
                ],
              },
              {
                title: "Weight capacity",
                bullets: ["Max capacity stroller: 22 kg", "Max capacity shopping basket: 8 kg"],
              },
              {
                title: "Weights",
                bullets: [
                  "Weight stroller with cot: 8.5 kg",
                  "Weight cot: 4 kg",
                  "Volume shopping basket: 17 L",
                  "Buggy weight: 6.5 kg",
                ],
              },
              {
                title: "Care instructions",
                text: "To refresh the fabrics, we advise hand wash with a mild detergent. Rinse thoroughly and dry flat. Please keep in mind it is not possible to wash the fabrics in the washing machine.\n\nTo remove dirt for your chassis simply use a lukewarm wet cloth (no detergents needed). You can clean the wheels with water and mild detergent. Make sure you remove them before cleaning and put them back when they are dry.",
              },
            ],
          },
        },
        {
          id: "box",
          title: "What’s in the box",
          panel: {
            type: "box",
            nodeId: "8722:5385",
            imageSrc: "/assets/pdp/accordion/joolz/box-stroller-base.jpg",
            imageAlt: "Joolz Aer 2 stroller base with travel pouch",
            items: [
              {
                title: "Stroller base",
                description: "The hardware for your Joolz Aer². Includes wheels, wheel caps, and grips.",
              },
              {
                title: "Seat",
                description:
                  "Reversible and reclinable seat. Includes the seat/bassinet frame, seat fabric, seat hardware, five-point safety harness, adjustable seat footrest, and rotating carry handle.",
              },
              {
                title: "Seat liner",
                description: "With dual sides and enhanced breathability for year-round comfort.",
              },
              {
                title: "Sun canopy",
                description:
                  "Extendable and height-adjustable, with UPF 50+ protection and a peek-a-boo panel. Includes fabrics, wires, and clamps.",
              },
              {
                title: "Underseat basket",
                description:
                  "With extendable panels. Maximum 10 kg (22 lbs) or 39 liters (10.3 gallons).",
              },
              {
                title: "Travel pouch",
                description: "Spare travel pouch to carry everything you need on the go.",
              },
            ],
          },
        },
      ],
      colorways: [
        {
          id: "sandy-taupe",
          name: "Sandy Taupe",
          swatch: "#b7aa9b",
          thumbnailSrc: "/assets/pdp/joolz-aer/colorways/sandy-taupe.jpg",
          media: makeProductGalleryMedia({
            altPrefix: "Joolz Aer2 in sandy taupe",
            basePath: "/assets/pdp/joolz-aer/sandy-taupe",
            count: 7,
            extension: "jpg",
          }),
        },
        {
          id: "sage-green",
          name: "Sage Green",
          swatch: "#657265",
          thumbnailSrc: "/assets/pdp/joolz-aer/colorways/sage-green.jpg",
          media: makeProductGalleryMedia({
            altPrefix: "Joolz Aer2 in sage green",
            basePath: "/assets/pdp/joolz-aer/sage-green",
            count: 7,
            extension: "jpg",
          }),
        },
        {
          id: "midnight-blue",
          name: "Dark Navy Blue",
          swatch: "#121826",
          thumbnailSrc: "/assets/pdp/joolz-aer/colorways/midnight-blue.jpg",
          media: makeProductGalleryMedia({
            altPrefix: "Joolz Aer2 in dark navy blue",
            basePath: "/assets/pdp/joolz-aer/midnight-blue",
            count: 7,
            extension: "jpg",
          }),
        },
        {
          id: "space-black",
          name: "Black",
          swatch: "#111111",
          thumbnailSrc: "/assets/pdp/joolz-aer/colorways/space-black.jpg",
          media: makeProductGalleryMedia({
            altPrefix: "Joolz Aer2 in black",
            basePath: "/assets/pdp/joolz-aer/space-black",
            count: 7,
            extension: "jpg",
          }),
        },
      ],
    },
    {
      brand: "joolz",
      slug: "joolz-geo-5",
      aliases: ["joolz-geo5"],
      brandLabel: "Joolz",
      title: "Joolz Geo5",
      subtitle: "Most versatile, for all-terrain",
      price: "€ 1.399,00",
      rating: "4.6",
      reviewCount: "87 Reviews",
      stockStatus: "In stock",
      description: "Built for all-terrain freedom with flexible configurations for growing families.",
      reasons: [
        { id: "trial", label: "Try for 100 days" },
        { id: "delivery", label: "Free delivery and returns" },
        { id: "warranty", label: "4-year warranty" },
      ],
      reasonsCarousel: {
        items: [
          {
            id: "warranty",
            label: "10 year transferrable warranty",
            iconSrc: "/assets/pdp/reasons/joolz/warranty.svg",
            iconAlt: "Warranty icon",
          },
          {
            id: "delivery",
            label: "Free standard delivery",
            iconSrc: "/assets/pdp/reasons/joolz/delivery.svg",
            iconAlt: "Free delivery icon",
          },
          {
            id: "returns",
            label: "Free returns within 30 days",
            iconSrc: "/assets/pdp/reasons/joolz/returns.svg",
            iconAlt: "Free returns icon",
          },
          {
            id: "klarna",
            label: "Buy now, pay later with Klarna",
            iconSrc: "/assets/pdp/reasons/joolz/klarna.svg",
            iconAlt: "Klarna icon",
          },
        ],
      },
      reviews: {
        overall: { rating: 4.7, outOf: 5, count: 98 },
        photos: [
          { src: "/assets/pdp/joolz-aer/sage-green/gallery-02.jpg", alt: "Customer photo" },
          { src: "/assets/pdp/joolz-aer/sage-green/gallery-03.jpg", alt: "Customer photo" },
          { src: "/assets/pdp/joolz-aer/sage-green/gallery-04.jpg", alt: "Customer photo" },
        ],
        photoTotal: 3,
        subRatings: [
          { label: "Quality", rating: 4.4, outOf: 5 },
          { label: "Value for money", rating: 4.1, outOf: 5 },
        ],
        distribution: {
          total: 18,
          buckets: [
            { label: "Excellent", percent: 84 },
            { label: "Great", percent: 9 },
            { label: "Average", percent: 3 },
            { label: "Poor", percent: 2 },
            { label: "Bad", percent: 2 },
          ],
        },
      },
      impact: {
        nodeId: "8677:5113",
        hero: {
          title: "One stroller, one tree",
          subtitle: "+185.000 trees and counting",
          imageSrc: "/assets/pdp/benefits/joolz/tree-hero.png",
          imageAlt: "Joolz one stroller one tree campaign",
        },
        items: [
          {
            id: "warranty",
            label: "10-year transferable warranty",
            iconSrc: "/assets/pdp/benefits/joolz/lifetime-warranty.png",
            iconAlt: "Warranty icon",
          },
          {
            id: "bottles",
            label: "+90 recycled bottles user per stroller",
            iconSrc: "/assets/pdp/benefits/joolz/one-tree.png",
            iconAlt: "Recycled bottles icon",
          },
          {
            id: "materials",
            label: "Lower impact materials with -30% CO₂ footprint",
            iconSrc: "/assets/pdp/benefits/joolz/sustainable-materials.png",
            iconAlt: "Sustainable materials icon",
          },
        ],
      },
      accordions: [
        {
          id: "features",
          title: "Features",
          content: [
            "Flexible configurations for growing families with comfortable all-terrain handling.",
          ],
        },
        {
          id: "specifications",
          title: "Specifications",
          content: [
            "Designed for varied terrain, everyday storage, and adaptable family use.",
          ],
        },
        {
          id: "box",
          title: "What’s in the box",
          content: [
            "Stroller frame, seat, wheels, basket, canopy, and setup components.",
          ],
        },
      ],
      colorways: [
        {
          id: "forest-green",
          name: "Forest green",
          swatch: "#3c4a3d",
          media: [
            {
              id: "geo-side",
              src: "/assets/products/joolz-geo-1.png",
              alt: "Joolz Geo5 stroller in forest green",
              fit: "product",
            },
          ],
        },
      ],
    },
  ],
};

export function getProductBySlug(brand: BrandId, slug: string): ProductDetail | undefined {
  return productCatalog[brand].find((product) => (
    product.slug === slug || product.aliases?.includes(slug)
  ));
}

export function getDefaultProduct(brand: BrandId): ProductDetail {
  return productCatalog[brand][0];
}
