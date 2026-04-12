import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#76422B", // Primary Brown
                    dark: "#3B2B28",    // Dark Brown
                },
                secondary: {
                    DEFAULT: "#C9A45C", // Gold Accent
                },
                neutral: {
                    50: "#F5F1EC",  // Cream White
                    100: "#EFE8E2", // Warm Beige
                    800: "#3B2B28", // Dark Brown
                    900: "#161314", // Rich Black
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
            container: {
                center: true,
                padding: "1rem",
                screens: {
                    "2xl": "1400px",
                },
            },
        },
    },
    plugins: [],
};
export default config;
