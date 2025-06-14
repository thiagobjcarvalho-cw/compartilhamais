<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white pa-4">
        <v-icon class="mr-2">mdi-heart</v-icon>
        Fazer Doação
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- Informações da Instituição -->
        <div v-if="institution" class="mb-4">
          <h3 class="text-h6 mb-2">{{ institution.name }}</h3>
          <p class="text-body-2 text-medium-emphasis">{{ institution.description }}</p>

          <div v-if="institution.location" class="d-flex align-center mt-2">
            <v-icon size="16" class="mr-1" color="primary">mdi-map-marker</v-icon>
            <span class="text-body-2">
              {{ institution.location.city }}, {{ institution.location.state }}
            </span>
          </div>
        </div>

        <!-- Necessidade Específica Selecionada -->
        <div v-if="selectedNeed" class="mb-4">
          <v-alert color="primary" variant="tonal" class="mb-3">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2" size="20">mdi-alert-circle</v-icon>
              <span class="font-weight-medium">{{ selectedNeed.title }}</span>
              <v-spacer />
              <v-chip size="small" :color="getUrgencyColor(selectedNeed.urgency)" variant="flat">
                {{ getUrgencyLabel(selectedNeed.urgency) }}
              </v-chip>
            </div>
            <div class="text-body-2">{{ selectedNeed.description }}</div>
            <div v-if="selectedNeed.quantity" class="text-body-2 mt-1">
              <strong>Quantidade necessária:</strong> {{ selectedNeed.quantity }}
            </div>
          </v-alert>
        </div>

        <!-- Formulário de Doação -->
        <v-form ref="formRef" v-model="formValid">
          <v-textarea
            v-model="donationForm.description"
            label="Descrição da doação"
            placeholder="Descreva detalhadamente o que você pretende doar..."
            rows="3"
            variant="outlined"
            class="mb-3"
            :rules="validationRules.description"
            required
          />

          <v-text-field
            v-model="donationForm.quantity"
            label="Quantidade"
            placeholder="Ex: 10kg, 5 unidades, 2 caixas, etc."
            variant="outlined"
            class="mb-3"
            :rules="validationRules.quantity"
          />

          <v-select
            v-model="donationForm.contactPreference"
            label="Como prefere ser contatado?"
            :items="contactOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            class="mb-3"
            :rules="validationRules.contactPreference"
            required
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-icon>{{ item.raw.icon }}</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model="donationForm.scheduledDate"
            label="Data preferencial para entrega (opcional)"
            type="date"
            variant="outlined"
            class="mb-3"
            :min="minDate"
          />

          <v-textarea
            v-model="donationForm.message"
            label="Mensagem adicional (opcional)"
            placeholder="Alguma observação especial ou mensagem para a instituição..."
            rows="2"
            variant="outlined"
            class="mb-3"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel" :disabled="loading"> Cancelar </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleConfirm"
          class="ml-2"
          :disabled="!formValid"
          :loading="loading"
        >
          <v-icon start>mdi-heart</v-icon>
          Confirmar Doação
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, type Ref } from 'vue'
import type { Institution, Need, UrgencyLevel } from '@/types/interfaces'
import { UrgencyLevel as UrgencyLevelEnum } from '@/types/interfaces'

// Interface específica para o formulário de doação
interface DonationFormData {
  institutionId: string
  needId?: string
  description: string
  quantity?: string
  contactPreference: string
  scheduledDate?: string
  message?: string
}

// Props tipadas seguindo padrão estabelecido
interface Props {
  modelValue: boolean
  institution?: Institution | null
  selectedNeed?: Need | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  institution: null,
  selectedNeed: null,
})

// Emits tipados com interface específica
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'donation-completed': [data: DonationFormData]
}>()

// Estado reativo com tipagem forte
const formRef: Ref<HTMLFormElement | null> = ref(null)
const formValid = ref<boolean>(false)
const loading = ref<boolean>(false)

// Formulário reativo tipado
const donationForm = reactive<Omit<DonationFormData, 'institutionId' | 'needId'>>({
  description: '',
  quantity: '',
  contactPreference: '',
  scheduledDate: '',
  message: '',
})

