
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        bg: {
          white: 'hsl(0, 0%, 100%)',
          gray: 'hsl(220, 14%, 96%)'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        success: 'hsl(142, 71%, 45%)',
        danger: 'hsl(0, 84%, 60%)',
        gradient: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,70,121,0) 0%, rgba(0,212,255,1) 100%)',
        layout: 'hsl(209, 100%, 46%)',//'hsl(220, 14%, 96%)', this is white background
        'layout-light': 'hsl(217, 19%, 27%)',
        lowkey: 'hsl(220, 14%, 96%)', // 'hsl(220, 9%, 46%)',
        title: 'hsl((220, 14%, 96%)',
        text: 'hsl(0, 0%, 25%)',
        link: 'hsl(193, 82%, 31%)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        xl: '`calc(var(--radius) + 4px)`',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      screens: {
        xxs: '320px',
        xs: '480px'
      },
      backgroundImage: {
        'gradient-example': 'linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(220, 14%, 96%))',
        'gradient-multi': 'linear-gradient(to right, hsl(220.91, 39.29%, 10.98%),hsl(288, 31.03%, 28.43%) ,hsl(340.18, 45.16%, 48.63%),hsl(18.97, 85.29%, 60%))',
        'gradient-blue': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,70,121,0) 0%, rgba(0,212,255,1) 100%)',
        'gradient-custom': 'linear-gradient(to right, hsl(0, 0%, 100%), hsl(355.1, 100%, 90.39%), hsl(7.71, 100%, 78.63%), hsl(18.97, 85.29%, 60%))'
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@headlessui/tailwindcss"),
    require("tailwindcss-animate"),
  ],
};
