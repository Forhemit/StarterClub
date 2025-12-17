/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                accent: 'var(--accent)',
            },
            fontFamily: {
                bebas: ['var(--font-bebas-neue)', 'sans-serif'],
                inter: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
