module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  // pages ディレクトリも対象に
    './components/**/*.{js,ts,jsx,tsx}',  // components ディレクトリも対象に
    './app/**/*.{js,ts,jsx,tsx}',  // Next.js app ディレクトリも含む
    './src/**/*.{js,ts,jsx,tsx}',  // src ディレクトリも含む
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