// Opções de contato seguindo padrão DRY
const contactOptions = [
  {
    title: 'WhatsApp',
    value: 'whatsapp',
    icon: 'mdi-whatsapp',
  },
  {
    title: 'Telefone',
    value: 'phone',
    icon: 'mdi-phone',
  },
  {
    title: 'E-mail',
    value: 'email',
    icon: 'mdi-email',
  },
  {
    title: 'Chat do app',
    value: 'chat',
    icon: 'mdi-chat',
  },
] as const

// Regras de validação reutilizáveis
const validationRules = {
  description: [
    (v: string) => !!v || 'Descrição da doação é obrigatória',
    (v: string) => v.length >= 10 || 'Descrição deve ter pelo menos 10 caracteres',
  ],
  quantity: [(v: string) => !v || v.length >= 2 || 'Se informado, quantidade deve ser específica'],
  contactPreference: [(v: string) => !!v || 'Forma de contato é obrigatória'],
}

// Computed properties
const minDate = computed<string>(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Helper functions seguindo padrão estabelecido
const getUrgencyColor = (urgency: UrgencyLevel): string => {
  const colorMap: Record<UrgencyLevel, string> = {
    [UrgencyLevelEnum.LOW]: 'success',
    [UrgencyLevelEnum.MEDIUM]: 'warning',
    [UrgencyLevelEnum.HIGH]: 'error',
    [UrgencyLevelEnum.CRITICAL]: 'error',
  }
  return colorMap[urgency] || 'grey'
}

const getUrgencyLabel = (urgency: UrgencyLevel): string => {
  const labelMap: Record<UrgencyLevel, string> = {
    [UrgencyLevelEnum.LOW]: 'Baixa',
    [UrgencyLevelEnum.MEDIUM]: 'Média',
    [UrgencyLevelEnum.HIGH]: 'Alta',
    [UrgencyLevelEnum.CRITICAL]: 'Crítica',
  }
  return labelMap[urgency] || urgency
}

// Métodos com tipagem forte e error handling
const handleConfirm = async (): Promise<void> => {
  if (!props.institution || !formValid.value) {
    return
  }

  loading.value = true

  try {
    // Simular processamento da doação
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const donationData: DonationFormData = {
      institutionId: props.institution.id,
      needId: props.selectedNeed?.id,
      description: donationForm.description.trim(),
      quantity: donationForm.quantity?.trim() || undefined,
      contactPreference: donationForm.contactPreference,
      scheduledDate: donationForm.scheduledDate || undefined,
      message: donationForm.message?.trim() || undefined,
    }

    emit('donation-completed', donationData)
    resetForm()
  } catch (error) {
    console.error('Erro ao processar doação:', error)
    // TODO: Implementar tratamento de erro com feedback visual
  } finally {
    loading.value = false
  }
}

const handleCancel = (): void => {
  resetForm()
  emit('update:modelValue', false)
}

const resetForm = (): void => {
  Object.assign(donationForm, {
    description: '',
    quantity: '',
    contactPreference: '',
    scheduledDate: '',
    message: '',
  })

  formRef.value?.resetValidation()
}

// Watchers para reatividade
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      // Resetar formulário quando dialog fechar
      setTimeout(resetForm, 300) // Aguardar animação de fechamento
    }
  },
)

watch(
  () => props.selectedNeed,
  (newNeed) => {
    if (newNeed) {
      // Pré-preencher descrição baseada na necessidade selecionada
      donationForm.description = `Doação para: ${newNeed.title}`
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Estilos específicos mantendo padrão Vuetify */
:deep(.v-card-title) {
  font-weight: 600;
}

:deep(.v-alert) {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

/* Animação de loading no botão */
:deep(.v-btn--loading) {
  pointer-events: none;
}

/* Responsividade */
@media (max-width: 600px) {
  :deep(.v-dialog) {
    margin: 16px;
  }

  :deep(.v-card) {
    border-radius: 12px;
  }
}
</style>
