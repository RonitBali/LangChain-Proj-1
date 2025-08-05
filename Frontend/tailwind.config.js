/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./components/**/*.{js,ts,jsx,tsx,vue}",
    "./pages/**/*.{js,ts,jsx,tsx,vue}",
    "./app/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Enable JIT mode for better performance
  mode: 'jit',
  // Add safelist for classes that might be dynamically generated
  safelist: [
    'text-cyan-200',
    'speech',
    'speech-human', 
    'speech-ai',
    'typing-indicator',
    'submit-btn'
  ]
}

