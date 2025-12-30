import { defineConfig } from 'vite';
import path from 'path';
import { sync } from 'glob';
import SassGlob from 'vite-plugin-sass-glob-import';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig({
  plugins: [
    SassGlob(),
    // Конфигурация SVG спрайта
    createSvgIconsPlugin({
      // Путь к папке с иконками
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Формат ID: icon-monochrome-name или icon-colored-name
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        full: true, // Отключаем все дефолтные плагины SVGO, чтобы они не меняли цвета сами по себе
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: '(fill|stroke)',
            },
            // Логика: если файл в папке 'colored', мы возвращаем null,
            // тем самым отменяя удаление атрибутов для этого файла
            fn: (item, params, info) => {
              if (info.path && info.path.includes('colored')) {
                return null;
              }
            },
          },
          // Базовые безопасные оптимизации для всех иконок
          'removeXMLNS',
          'removeDimensions',
          'removeViewBox', // Опционально, если хотите оставить viewBox, удалите эту строку
        ],
      },
    }),
    ViteImageOptimizer({
      png: { quality: 70 },
      jpeg: { quality: 70 },
      jpg: { quality: 70 },
      webp: { quality: 85 },
      avif: { lossless: true },
      // Исключаем svg из оптимизатора, так как мы настроили его выше в createSvgIconsPlugin
      svg: false,
    }),
  ],
  build: {
    rollupOptions: {
      input: sync('src/**/*.html'.replace(/\\/g, '/')),
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name;
          if (/css/.test(extType)) {
            extType = 'assets/css';
          }
          return assetInfo.originalFileName ?? `${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: '../dist',
  },
  root: 'src',
  base: '',
});
