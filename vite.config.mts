import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// 在打包出来的 index.es.js 的第一行自动加上 `import style.css`
import { libInjectCss } from 'vite-plugin-lib-inject-css';

function resolve(str: string) {
  return path.resolve(__dirname, str);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
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
      entry: {
        index: resolve('src/index.ts'),
        linked: resolve('src/linked/index.tsx'),
        tree: resolve('src/tree/index.tsx'),
      },
      fileName: (format, entryName) => {
        if (entryName !== 'index') {
          return `${entryName}/index.${format}.js`;
        }
        return `${entryName}.${format}.js`;
      },
    },
    // sourcemap: true,
    rollupOptions: {
      // 确保外部化正确处理react
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
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
