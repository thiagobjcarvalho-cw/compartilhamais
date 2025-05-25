<!-- src/pages/SettingsPage.vue -->
<template>
  <div class="settings-page">
    <!-- Header da Página -->
    <div class="page-header">
      <div class="d-flex align-center mb-4">
        <v-btn icon variant="text" @click="$router.back()" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h4 font-weight-bold">Configurações</h1>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Personalize sua experiência no SolidarityApp
          </p>
        </div>
      </div>
    </div>

    <v-row>
      <!-- Configurações Principais -->
      <v-col cols="12" lg="8">
        <!-- Seção: Perfil do Usuário -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-account-circle</v-icon>
            Informações do Perfil
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-form ref="profileFormRef" v-model="profileFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.name"
                    label="Nome completo"
                    variant="outlined"
                    :rules="validationRules.required"
                    required
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.email"
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    :rules="validationRules.email"
                    required
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.phone"
                    label="Telefone"
                    variant="outlined"
                    :rules="validationRules.phone"
                    placeholder="(11) 99999-9999"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.city"
                    label="Cidade"
                    variant="outlined"
                    placeholder="São Paulo"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              :disabled="!profileFormValid"
              :loading="loadingStates.profile"
              @click="saveProfile"
            >
              <v-icon start>mdi-content-save</v-icon>
              Salvar Perfil
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Seção: Preferências de Doação -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="success">mdi-heart-settings</v-icon>
            Preferências de Doação
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="preferencesForm.categories"
                  :items="needCategoryOptions"
                  item-title="title"
                  item-value="value"
                  label="Categorias de doação preferidas"
                  multiple
                  variant="outlined"
                  chips
                  closable-chips
                >
                  <template #chip="{ props, item }">
                    <v-chip v-bind="props" :color="item.raw.color" variant="flat" size="small">
                      <v-icon start size="16">{{ item.raw.icon }}</v-icon>
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <label class="text-body-2 font-weight-medium">
                    Distância máxima: {{ preferencesForm.maxDistance }}km
                  </label>
                </div>
                <v-slider
                  v-model="preferencesForm.maxDistance"
                  :min="1"
                  :max="50"
                  step="1"
                  thumb-label
                  color="primary"
                  track-color="grey-lighten-2"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              variant="flat"
              :loading="loadingStates.preferences"
              @click="savePreferences"
            >
              <v-icon start>mdi-content-save</v-icon>
              Salvar Preferências
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Seção: Notificações -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="info">mdi-bell-settings</v-icon>
            Configurações de Notificação
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-email</v-icon>
                </template>

                <v-list-item-title>Novas Instituições</v-list-item-title>
                <v-list-item-subtitle>
                  Receber notificações sobre novas instituições na sua região
                </v-list-item-subtitle>

                <template #append>
                  <v-switch
                    v-model="notificationsForm.newInstitutions"
                    color="primary"
                    hide-details
                  />
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="warning">mdi-alert-circle</v-icon>
                </template>

                <v-list-item-title>Necessidades Urgentes</v-list-item-title>
                <v-list-item-subtitle>
                  Receber alertas sobre necessidades críticas
                </v-list-item-subtitle>

                <template #append>
                  <v-switch v-model="notificationsForm.urgentNeeds" color="primary" hide-details />
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="success">mdi-heart-pulse</v-icon>
                </template>

                <v-list-item-title>Atualizações de Doação</v-list-item-title>
                <v-list-item-subtitle> Receber feedback sobre suas doações </v-list-item-subtitle>

                <template #append>
                  <v-switch
                    v-model="notificationsForm.donationUpdates"
                    color="primary"
                    hide-details
                  />
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="info">mdi-calendar-week</v-icon>
                </template>

                <v-list-item-title>Relatório Semanal</v-list-item-title>
                <v-list-item-subtitle> Receber resumo semanal de atividades </v-list-item-subtitle>

                <template #append>
                  <v-switch v-model="notificationsForm.weeklyReport" color="primary" hide-details />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="info"
              variant="flat"
              :loading="loadingStates.notifications"
              @click="saveNotifications"
            >
              <v-icon start>mdi-content-save</v-icon>
              Salvar Notificações
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Sidebar de Ações e Informações -->
      <v-col cols="12" lg="4">
        <!-- Card de Ações Rápidas -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-list density="compact">
              <v-list-item @click="exportUserData" :disabled="loadingStates.export">
                <template #prepend>
                  <v-icon color="info">mdi-download</v-icon>
                </template>
                <v-list-item-title>Exportar Meus Dados</v-list-item-title>
                <template #append>
                  <v-progress-circular
                    v-if="loadingStates.export"
                    indeterminate
                    size="16"
                    width="2"
                  />
                  <v-icon v-else size="16">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>

              <v-list-item @click="clearCache" :disabled="loadingStates.cache">
                <template #prepend>
                  <v-icon color="warning">mdi-cached</v-icon>
                </template>
                <v-list-item-title>Limpar Cache</v-list-item-title>
                <template #append>
                  <v-progress-circular
                    v-if="loadingStates.cache"
                    indeterminate
                    size="16"
                    width="2"
                  />
                  <v-icon v-else size="16">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>

              <v-list-item @click="contactSupport">
                <template #prepend>
                  <v-icon color="success">mdi-help-circle</v-icon>
                </template>
                <v-list-item-title>Suporte Técnico</v-list-item-title>
                <template #append>
                  <v-icon size="16">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>

              <v-divider class="my-2" />

              <v-list-item @click="confirmDeleteAccount" class="text-error">
                <template #prepend>
                  <v-icon color="error">mdi-delete-forever</v-icon>
                </template>
                <v-list-item-title>Excluir Conta</v-list-item-title>
                <template #append>
                  <v-icon size="16">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Card de Informações da Aplicação -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="info">mdi-information-outline</v-icon>
            Sobre o Aplicativo
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-4">
              <div class="d-flex justify-space-between mb-2">
                <strong>Versão:</strong>
                <span>{{ appInfo.version }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <strong>Última atualização:</strong>
                <span>{{ appInfo.lastUpdate }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <strong>Ambiente:</strong>
                <v-chip
                  size="x-small"
                  :color="appInfo.environment === 'production' ? 'success' : 'warning'"
                >
                  {{ appInfo.environment }}
                </v-chip>
              </div>
            </div>

            <v-btn
              block
              color="primary"
              variant="outlined"
              :loading="loadingStates.update"
              @click="checkForUpdates"
            >
              <v-icon start>mdi-update</v-icon>
              Verificar Atualizações
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de Confirmação para Exclusão de Conta -->
    <v-dialog v-model="showDeleteDialog" max-width="420" persistent>
      <v-card>
        <v-card-title class="text-error d-flex align-center">
          <v-icon class="mr-2" color="error">mdi-alert-octagon</v-icon>
          Confirmar Exclusão
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <v-alert type="error" variant="tonal" class="mb-4">
            <strong>Atenção:</strong> Esta ação é irreversível!
          </v-alert>

          <p class="mb-4">Todos os seus dados serão permanentemente excluídos, incluindo:</p>

          <ul class="text-body-2 mb-4">
            <li>Histórico de doações</li>
            <li>Instituições favoritas</li>
            <li>Preferências e configurações</li>
            <li>Dados de perfil</li>
          </ul>

          <v-text-field
            v-model="deleteConfirmation"
            label="Digite 'EXCLUIR' para confirmar"
            variant="outlined"
            color="error"
            :rules="[(v) => v === 'EXCLUIR' || 'Digite EXCLUIR para confirmar']"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cancelDeleteAccount"> Cancelar </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :disabled="deleteConfirmation !== 'EXCLUIR'"
            :loading="loadingStates.delete"
            @click="executeDeleteAccount"
          >
            Excluir Conta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para Feedback -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="4000" location="bottom">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, type Ref } from 'vue'
import { useDonorStore } from '@/stores/donor'
import type { NeedCategory, NotificationPreferences } from '@/types/interfaces'
import { needCategoryOptions } from '@/mock/data'

const donorStore = useDonorStore()

// Tipos específicos para formulários
interface ProfileForm {
  name: string
  email: string
  phone: string
  city: string
}

interface PreferencesForm {
  categories: NeedCategory[]
  maxDistance: number
}

interface LoadingStates {
  profile: boolean
  preferences: boolean
  notifications: boolean
  export: boolean
  cache: boolean
  update: boolean
  delete: boolean
}

// Estado reativo com tipagem forte
const profileFormRef: Ref<HTMLFormElement | null> = ref(null)
const profileFormValid = ref<boolean>(false)

const profileForm = reactive<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  city: '',
})

