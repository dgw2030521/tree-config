import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// 可以使用vite-plugin-libcss
// 在打包出来的 index.es.js 的第一行自动加上 `import style.css`
import libCss from 'vite-plugin-libcss';

function resolve(str: string) {
  return path.resolve(__dirname, str);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libCss(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
    }),
  ],
  // 模块开发需要重新配置build，覆盖vite针对web项目的默认配置
  build: {
    // 打包输出的目录
    outDir: 'dist',
    // 防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制
    cssTarget: 'chrome61',
    // 然后使用build.cssCodeSplit: true
    // 给index.umd.js 生成内链css,不确定，[待验证，ts项目里没使用require验证]
    cssCodeSplit: true,
    lib: {
      // 组件库源码的入口文件
      entry: resolve('src/index.tsx'),
      name: 'slider-date-picker',
      fileName: format => `index.${format}.js`,
    },
    // sourcemap: true,
    rollupOptions: {
      // 确保外部化正确处理react
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },

  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  // dev server
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
  },
});
