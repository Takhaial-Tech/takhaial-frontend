/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'border-body': 'linear-gradient(-45deg, #555859, #000, #003bcd, #ed271e)',
        'hero-pattern': "url('/img3.png')",
        "gradient-radial": "radial-gradient(210px 310px, rgba(255, 51, 85, 0) 0%, rgb(0, 0, 0) 150%)",
        "gradient-radial2": "radial-gradient(870px 300px, rgba(255, 51, 85, 0) 0%, rgb(0, 0, 0) 100%)",
        "gradient-radial-sec": "radial-gradient(250px 190px, rgba(255, 51, 85, 0) 0%, rgb(0, 0, 0) 100%)",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        '3xl': '#130000 0 0 0 5px, #ff0000a3 0 0 0 6px, #000000 0 0 0 13px, #ff000059 0 0 0 14px',
        '4xl': '#130000 0 0 0 10px, #ff0000a3 0 0 0 12px, #000000 0 0 0 19px, #ff000059 0 0 0 21px',
      },
      transformStyle: {
        'translate3D': 'translate3d(-50%, 0, 0)',
        '3d': 'perspective-3d',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        'con': '1fr 4fr',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },

    },
  },
  plugins: [],
}

