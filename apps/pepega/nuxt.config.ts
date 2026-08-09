import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import type { NuxtOptions } from 'nuxt/schema';
import { kvStorageName } from './constants';

type ComponentType = 'page' | 'layout' | 'component';
type TypeScriptCompilerOptions = NonNullable<
  NuxtOptions['typescript']['tsConfig']['compilerOptions']
>;

const projectTypeScriptCompilerOptions = {
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
} satisfies TypeScriptCompilerOptions;

function getComponentType(filePath: string): ComponentType {
  if (filePath.includes('/app/pages/')) {
    return 'page';
  } else if (filePath.includes('/app/layouts/')) {
    return 'layout';
  }
  return 'component';
}

function getComponentName(componentName: string, componentType: ComponentType): string {
  if (componentType === 'component') {
    return componentName;
  }

  return `${componentType}-${componentName}`;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-18',

  modules: ['@nuxt/fonts', '@nuxt/icon', '@pinia/nuxt', '@pinia/colada-nuxt'],

  experimental: {
    viewTransition: true,

    /**
     * FIXME: Disable once Nuxt modules stop relying on Nitro auto-imports.
     *
     * https://github.com/nuxt/nuxt/issues/34142
     */
    nitroAutoImports: true,
  },

  future: {
    compatibilityVersion: 5,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        ...projectTypeScriptCompilerOptions,
      },
    },

    sharedTsConfig: {
      compilerOptions: {
        ...projectTypeScriptCompilerOptions,
      },
    },

    nodeTsConfig: {
      compilerOptions: {
        ...projectTypeScriptCompilerOptions,
      },
    },
  },

  runtimeConfig: {
    public: {
      telegramBotName: '@pepega_app_test_bot',
    },
  },

  // Disable all autoimports (except components)
  imports: {
    autoImport: false,
  },

  devtools: {
    enabled: true,
  },

  // Disable autoimport for components
  components: [],

  devServer: {
    port: 4000,
  },

  nitro: {
    preset: 'cloudflare_module',

    typescript: {
      tsConfig: {
        compilerOptions: {
          ...projectTypeScriptCompilerOptions,
        },
      },
    },

    cloudflare: {
      deployConfig: false,
    },

    storage: {
      [kvStorageName]: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV',
      },
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
  },

  pinia: {
    storesDirs: [],
  },

  vite: {
    css: {
      modules: {
        generateScopedName(className, filename, data): string {
          const hash = createHash('sha256').update(data).digest('hex').slice(0, 6);

          const filePath = filename.replace(/\.vue(?:\?.+?)?$/u, '').replaceAll(/\[|\]/gu, '');

          const baseName = basename(filePath);
          const componentType = getComponentType(filePath);
          const componentName = getComponentName(baseName, componentType);

          return `${componentName}_${className}_${hash}`;
        },
      },
    },
  },
});
