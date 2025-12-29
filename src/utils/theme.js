// Theme configuration for consistent styling across the app

const palette = {
  primary: "#2E5C55",
  secondary: "#4A90E2",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  errorDark: "#DC2626",
};

export const lightColors = {
  mode: "light",
  ...palette,
  background: "#F5F5F5",
  surface: "#FFFFFF", // Was 'white'
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  white: "#FFFFFF", // Keep for absolute white needs
  black: "#000000",
};

export const darkColors = {
  mode: "dark",
  ...palette,
  background: "#121212",
  surface: "#1E1E1E", // Dark mode card background
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  border: "#374151",
  borderLight: "#4B5563",
  white: "#FFFFFF",
  black: "#000000",
};

// Default export for backwards compatibility (points to light)
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};
