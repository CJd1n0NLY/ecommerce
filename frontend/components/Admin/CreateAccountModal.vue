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
              Create a new Account
            </h2>
            <button @click="close" class="text-gray-400 hover:text-white text-lg cursor-pointer">✕</button>
          </div>
  
          <!-- Error message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-white rounded">
            {{ errorMessage }}
          </div>
  
          <div>
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
              :disabled="registerForm.preferences.length >= 3 && !registerForm.preferences.includes(pref.preference_id)"
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
  import { useCreateAccountModal } from '../composables/useCreateAccountModal';
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
    handleRegister,
    onSocialLogin,
    canLogin,
    canRegister,
    allPreferences
  } = useCreateAccountModal();
  
  const isLoading = computed(() => auth.isLoading);
  
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

  :global(.ant-checkbox-disabled+span){
    color: #4a5568 !important;
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