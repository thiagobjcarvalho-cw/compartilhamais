<template>
  <v-app>
    <!-- Barra de Navegação Superior -->
    <v-app-bar app color="primary" dark elevation="2" height="64">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-heart</v-icon>
        CompartilhaMais
      </v-toolbar-title>

      <v-spacer />

      <!-- Ações do Header -->
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Menu Lateral Navegação -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.route" link>
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo Principal -->
    <v-main>
      <v-container fluid class="pa-0" style="max-width: 100%; overflow-x: hidden">
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer (Opcional) -->
    <v-footer app color="grey lighten-4" height="48" class="d-none d-md-flex">
      <span class="text-caption grey--text"> © 2024 CompartilhaMais - Conectando corações </span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

interface MenuItem {
  title: string
  icon: string
  route: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Mapa de Instituições',
    icon: 'mdi-map-marker-multiple',
    route: '/',
  },
  {
    title: 'Minhas Doações',
    icon: 'mdi-heart-multiple',
    route: '/donations',
  },
  {
    title: 'Instituições Favoritas',
    icon: 'mdi-star-multiple',
    route: '/favorites',
  },
  {
    title: 'Perfil',
    icon: 'mdi-account',
    route: '/profile',
  },
  {
    title: 'Configurações',
    icon: 'mdi-cog',
    route: '/settings',
  },
]
</script>

<style scoped>
/* Garantir que o layout ocupe toda a tela */
.v-application {
  font-family: 'Roboto', sans-serif !important;
}

.v-main {
  padding-top: 64px !important;
}

/* Remover overflow horizontal */
.v-container {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Responsividade do título */
@media (max-width: 600px) {
  .v-toolbar-title {
    font-size: 1.1rem !important;
  }
}
</style>
