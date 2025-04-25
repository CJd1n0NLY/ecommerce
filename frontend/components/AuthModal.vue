<template>
  <div>
    <a-modal
      :open="isVisible"
      centered
      :footer="null"
      :width="450"
      :closable="false"
      class="auth-modal"
    >
      <div class="bg-zinc-900 p-8 rounded-lg shadow-xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-white">
            {{ activeTab === 'login' ? 'Login to Your Account' : 'Create an Account' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-white rounded">
          {{ errorMessage }}
        </div>

        <!-- Tabs -->
        <div class="flex mb-6 border-b border-zinc-700">
          <button
            class="flex-1 py-2 text-center transition-colors cursor-pointer"
            :class="[activeTab === 'login' ? 'text-white border-b-2 border-b-red-600' : 'text-gray-400 hover:text-white cursor-pointer']"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button
            class="flex-1 py-2 text-center transition-colors cursor-pointer"
            :class="[activeTab === 'register' ? 'text-white border-b-2 border-b-red-600' : 'text-gray-400 hover:text-white cursor-pointer']"
            @click="activeTab = 'register'"
          >
            Register
          </button>
        </div>

        <div v-if="activeTab === 'login'">
          <form @submit.prevent="handleSuccessfulLogin">
            <div class="mb-4">
              <input
                v-model="loginForm.email"
                type="text"
                placeholder="Email"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <div class="mb-4">
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="Password"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <div class="flex justify-between items-center mb-3">
              <a-checkbox v-model="loginForm.remember" class="text-gray-700 dark:text-gray-300">Remember me</a-checkbox>
              <a class="text-blue-600 text-sm hover:underline cursor-pointer dark:text-blue-400">Forgot Password?</a>
            </div>

            <button
              type="submit"
              :disabled="!canLogin"
              class="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              <span>Login</span>
            </button>

          </form>

          <div class="relative my-4 flex items-center">
            <div class="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
            <span class="mx-2 text-gray-700 text-sm dark:text-gray-300">OR</span>
            <div class="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
          </div>

          <div class="flex flex-col gap-3">
            <a-button
              class="w-full flex items-center justify-center gap-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition-all"
              @click="onSocialLogin"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                class="h-5 w-5"
              />
              Continue with Google
            </a-button>

            <a-button
              class="w-full flex items-center justify-center gap-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              @click="onSocialLogin"
            >
              <img
                src="https://www.svgrepo.com/show/3885/facebook.svg"
                alt="Facebook"
                class="h-5 w-5"
              />
              Continue with Facebook
            </a-button>
          </div>
        </div>

        <div v-else>
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <input
                v-model="registerForm.name"
                type="text"
                placeholder="Full Name"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div class="mb-4">
              <input
                v-model="registerForm.email"
                type="email"
                placeholder="Email"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div class="mb-4">
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="Password"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div class="mb-6">
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                class="w-full p-3 text-white bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>

            <!-- Preferences Button -->
            <div class="mb-4">
              <button
                type="button"
                @click="openPreferencesModal"
                class="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                Select Your Preferences <span class="text-red-600">(required)</span>
              </button>
            </div>

            <!-- Show selected preferences -->
            <div v-if="registerForm.preferences.length > 0" class="mb-4">
              <p class="text-gray-400">Selected Preferences: 
                {{ registerForm.preferences.map(id => preferenceNames[id]).join(', ') }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="!canRegister"
              class="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              <span>Register</span>
            </button>
          </form>
        </div>
      </div>
    </a-modal>

    <a-modal
      :open="isPreferencesModalVisible"
      title="What are your watch preferences?"
      @ok="confirmPreferences"
      @cancel="closePreferencesModal"
      centered
      :width="400"
      class="preferences-modal"
    >
      <div class="preferences-container">
        <a-checkbox-group 
          :value="registerForm.preferences"
          @change="(values) => registerForm.preferences = values"
        >
        <div class="flex flex-col gap-2">
          <a-checkbox 
            v-for="pref in allPreferences" 
            :key="pref.preference_id" 
            :value="pref.preference_id"
          >
            {{ pref.preference_name }}
          </a-checkbox>
        </div>
        </a-checkbox-group>
      </div>
    </a-modal>
    <div v-if="isPreferencesModalVisible" class="modal-overlay"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthModal } from '../composables/useAuthModal';
import { useAuth } from '../composables/useAuth';

const router = useRouter(); // Make sure router is properly initialized
const auth = useAuth();
const { 
  isVisible, 
  activeTab, 
  loginForm,
  registerForm,
  preferences,
  preferenceNames,
  isPreferencesModalVisible,
  errorMessage,
  close,
  openPreferencesModal,
  closePreferencesModal,
  confirmPreferences,
  handleLogin,
  handleRegister,
  onSocialLogin,
  canLogin,
  canRegister,
  allPreferences
} = useAuthModal();

const isLoading = computed(() => auth.isLoading);

async function handleSuccessfulLogin() {
  const success = await handleLogin();
  if (success) {
    router.push('/user-dashboard'); // Redirect here after successful login
  }
}

onMounted(() => {
  if (auth.isAuthenticated()) {
    close();
  }
});
</script>

<style scoped>

:global(.ant-modal .ant-modal-content) {
  background-color: #1a202c !important;
  color: #fff !important;
}

:global(.ant-modal .ant-modal-content .ant-checkbox-wrapper) {
  background-color: #1a202c !important;
  color: #fff !important;
}

:global(.ant-modal .ant-modal-header) {
  background-color: #2d3748 !important;
  color: #fff !important;
}

:global(.ant-modal .ant-modal-content .ant-modal-title) {
  background-color: #1a202c !important;
  color: #fff !important;
}

:global(.ant-modal .ant-modal-body) {
  background-color: transparent !important;
}

:global(.ant-modal .ant-checkbox-checked .ant-checkbox-inner) {
  border-color: #fff !important;
  background-color: #f87171 !important;
}

:global(.ant-modal .ant-checkbox-checked .ant-checkbox-inner::after) {
  border-color: #fff !important;
  background-color: #f87171 !important;
}

:global(.ant-modal .ant-checkbox-inner) {
  border-color: #4a5568 !important;
}

:global(.ant-modal .ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #f87171 !important;
}

:global(.ant-modal-close-x) {
  color: #ef4444 !important;
}

:global(.ant-tabs-tab) {
  color: #f87171 !important;
}

:global(.ant-tabs-tab-active) {
  color: #fff !important;
  border-bottom: 2px solid #f87171 !important; 
}

:global(.ant-btn-primary) {
  background-color: #ef4444 !important;
  border-color: #ef4444 !important;
}

:global(.ant-btn-primary:hover) {
  background-color: #f87171 !important;
  border-color: #f87171 !important;
}

:global(.ant-btn-default) {
  border-color: transparent !important;
}

:global(.ant-btn-default:hover) {
  background-color: #c2bdbd !important;
  border-color: transparent !important;
  color: #fff !important;
}

:global(.ant-btn) {
  display: flex !important;
  text-align: center;
}

:global(.ant-btn img) {
  margin-right: 8px; 
}

:global(.ant-btn:hover) {
  background-color: #ef4444;
}

:global(.preferences-modal .ant-btn) {
  display: inline-block !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); 
  filter: blur(15px); 
  z-index: 1000; 
  transition: opacity 0.3s ease-in-out;
}
</style>