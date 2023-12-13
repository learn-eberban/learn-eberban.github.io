/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			"serif": ["Bitter", "serif"],
			"mono": ["League Mono"],
		},
		listStyleType: {
			alpha: "lower-alpha",
			none: "none",
			disc: "disc",
			decimal: "decimal",
			roman: "lower-roman",
		},
		extend: {},
	},
	plugins: [],
}
