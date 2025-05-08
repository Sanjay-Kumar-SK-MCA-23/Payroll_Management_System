module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {},
  variants: {
    extend: {
      colors: {
        custom: {
          "Custom-black": "rgb(17, 25, 40)", // Define a custom color with RGB values
        },
      },
    },
  },
  plugins: [require("tailgrids/plugin"), require("tailwind-scrollbar")({ preferredStrategy: "pseudoelements" })],
};
