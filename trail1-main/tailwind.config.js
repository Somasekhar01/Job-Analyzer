export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1e1c2f',
        muted: '#77758a',
        accent: '#7256e8',
        'accent-dark': '#5d43cf',
        canvas: '#f7f7fb',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
