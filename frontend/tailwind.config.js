/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
            blue: '#2563eb',
            indigo: '#4f46e5',
            purple: '#9333ea',
            emerald: '#10b981',
            teal: '#14b8a6',
            cyan: '#06b6d4',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow-primary-md': '0 0 1rem hsl(var(--primary) / 0.2)',
        'glow-primary-lg': '0 0 2rem hsl(var(--primary) / 0.3)',
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "halo": {
            "0%": { "box-shadow": "0 0 20px 5px hsl(var(--primary) / 0.0), 0 0 20px 5px hsl(var(--primary) / 0.0)" },
            "50%": { "box-shadow": "0 0 20px 5px hsl(var(--primary) / 0.1), 0 0 30px 5px hsl(270 90% 55% / 0.1)" },
            "100%": { "box-shadow": "0 0 20px 5px hsl(var(--primary) / 0.0), 0 0 20px 5px hsl(var(--primary) / 0.0)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "halo": "halo 6s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}