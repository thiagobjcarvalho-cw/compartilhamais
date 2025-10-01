<template>
  <div class="login-page">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Lado Esquerdo - Formulário -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="10" md="8">
                <!-- Logo e Título -->
                <div class="text-center mb-8">
                  <v-icon size="64" color="primary" class="mb-4">mdi-hand-heart</v-icon>
                  <h1 class="text-h4 font-weight-bold mb-2">Bem-vindo de volta!</h1>
                  <p class="text-body-1 text-medium-emphasis">
                    Entre para continuar ajudando quem precisa
                  </p>
                </div>

                <!-- Tabs Login/Registro -->
                <v-tabs v-model="tab" align-tabs="center" class="mb-6">
                  <v-tab value="login">Entrar</v-tab>
                  <v-tab value="register">Criar Conta</v-tab>
                </v-tabs>

                <v-window v-model="tab">
                  <!-- Tab Login -->
                  <v-window-item value="login">
                    <v-form ref="loginForm" v-model="loginValid" @submit.prevent="handleLogin">
                      <!-- Escolha entre Email ou CPF -->
                      <v-btn-toggle
                        v-model="loginType"
                        mandatory
                        rounded="lg"
                        color="primary"
                        class="mb-4 w-100"
                        density="comfortable"
                      >
                        <v-btn value="email" class="flex-grow-1">
                          <v-icon start>mdi-email</v-icon>
                          Email
                        </v-btn>
                        <v-btn value="cpf" class="flex-grow-1">
                          <v-icon start>mdi-card-account-details</v-icon>
                          CPF
                        </v-btn>
                      </v-btn-toggle>

                      <!-- Campo Email/CPF -->
                      <v-text-field
                        v-if="loginType === 'email'"
                        v-model="loginData.email"
                        label="Email"
                        type="email"
                        prepend-inner-icon="mdi-email"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required, rules.email]"
                        class="mb-3"
                      />

                      <v-text-field
                        v-else
                        v-model="loginData.cpf"
                        label="CPF"
                        placeholder="000.000.000-00"
                        prepend-inner-icon="mdi-card-account-details"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required, rules.cpf]"
                        class="mb-3"
                      />

                      <!-- Senha -->
                      <v-text-field
                        v-model="loginData.password"
                        label="Senha"
                        :type="showPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required]"
                        class="mb-2"
                      />

                      <!-- Lembrar e Esqueci Senha -->
                      <div class="d-flex justify-space-between align-center mb-6">
                        <v-checkbox
                          v-model="rememberMe"
                          label="Lembrar de mim"
                          hide-details
                          color="primary"
                        />
                        <v-btn
                          variant="text"
                          color="primary"
                          size="small"
                          @click="forgotPasswordDialog = true"
                        >
                          Esqueci a senha
                        </v-btn>
                      </div>

                      <!-- Botão Login -->
                      <v-btn
                        type="submit"
                        block
                        size="large"
                        color="primary"
                        rounded="lg"
                        :loading="authStore.isLoading"
                        :disabled="!loginValid"
                      >
                        Entrar
                      </v-btn>
                    </v-form>
                  </v-window-item>

                  <!-- Tab Registro -->
                  <v-window-item value="register">
                    <v-form ref="registerForm" v-model="registerValid" @submit.prevent="handleRegister">
                      <!-- Tipo de Conta -->
                      <v-radio-group
                        v-model="registerData.role"
                        inline
                        class="mb-4"
                      >
                        <template #label>
                          <span class="text-body-2 text-medium-emphasis">Tipo de conta:</span>
                        </template>
                        <v-radio label="Doador" value="donor" color="primary" />
                        <v-radio label="Instituição" value="institution" color="primary" />
                      </v-radio-group>

                      <!-- Nome -->
                      <v-text-field
                        v-model="registerData.name"
                        :label="registerData.role === 'institution' ? 'Nome da Instituição' : 'Nome Completo'"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required]"
                        class="mb-3"
                      />

                      <!-- Email -->
                      <v-text-field
                        v-model="registerData.email"
                        label="Email"
                        type="email"
                        prepend-inner-icon="mdi-email"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required, rules.email]"
                        class="mb-3"
                      />

                      <!-- CPF (apenas para doador) -->
                      <v-text-field
                        v-if="registerData.role === 'donor'"
                        v-model="registerData.cpf"
                        label="CPF (opcional)"
                        placeholder="000.000.000-00"
                        prepend-inner-icon="mdi-card-account-details"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.cpfOptional]"
                        class="mb-3"
                      />

                      <!-- Telefone -->
                      <v-text-field
                        v-model="registerData.phone"
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        prepend-inner-icon="mdi-phone"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required]"
                        class="mb-3"
                      />

                      <!-- Senha -->
                      <v-text-field
                        v-model="registerData.password"
                        label="Senha"
                        :type="showPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required, rules.password]"
                        class="mb-3"
                      />

                      <!-- Confirmar Senha -->
                      <v-text-field
                        v-model="registerData.confirmPassword"
                        label="Confirmar Senha"
                        :type="showPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-check"
                        variant="outlined"
                        rounded="lg"
                        :rules="[rules.required, rules.passwordMatch]"
                        class="mb-3"
                      />

                      <!-- Termos -->
                      <v-checkbox
                        v-model="registerData.acceptTerms"
                        :rules="[rules.required]"
                        color="primary"
                        class="mb-4"
                      >
                        <template #label>
                          <span class="text-body-2">
                            Li e aceito os
                            <a href="#" class="text-primary">Termos de Uso</a> e a
                            <a href="#" class="text-primary">Política de Privacidade</a>
                          </span>
                        </template>
                      </v-checkbox>

                      <!-- Botão Registro -->
                      <v-btn
                        type="submit"
                        block
                        size="large"
                        color="primary"
                        rounded="lg"
                        :loading="authStore.isLoading"
                        :disabled="!registerValid"
                      >
                        Criar Conta
                      </v-btn>
                    </v-form>
                  </v-window-item>
                </v-window>

                <!-- Divider -->
                <div class="d-flex align-center my-6">
                  <v-divider />
                  <span class="mx-4 text-caption text-medium-emphasis">OU</span>
                  <v-divider />
                </div>

                <!-- Social Login -->
                <div class="social-buttons">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                    @click="handleSocialLogin('google')"
                  >
                    <v-icon start color="red">mdi-google</v-icon>
                    Continuar com Google
                  </v-btn>

                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                    @click="handleSocialLogin('facebook')"
                  >
                    <v-icon start color="blue">mdi-facebook</v-icon>
                    Continuar com Facebook
                  </v-btn>

                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    rounded="lg"
                    @click="handleSocialLogin('apple')"
                  >
                    <v-icon start>mdi-apple</v-icon>
                    Continuar com Apple
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>

        <!-- Lado Direito - Imagem/Info -->
        <v-col cols="12" md="6" class="d-none d-md-flex login-hero">
          <div class="hero-overlay">
            <v-container class="fill-height">
              <v-row align="center" justify="center">
                <v-col cols="10">
                  <h2 class="text-h3 font-weight-bold mb-4 text-white">
                    Transforme vidas com sua generosidade
                  </h2>
                  <p class="text-h6 text-white mb-6">
                    Conecte-se com instituições que precisam de ajuda e faça a diferença na vida de milhares de pessoas.
                  </p>
                  
                  <!-- Stats -->
                  <v-row>
                    <v-col cols="4">
                      <div class="stat-item">
                        <h3 class="text-h4 font-weight-bold text-white">2.5k+</h3>
                        <p class="text-body-2 text-white">Doações Realizadas</p>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div class="stat-item">
                        <h3 class="text-h4 font-weight-bold text-white">8+</h3>
                        <p class="text-body-2 text-white">Instituições</p>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div class="stat-item">
                        <h3 class="text-h4 font-weight-bold text-white">10k+</h3>
                        <p class="text-body-2 text-white">Pessoas Ajudadas</p>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog Esqueci Senha -->
    <v-dialog v-model="forgotPasswordDialog" max-width="500">
      <v-card rounded="lg">
        <v-card-title class="text-h5">
          Recuperar Senha
        </v-card-title>
        <v-card-text>
          <p class="mb-4">
            Digite seu email para receber as instruções de recuperação de senha.
          </p>
          <v-text-field
            v-model="forgotEmail"
            label="Email"
            type="email"
            variant="outlined"
            rounded="lg"
            :rules="[rules.required, rules.email]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="forgotPasswordDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" variant="flat" @click="handleForgotPassword">
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      rounded="lg"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AuthProvider, UserRole } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const tab = ref('login')
const loginType = ref<'email' | 'cpf'>('email')
const showPassword = ref(false)
const rememberMe = ref(false)
const forgotPasswordDialog = ref(false)
const forgotEmail = ref('')

