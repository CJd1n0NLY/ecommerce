import { ref, reactive, watch, computed, watchEffect } from 'vue';
import { useAuth } from './useAuth';
import { usePreferences } from './usePreferences';

const isVisible = ref(false);
const activeTab = ref<'login' | 'register'>('login');

const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});
const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  preferences: [] as number[]
});

const { preferences: allPreferences, fetchPreferences } = usePreferences();

fetchPreferences();

const preferenceNames = computed(() => {
  const names: Record<number, string> = {};
  allPreferences.value.forEach(pref => {
    names[pref.preference_id] = pref.preference_name;
  });
  return names;
});

const isPreferencesModalVisible = ref(false);
const errorMessage = ref('');

function confirmPreferences() {
  console.log("Selected preferences:", [...registerForm.preferences]); 
  closePreferencesModal();
}

watch(() => registerForm.preferences, (newVal) => {
  console.log("Preferences updated:", newVal);
}, { deep: true });


const isLoading = ref(false); 

const canLogin = computed(() => {
  return !!loginForm.email && !!loginForm.password && !isLoading.value;
});

const canRegister = computed(() => {
  return (
    registerForm.name.trim() !== '' &&
    registerForm.email.trim() !== '' &&
    registerForm.password !== '' &&
    registerForm.confirmPassword !== '' &&
    registerForm.password === registerForm.confirmPassword &&
    registerForm.preferences.length > 0 &&
    !isLoading.value
  );
});


function open(tab: 'login' | 'register' = 'login') {
  activeTab.value = tab;
  isVisible.value = true;
  errorMessage.value = '';
}

function close() {
  isVisible.value = false;
  loginForm.email = '';
  loginForm.password = '';
  registerForm.name = '';
  registerForm.email = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';
  registerForm.preferences = [];
  errorMessage.value = '';
}

function openPreferencesModal() {
  isPreferencesModalVisible.value = true;
  console.log("Current preferences when opening modal:", [...registerForm.preferences]);
}

watch(() => registerForm.preferences, (newVal) => {
  console.log("Preferences updated (watch):", [...newVal]);
}, { deep: true });

function closePreferencesModal() {
  isPreferencesModalVisible.value = false;
}

async function handleLogin() {
  const auth = useAuth();
  errorMessage.value = '';

  try {
    console.log("Attempting login...");
    isLoading.value = true;
    await auth.login(loginForm.email, loginForm.password); 
    console.log("Login successful!");
    close(); 
    return true;
  } catch (err) {
    console.error("Login failed:", err);
    errorMessage.value = err instanceof Error ? err.message : 'Login failed';
    return false;
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  const auth = useAuth();
  errorMessage.value = '';

  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return false;
  }

  if (registerForm.preferences.length === 0) {
    errorMessage.value = 'Please select at least one preference';
    return false;
  }

  try {
    await auth.register({
      email: registerForm.email,
      password: registerForm.password,
      user_name: registerForm.name,
      preferences: registerForm.preferences
    });

    // Switch to login tab
    activeTab.value = 'login';

    registerForm.name = '';
    registerForm.email = '';
    registerForm.password = '';
    registerForm.confirmPassword = '';
    registerForm.preferences = [];

    return true;
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Registration failed';
    return false;
  } finally {
    isLoading.value = false;
  }
}

function onSocialLogin() {
  errorMessage.value = 'Social login is not implemented yet.';
}

export function useAuthModal() {
  return {
    isVisible,
    activeTab,
    loginForm,
    registerForm,
    errorMessage,
    preferenceNames,
    isPreferencesModalVisible,  
    open,
    close,
    openPreferencesModal,
    closePreferencesModal,
    confirmPreferences,
    handleLogin,
    handleRegister,
    onSocialLogin,
    isLoading,
    canLogin,
    canRegister,
    allPreferences,
  };
}
