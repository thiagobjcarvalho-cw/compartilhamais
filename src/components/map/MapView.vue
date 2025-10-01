<template>
  <div class="map-wrapper">
    <l-map
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      class="leaflet-map"
      @ready="onMapReady"
    >
      <l-tile-layer :url="tileLayerUrl" :attribution="attribution" />

      <!-- Marcadores das instituições -->
      <l-marker
        v-for="institution in institutions"
        :key="institution.id"
        :lat-lng="[institution.location.latitude, institution.location.longitude]"
        @click="selectInstitution(institution)"
      >
        <l-icon
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
          :class-name="`custom-marker marker-${getMarkerColor(institution.type)}`"
        >
          <div class="marker-content">
            <v-icon :color="getMarkerColor(institution.type)" size="20">
              {{ getMarkerIcon(institution.type) }}
            </v-icon>
          </div>
        </l-icon>

        <l-popup>
          <div class="popup-content">
            <h4 class="popup-title">{{ institution.name }}</h4>
            <p class="popup-description">{{ institution.description }}</p>
            <div class="popup-actions">
              <v-btn
                size="small"
                color="primary"
                variant="flat"
                @click="selectInstitution(institution)"
              >
                <v-icon start size="16">mdi-eye</v-icon>
                Ver Detalhes
              </v-btn>
            </div>
          </div>
        </l-popup>
      </l-marker>
    </l-map>

    <!-- Loading overlay -->
    <div v-if="loading" class="map-loading">
      <v-progress-circular indeterminate color="primary" size="48" />
      <span class="ml-3 text-body-1">Carregando mapa...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type Ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Institution } from '@/types/interfaces'
import { InstitutionType } from '@/types/interfaces'

// Props tipadas com interface específica
interface Props {
  institutions: Institution[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// Emits tipados
const emit = defineEmits<{
  'institution-selected': [institution: Institution]
}>()

// Estado reativo com tipagem forte
const mapRef: Ref<typeof LMap | null> = ref(null)
const zoom = ref<number>(12)
const center = ref<[number, number]>([-23.5505, -46.6333]) // São Paulo

// Configurações do mapa seguindo padrão enterprise
const mapOptions = {
  zoomControl: true,
  attributionControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true,
  dragging: true,
  touchZoom: true,
  preferCanvas: true, // Performance optimization
} as const

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Helper functions seguindo padrão DRY
const getMarkerColor = (type: InstitutionType): string => {
  const colorMap: Record<InstitutionType, string> = {
    [InstitutionType.SHELTER]: 'primary',
    [InstitutionType.EDUCATION]: 'success',
    [InstitutionType.HEALTH]: 'error',
    [InstitutionType.ELDERLY]: 'purple',
    [InstitutionType.ANIMALS]: 'orange',
    [InstitutionType.ENVIRONMENT]: 'teal',
  }
  return colorMap[type] || 'grey'
}

const getMarkerIcon = (type: InstitutionType): string => {
  const iconMap: Record<InstitutionType, string> = {
    [InstitutionType.SHELTER]: 'mdi-home-heart',
    [InstitutionType.EDUCATION]: 'mdi-school',
    [InstitutionType.HEALTH]: 'mdi-hospital-box',
    [InstitutionType.ELDERLY]: 'mdi-account-supervisor',
    [InstitutionType.ANIMALS]: 'mdi-paw',
    [InstitutionType.ENVIRONMENT]: 'mdi-leaf',
  }
  return iconMap[type] || 'mdi-map-marker'
}

// Métodos com tipagem forte e error handling
const onMapReady = async (): Promise<void> => {
  try {
    console.log('Mapa inicializado com sucesso')

    // Aguardar próximo tick para garantir que o DOM está pronto
    await nextTick()

    // Ajustar bounds se existem instituições
    if (props.institutions.length > 0) {
      await fitBounds()
    }
  } catch (error) {
    console.error('Erro na inicialização do mapa:', error)
  }
}

const fitBounds = async (): Promise<void> => {
  try {
    if (!mapRef.value?.leafletObject || props.institutions.length === 0) {
      return
    }

    const bounds = props.institutions.map((institution): [number, number] => [
      institution.location.latitude,
      institution.location.longitude,
    ])

    // Aplicar bounds com padding para melhor visualização
    mapRef.value.leafletObject.fitBounds(bounds, {
      padding: [20, 20],
      maxZoom: 15, // Limitar zoom máximo para evitar zoom excessivo
    })
  } catch (error) {
    console.error('Erro ao ajustar bounds do mapa:', error)
  }
}

const selectInstitution = (institution: Institution): void => {
  emit('institution-selected', institution)
}

// Watchers para reatividade
watch(
  () => props.institutions,
  async (newInstitutions) => {
    if (newInstitutions.length > 0) {
      // Aguardar próximo tick para garantir que os marcadores foram renderizados
      await nextTick()
      await fitBounds()
    }
  },
  { deep: true },
)

// Lifecycle - Configuração crítica do Leaflet
onMounted((): void => {
  try {
    // ✅ CORREÇÃO CRÍTICA: Configurar ícones padrão do Leaflet
    // Esta configuração resolve o erro "Cannot read properties of undefined (reading 'Default')"

    // Interface específica para tipagem de propriedades privadas do Leaflet
    interface LeafletIconDefault extends L.Icon.Default {
      _getIconUrl?: () => string
    }

    // Remoção tipada da propriedade privada
    delete (L.Icon.Default.prototype as LeafletIconDefault)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    console.log('Leaflet configurado com sucesso')
  } catch (error) {
    console.error('Erro na configuração do Leaflet:', error)
  }
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 1;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.marker-content {
  background: white;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid currentColor;
}

.popup-content {
  text-align: center;
  min-width: 220px;
  padding: 8px;
}

.popup-title {
  margin-bottom: 8px;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.popup-description {
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.popup-actions {
  margin-top: 12px;
}

/* Customizações dos marcadores por tipo */
:deep(.custom-marker.marker-primary .marker-content) {
  border-color: rgb(var(--v-theme-primary));
}

:deep(.custom-marker.marker-success .marker-content) {
  border-color: rgb(var(--v-theme-success));
}

:deep(.custom-marker.marker-error .marker-content) {
  border-color: rgb(var(--v-theme-error));
}

/* Responsividade */
@media (max-width: 768px) {
  .map-wrapper {
    min-height: 300px;
  }

  .popup-content {
    min-width: 180px;
  }

  .map-loading {
    padding: 1rem 1.5rem;
  }
}
</style>
