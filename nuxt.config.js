
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    //title: process.env.npm_package_name || '',
    title: 'みんなの方程式',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://img.icons8.com/cotton/32/000000/cat--v2.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
 loading: '~/components/Loading.vue',
 /*
  ** Global CSS
  */
  css: [
    '@/assets/css/style.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-localStorage'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    'bootstrap-vue/nuxt'
  ],
  bootstrapVue: {
    icons: true
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
