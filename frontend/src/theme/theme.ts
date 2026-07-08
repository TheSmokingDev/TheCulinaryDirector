import type { ThemeConfig } from "antd";

export const brand = {
  cream: "#f2ede6",
  creamLight: "#faf7f2",
  sand: "#d9d1c7",
  ink: "#1e1c1d",
  maroon: "#531c1c",
  maroonDark: "#3d1212",
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: brand.maroon,
    colorText: brand.ink,
    colorTextHeading: brand.ink,
    colorBorder: brand.sand,
    colorBgContainer: brand.creamLight,
    colorBgLayout: brand.cream,
    colorLink: brand.ink,
    colorLinkHover: brand.maroon,
    colorLinkActive: brand.maroonDark,
    borderRadius: 2,
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    fontSize: 15,
  },
  components: {
    Button: {
      colorPrimaryHover: brand.maroonDark,
      colorPrimaryActive: brand.maroonDark,
      controlHeight: 42,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 42,
    },
    InputNumber: {
      controlHeight: 42,
    },
    Card: {
      colorBorderSecondary: brand.sand,
    },
  },
};
