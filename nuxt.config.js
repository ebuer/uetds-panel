import colors from 'vuetify/es5/util/colors'
require('dotenv').config()
import tr from 'vuetify/src/locale/tr'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - uetds-panel',
    title: 'uetds-panel',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/global', ssr: false}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],

  pageTransition: {
    name: 'layout',
  },
  env: {
    baseURL: process.env.baseURL,
    PDF_BASE: process.env.PDF_BASE
  },
  axios: {
    baseURL:process.env.baseURL || 'http://test.gold-trace.com',
    redirectError: {
      401: '/login',
      404: '/error',
      403: '/login',
      203: '/login'
    }
  },
  router: {
    middleware: ['auth'],
    base: '/',
    linkActiveClass: '',
    linkExactActiveClass: 'active',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: '/login', method: 'post', propertyName: 'access_token'},
          logout: false,
          user: {url: '/profile', method: 'get', propertyName: 'data'},
          tokenRequired: true,
          tokenType: 'Bearer',
          globalToken: true,
          autoFetchUser: false,
        }
      },
    },
    redirect: {
      register: '/login',
      login: '/login',
      logout: '/login',
    },
    plugins: [{src: '~/plugins/axios', ssr: true}, '~/plugins/auth.js']
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    lang: {
      locales: { tr },
      current: 'tr',
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
