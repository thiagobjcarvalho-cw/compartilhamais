<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-secondary text-white pa-4">
        <v-icon class="mr-2">mdi-plus-circle</v-icon>
        Cadastrar Instituição
      </v-card-title>

      <v-card-text class="pa-6 text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-home-heart</v-icon>

        <h3 class="text-h6 mb-2">Em breve</h3>

        <p class="text-body-2 text-grey mb-4">
          Formulário para cadastro de novas instituições será implementado em breve.
        </p>

        <v-alert color="info" variant="tonal" class="text-left">
          <div class="d-flex align-start">
            <v-icon class="mr-2 mt-1">mdi-information</v-icon>
            <div>
              <div class="font-weight-medium mb-1">Para cadastrar sua instituição:</div>
              <div class="text-body-2">
                Entre em contato conosco através do email:
                <span class="font-weight-medium">cadastro@compartilhamais.org</span>
              </div>
            </div>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)"> Fechar </v-btn>
        <v-btn color="secondary" variant="flat" @click="handleConfirm" disabled class="ml-2">
          <v-icon start>mdi-send</v-icon>
          Enviar Solicitação
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [data: Record<string, unknown>]
}>()

const handleConfirm = () => {
  const institutionData: Record<string, unknown> = {
    // Dados da instituição serão implementados
  }
  emit('confirm', institutionData)
}
</script>