const loginValid = ref(false)
const registerValid = ref(false)

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

// Form Data
const loginData = reactive({
  email: '',
  cpf: '',
  password: '',
})

const registerData = reactive({
  name: '',
  email: '',
  cpf: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'donor' as UserRole,
  acceptTerms: false,
})

// Validation Rules
const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Email inválido'
  },
  cpf: (v: string) => {
    const cpf = v.replace(/\D/g, '')
    return cpf.length === 11 || 'CPF inválido'
  },
  cpfOptional: (v: string) => {
    if (!v) return true
    const cpf = v.replace(/\D/g, '')
    return cpf.length === 11 || 'CPF inválido'
  },
  password: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
  passwordMatch: (v: string) => v === registerData.password || 'Senhas não coincidem',
}

// Methods
const handleLogin = async () => {
  const credentials = loginType.value === 'email'
    ? { email: loginData.email, password: loginData.password }
    : { cpf: loginData.cpf, password: loginData.password }

  const success = await authStore.login(credentials)
  
  if (success) {
    snackbar.message = 'Login realizado com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
    
    // Redireciona para a página anterior ou home
    const redirect = route.query.redirect as string || '/'
    setTimeout(() => router.push(redirect), 1000)
  } else {
    snackbar.message = authStore.error || 'Erro ao fazer login'
    snackbar.color = 'error'
    snackbar.show = true
  }
}