const preferencesForm = reactive<PreferencesForm>({
  categories: [],
  maxDistance: 10,
})

const notificationsForm = reactive<NotificationPreferences>({
  newInstitutions: true,
  urgentNeeds: true,
  donationUpdates: true,
  weeklyReport: false,
})

const loadingStates = reactive<LoadingStates>({
  profile: false,
  preferences: false,
  notifications: false,
  export: false,
  cache: false,
  update: false,
  delete: false,
})

// Dialog states
const showDeleteDialog = ref<boolean>(false)
const deleteConfirmation = ref<string>('')

// Snackbar states
const showSnackbar = ref<boolean>(false)
const snackbarMessage = ref<string>('')
const snackbarColor = ref<string>('info')

// Informações da aplicação
const appInfo = computed(() => ({
  version: '1.0.0',
  lastUpdate: 'Maio 2025',
  environment: import.meta.env.MODE || 'development',
}))

// Regras de validação reutilizáveis seguindo padrão DRY
const validationRules = {
  required: [(v: string) => !!v || 'Campo obrigatório'],
  email: [
    (v: string) => !!v || 'E-mail é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
  ],
  phone: [(v: string) => !v || /^[\d\s\(\)\-\+]+$/.test(v) || 'Formato de telefone inválido'],
}

// Métodos de persistência com error handling robusto
const saveProfile = async (): Promise<void> => {
  if (!profileFormValid.value) {
    showMessage('Preencha todos os campos obrigatórios', 'error')
    return
  }

  loadingStates.profile = true

  try {
    await simulateApiCall(1000)
    donorStore.updateProfile(profileForm)
    showMessage('Perfil atualizado com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    showMessage('Erro ao salvar perfil. Tente novamente.', 'error')
  } finally {
    loadingStates.profile = false
  }
}

const savePreferences = async (): Promise<void> => {
  loadingStates.preferences = true

  try {
    await simulateApiCall(800)
    donorStore.updatePreferences({
      categories: preferencesForm.categories,
      maxDistance: preferencesForm.maxDistance,
    })
    showMessage('Preferências salvas com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao salvar preferências:', error)
    showMessage('Erro ao salvar preferências. Tente novamente.', 'error')
  } finally {
    loadingStates.preferences = false
  }
}

const saveNotifications = async (): Promise<void> => {
  loadingStates.notifications = true

  try {
    await simulateApiCall(600)
    donorStore.updatePreferences({
      notifications: notificationsForm,
    })
    showMessage('Configurações de notificação salvas!', 'success')
  } catch (error) {
    console.error('Erro ao salvar notificações:', error)
    showMessage('Erro ao salvar configurações. Tente novamente.', 'error')
  } finally {
    loadingStates.notifications = false
  }
}

// Ações rápidas com feedback adequado
const exportUserData = async (): Promise<void> => {
  loadingStates.export = true

  try {
    await simulateApiCall(2000)
    showMessage('Dados exportados com sucesso! Verifique sua pasta de downloads.', 'success')
    // TODO: Implementar exportação real
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    showMessage('Erro ao exportar dados.', 'error')
  } finally {
    loadingStates.export = false
  }
}

const clearCache = async (): Promise<void> => {
  loadingStates.cache = true

  try {
    await simulateApiCall(1500)
    showMessage('Cache limpo com sucesso!', 'success')
    // TODO: Implementar limpeza real de cache
  } catch (error) {
    console.error('Erro ao limpar cache:', error)
    showMessage('Erro ao limpar cache.', 'error')
  } finally {
    loadingStates.cache = false
  }
}

const contactSupport = (): void => {
  showMessage('Redirecionando para suporte...', 'info')
  // TODO: Implementar redirecionamento para suporte
}

const checkForUpdates = async (): Promise<void> => {
  loadingStates.update = true

  try {
    await simulateApiCall(3000)
    showMessage('Seu aplicativo está atualizado!', 'success')
  } catch (error) {
    console.error('Erro ao verificar atualizações:', error)
    showMessage('Erro ao verificar atualizações.', 'error')
  } finally {
    loadingStates.update = false
  }
}

// Gerenciamento de exclusão de conta
const confirmDeleteAccount = (): void => {
  showDeleteDialog.value = true
  deleteConfirmation.value = ''
}

const cancelDeleteAccount = (): void => {
  showDeleteDialog.value = false
  deleteConfirmation.value = ''
}

const executeDeleteAccount = async (): Promise<void> => {
  loadingStates.delete = true

  try {
    await simulateApiCall(2000)
    showMessage('Conta excluída com sucesso. Redirecionando...', 'info')
    // TODO: Implementar exclusão real e logout
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  } catch (error) {
    console.error('Erro ao excluir conta:', error)
    showMessage('Erro ao excluir conta. Tente novamente.', 'error')
  } finally {
    loadingStates.delete = false
    showDeleteDialog.value = false
  }
}

// Utility functions
const simulateApiCall = (delay: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

const showMessage = (message: string, color: string = 'info'): void => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const loadUserData = (): void => {
  const donor = donorStore.currentDonor

  if (donor) {
    // Carregar dados do perfil
    Object.assign(profileForm, {
      name: donor.name || '',
      email: donor.email || '',
      phone: donor.phone || '',
      city: donor.location?.city || '',
    })

    // Carregar preferências
    if (donor.preferences) {
      Object.assign(preferencesForm, {
        categories: donor.preferences.categories || [],
        maxDistance: donor.preferences.maxDistance || 10,
      })

      // Carregar configurações de notificação
      if (donor.preferences.notifications) {
        Object.assign(notificationsForm, donor.preferences.notifications)
      }
    }
  }
}

// Lifecycle - carregamento inicial
onMounted(async (): Promise<void> => {
  try {
    await donorStore.init()
    loadUserData()
    showMessage('Configurações carregadas', 'success')
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    showMessage('Erro ao carregar configurações', 'error')
  }
})
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 960px) {
  .settings-page {
    padding: 16px;
  }
}
</style>
