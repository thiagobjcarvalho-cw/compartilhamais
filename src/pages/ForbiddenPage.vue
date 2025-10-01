<template>
  <v-container class="forbidden-page d-flex align-center justify-center" style="min-height: 80vh;">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" border rounded="lg" class="text-center pa-8">
          <!-- Icon -->
          <v-icon
            icon="mdi-shield-lock"
            size="80"
            color="error"
            class="mb-4"
          />

          <!-- Title -->
          <h1 class="text-h3 font-weight-bold mb-2">403</h1>
          <h2 class="text-h5 mb-4">Acesso Negado</h2>

          <!-- Message -->
          <p class="text-body-1 text-medium-emphasis mb-6">
            Você não tem permissão para acessar esta página.
            Por favor, verifique suas credenciais ou entre em contato com o administrador.
          </p>

          <!-- Actions -->
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-home"
            to="/"
            class="mb-3"
          >
            Voltar ao Início
          </v-btn>

          <v-btn
            color="primary"
            variant="text"
            size="large"
            prepend-icon="mdi-login"
            to="/login"
            block
          >
            Fazer Login
          </v-btn>

          <!-- Additional Info -->
          <v-divider class="my-6" />
          
          <div class="text-caption text-medium-emphasis">
            <p class="mb-2">
              <v-icon icon="mdi-information" size="16" class="mr-1" />
              Possíveis razões para este erro:
            </p>
            <ul class="text-left pl-6">
              <li>Sua sessão expirou</li>
              <li>Você não tem as permissões necessárias</li>
              <li>A página requer um tipo de conta diferente</li>
            </ul>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Log do erro para analytics (em produção)
  console.log('403 Forbidden page accessed', {
    user: authStore.user?.id,
    role: authStore.userRole,
    timestamp: new Date().toISOString()
  })
})
</script>

<style scoped>
.forbidden-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

ul {
  list-style-type: disc;
}
</style>