const handleRegister = async () => {
  const success = await authStore.register(registerData)
  
  if (success) {
    snackbar.message = 'Conta criada com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
    
    // Redireciona após registro
    setTimeout(() => router.push('/'), 1000)
  } else {
    snackbar.message = authStore.error || 'Erro ao criar conta'
    snackbar.color = 'error'
    snackbar.show = true
  }
}

const handleSocialLogin = async (provider: AuthProvider) => {
  const success = await authStore.socialLogin(provider)
  
  if (success) {
    snackbar.message = `Login com ${provider} realizado com sucesso!`
    snackbar.color = 'success'
    snackbar.show = true
    
    const redirect = route.query.redirect as string || '/'
    setTimeout(() => router.push(redirect), 1000)
  } else {
    snackbar.message = authStore.error || `Erro ao fazer login com ${provider}`
    snackbar.color = 'error'
    snackbar.show = true
  }
}

const handleForgotPassword = async () => {
  const success = await authStore.resetPassword(forgotEmail.value)
  
  if (success) {
    snackbar.message = 'Email de recuperação enviado!'
    snackbar.color = 'success'
    snackbar.show = true
    forgotPasswordDialog.value = false
  } else {
    snackbar.message = 'Erro ao enviar email de recuperação'
    snackbar.color = 'error'
    snackbar.show = true
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.login-hero {
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B6B 100%);
  background-image: url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.9) 0%, rgba(255, 107, 107, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.social-buttons :deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>