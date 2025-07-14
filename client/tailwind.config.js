export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Culoarea principală: roșu vibrant
        primary: {
          DEFAULT: '#E53935',
          light: '#FFCDD2',
          dark: '#B71C1C',
          foreground: '#FFFFFF',
        },
        // Fundal principal
        background: '#FFFFFF',
        // Text de bază
        foreground: '#212121',
        // Zone neutre (ex: sidebar, carduri)
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#757575',
        },
        // Borduri și elemente UI
        border: '#E0E0E0',
        input: '#E0E0E0',
        ring: '#E53935',
        // Culori pentru stări de eroare sau acțiuni distructive
        destructive: {
          DEFAULT: '#D32F2F',
          foreground: '#FFFFFF',
        },
        // Opționale – pentru viitoare completări:
        accent: {
          DEFAULT: '#FF8A80',
          foreground: '#B71C1C',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#212121',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#212121',
        },
        chart: {
          '1': '#E53935',
          '2': '#FF7043',
          '3': '#FDD835',
          '4': '#66BB6A',
          '5': '#29B6F6',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
