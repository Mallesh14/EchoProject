/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontSize: {
                'xxs': ['0.65rem', { lineHeight: '1rem' }],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.3s ease both',
                'fade-in-scale': 'fadeInScale 0.2s ease both',
            },
            keyframes: {
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInScale: {
                    from: { opacity: '0', transform: 'scale(0.96)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
