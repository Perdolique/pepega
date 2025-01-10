import { createHash, type BinaryLike } from 'crypto'
import { basename } from 'path'

type ComponentType = 'page' | 'layout' | 'component';

function getComponentType(filePath: string) : ComponentType {
  if (filePath.includes('/app/pages/')) {
    return 'page';
  } else if (filePath.includes('/app/layouts/')) {
    return 'layout';
  } else {
    return 'component';
  }
}

function getComponentName(componentName: string, componentType: ComponentType) : string {
  if (componentType === 'component') {
    return componentName;
  }

  return `${componentType}-${componentName}`;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-06',

  typescript: {
    strict: true,
    typeCheck: true
  },

  experimental: {
    viewTransition: true
  },

  // Disable all autoimports (except components)
  imports: {
    scan: false
  },

  // Disable autoimport for components
  components: [],

  devServer: {
    port: 4000
  },

  devtools: {
    enabled: true
  },

  nitro: {
    preset: 'cloudflare-pages'
  },

  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],

  icon: {
    clientBundle: {
      scan: true
    }
  },

  pinia: {
    storesDirs: []
  },

  vite: {
    css: {
      modules: {
        generateScopedName(className: string, filename: string, data: BinaryLike) : string {
          const hash = createHash('sha256')
            .update(data)
            .digest('hex')
            .slice(0, 6);

          const filePath = filename
            .replace(/\.vue(?:\?.+?)?$/u, '')
            .replace(/\[|\]/gu, '');

          const baseName = basename(filePath);
          const componentType = getComponentType(filePath);
          const componentName = getComponentName(baseName, componentType);

          return `${componentName}_${className}_${hash}`;
        }
      }
    }
  }
})
