// Vuetify Configuration with Custom Theme
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const compartilhaMaisTheme = {
  dark: false,
  colors: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#FAFAFA',
    'surface-variant': '#F5F5F5',
    'on-surface-variant': '#636E72',
    primary: '#6C63FF',
    'primary-darken-1': '#5650DB',
    secondary: '#FF6B6B',
    'secondary-darken-1': '#E55555',
    error: '#EF5350',
    info: '#4ECDC4',
    success: '#00D9A3',
    warning: '#FFB74D',
    'on-background': '#2D3436',
    'on-surface': '#2D3436',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#FFFFFF',
  },
  variables: {
    'border-color': '#E0E0E0',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.08,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#2D3436',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'compartilhaMaisTheme',
    themes: {
      compartilhaMaisTheme,
    },
  },
  defaults: {
    global: {
      ripple: true,
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'lg',
      elevation: 0,
      fontWeight: 500,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VChip: {
      rounded: 'pill',
    },
  },
})