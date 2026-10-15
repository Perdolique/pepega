import { createHash } from 'node:crypto'
import { basename } from 'node:path'
import { kvStorageName } from './constants.ts'
import type { NuxtOptions } from 'nuxt/schema'

type ComponentType = 'page' | 'layout' | 'component'
type TypeScriptCompilerOptions = NonNullable<
  NuxtOptions['typescript']['tsConfig']['compilerOptions']
>

const projectTypeScriptCompilerOptions = {
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  noUnusedLocals: true,
  noUnusedParameters: true
} satisfies TypeScriptCompilerOptions

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
  compatibilityDate: '2026-10-15',

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],

  fonts: {
    processCSSVariables: 'ui',
    families: [{
      name: 'Baloo 2',
      global: true,
      weights: [700, 800],
      styles: ['normal'],
      subsets: ['latin']
    }]
  },

  experimental: {
    viewTransition: true,
    strictRouteTypes: true,
    // Nitro 2's Cloudflare dev plugin still imports helpers from #imports.
    nitroAutoImports: true
  },

  future: {
    compatibilityVersion: 5
  },

  typescript: {
    tsConfig: {
      compilerOptions: projectTypeScriptCompilerOptions
    },

    nodeTsConfig: {
      compilerOptions: {
        // Nitro 2's declaration barrels still use extensionless imports.
        module: 'preserve',
        moduleResolution: 'bundler'
      }
    }
  },

  runtimeConfig: {
    public: {
      telegramBotName: '@pepega_app_test_bot'
    }
  },

  // Disable all autoimports (except components)
  imports: {
    autoImport: false
  },

  devtools: {
    enabled: true
  },

  // Disable autoimport for components
  components: [],

  devServer: {
    port: 4000
  },

  hooks: {
    ready: (nuxt) => {
      nuxt.hook('server:routes', (_routes, context) => {
        context.requestTypes = {
          module: '#shared/types/api-request',
          body: 'RequestBodyOf',
          query: 'RequestQueryOf'
        }
      })
    }
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
        generateScopedName(className: string, filename: string, data: string) : string {
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
