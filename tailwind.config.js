/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 色系
        healing: {
          blue: '#E0F2FE', // 冥想平静蓝
          peach: '#FEE2E2', // 温暖拥抱粉
          mint: '#D1FAE5', // 治愈生机绿
          sand: '#F3F4F6', // 匿名安全灰
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', // 柔和的毛玻璃弥散阴影
      },
    },
  },
  plugins: [],
}
