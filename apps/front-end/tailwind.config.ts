import type { Config } from 'tailwindcss';
import path from 'path';

const frontEndDir = path.resolve(__dirname);

const config: Config = {
  darkMode: 'class',
  content: [
    path.join(frontEndDir, 'index.html'),
    path.join(frontEndDir, 'src/**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        teddy: {
          orange: '#EC6724',
          'orange-hover': '#d45a1f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
