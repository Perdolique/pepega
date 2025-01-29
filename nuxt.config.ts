import { createHash, type BinaryLike } from 'crypto'
import { basename } from 'path'
import { kvStorageName } from './constants';

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
    viewTransition: true,

    defaults: {
      nuxtLink: {
        prefetch: true,

        prefetchOn: {
          interaction: true,
          visibility: false
        }
      }
    }
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
    preset: 'cloudflare-pages',

    storage: {
      [kvStorageName]: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV'
      }
    },

    devStorage: {
      [kvStorageName]: {
        driver: 'fs',
        base: './.nuxt/dev-storage/kv'
      }
    }
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
