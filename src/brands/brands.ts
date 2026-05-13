export type BrandId = "bugaboo" | "joolz";

export type BrandNavigation = {
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
};

export type BrandConfig = {
  id: BrandId;
  name: string;
  navigation: BrandNavigation;
};

export const brands: Record<BrandId, BrandConfig> = {
  bugaboo: {
    id: "bugaboo",
    name: "Bugaboo",
    navigation: {
      logoSrc: "/assets/brand/bugaboo-logo.svg",
      logoAlt: "Bugaboo",
      logoWidth: 110,
      logoHeight: 21,
    },
  },
  joolz: {
    id: "joolz",
    name: "Joolz",
    navigation: {
      logoSrc: "/assets/brand/joolz-logo.svg",
      logoAlt: "Joolz",
      logoWidth: 84,
      logoHeight: 18,
    },
  },
};
