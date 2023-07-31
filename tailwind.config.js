/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: [
			{
				dark: {
					primary: '#f48f25',
					secondary: '#F7EEC7',
					accent: '#707099',
					neutral: '#2A4046',
					'base-100': '#1D343A',
					info: '#3abff8',
					success: '#36d399',
					warning: '#fbbd23',
					error: '#f87272'
				}
			}
		]
	},
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
				lobster: ['Lobster', 'cursive']
			}
		}
	},
	plugins: [require('daisyui')]
};
