import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#FF6B6B', // Coral vibrante - solidariedade
          secondary: '#4ECDC4', // Turquesa - esperança
          success: '#44BD7A', // Verde - impacto positivo
          warning: '#FFA726', // Laranja - atenção
          error: '#E74C3C', // Vermelho - urgência
          info: '#3498DB', // Azul - informação
          surface: '#FFFFFF', // Branco - superfície
        },
      },
      dark: {
        colors: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          success: '#44BD7A',
          warning: '#FFA726',
          error: '#E74C3C',
          info: '#3498DB',
          surface: '#1E1E1E', // Cinza escuro - superfície dark
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
