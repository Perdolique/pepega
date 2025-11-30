import { createHash, type BinaryLike } from 'crypto'
import { basename } from 'path'
import { kvStorageName } from './constants'

type ComponentType = 'page' | 'layout' | 'component'

function getComponentType(filePath: string) : ComponentType {
  if (filePath.includes('/app/pages/')) {
    return 'page'
  } else if (filePath.includes('/app/layouts/')) {
    return 'layout'
  } else {
    return 'component'
  }
}

function getComponentName(componentName: string, componentType: ComponentType) : string {
  if (componentType === 'component') {
    return componentName
  }

  return `${componentType}-${componentName}`
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-30',

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@pinia/colada-nuxt'
  ],

  experimental: {
    viewTransition: true,
    scanPageMeta: true,
    granularCachedData: true,
    typescriptPlugin: true,
    viteEnvironmentApi: true,

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

  future: {
    compatibilityVersion: 5
  },

  typescript: {
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      telegramBotName: '@pepega_app_test_bot'
    }
  },

  // Disable all autoimports (except components)
  imports: {
    scan: false
  },

  devtools: {
    enabled: true
  },

  // Disable autoimport for components
  components: [],

  devServer: {
    port: 4000
  },

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: false
    },

    storage: {
      [kvStorageName]: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV'
      }
    }
  },

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
