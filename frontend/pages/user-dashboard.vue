<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 p-8 bg-black min-h-screen">
    <SideBarFilters
      :characteristics="characteristics"
      :categories="categories"
      :selected-characteristics="selectedCharacteristics"
      @logout="logout"
      @filter-category="filterCategory"
      @update:selectedCharacteristics="selectedCharacteristics = $event"
    />

    <div class="col-span-1 lg:col-span-4 p-6 bg-gray-900 rounded-lg">
      <WelcomeBanner @logout="logout" />

      <SearchBar v-model="searchQuery" />

      <ProductGrid 
        :products="filteredProducts" 
        @add="addToCart" 
        @buy-now="handleBuyNow" 
      />
      <div class="mt-6 mb-6">
        <button
          class="w-auto p-4 py-3 bg-blue-600 text-white font-semibold rounded-lg relative overflow-hidden group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="totalItems === 0"
          @click="isCheckoutModalOpen = true"
        >
          <span class="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-blue-600 to-blue-400 group-hover:left-0 transition-all duration-300 ease-in-out"></span>
          <span class="relative z-10"><i class="fas fa-credit-card"></i> Proceed to Checkout</span>
        </button>
      </div>

      <button
        class="w-auto p-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none cursor-pointer flex items-center gap-2"
        @click="toggleCartModal"
      >
        <i class="fas fa-shopping-cart"></i> View Cart ({{ totalItems }})
      </button>
    </div>

    <CartModal
      v-if="isCartOpen"
      :cart="cart"
      :cart-total="cartTotal"
      @close="isCartOpen = false"
      @increase="increaseQuantity"
      @decrease="decreaseQuantity"
      @remove="removeFromCart"
      :format-price="formatPrice"
    />

    <CheckoutModal
      v-if="isCheckoutModalOpen"
      :products="checkoutProducts"
      @close="isCheckoutModalOpen = false"
      @confirm="handleCheckoutSubmit"
    />

    <LogoutModal
      v-if="showLogoutConfirm"
      @cancel="showLogoutConfirm = false"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useWatches } from '../composables/useWatches'
import { useCart } from '../composables/useCart';
import { useCheckout } from '../composables/useCheckout'

const router = useRouter()
const auth = useAuth()
const { watches, fetchWatches, isLoading, error } = useWatches()
const { 
  cart, 
  fetchCart, 
  addToCart: apiAddToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  cartTotal,
  totalItems,
  isLoading: isLoadingCart,
  error: cartError
} = useCart()
const {
  checkoutCart,
  checkoutSingleItem,
  isLoading: isCheckoutLoading,
  error: checkoutError
} = useCheckout()

const showLogoutConfirm = ref(false)
const characteristics = ['Premium', 'Classic', 'Sporty', 'Luxury', 'Affordable', 'Smartwatch']
const categories = ['Latest Products', 'On Sale', 'My Favorites']
const selectedCharacteristics = ref<string[]>([])
const searchQuery = ref('')
const isCartOpen = ref(false)
const isCheckoutModalOpen = ref(false)
const checkoutData = ref<{ shipping_address: string; payment_method: string } | null>(null)
const buyNowProduct = ref<Product | null>(null);

onMounted(async () => {
  try {
    await auth.init();
    
    await fetchWatches();

    if (auth.isAuthenticated()) {
      await auth.ensureUserData();
      
      if (!auth.user.value?.id) {
        throw new Error('User authentication failed - no user ID available');
      }
      
      await fetchCart();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    if (auth.isAuthenticated()) {
      router.push('/');
    }
  }
});

interface Product {
  watch_id: number
  watch_name: string
  watch_price: string
  watch_image: string
  watch_characteristic: number
  characteristic_name?: string
  rawPrice?: number
}

interface CartItem {
  id: string
  name: string
  basePrice: number
  price: string
  quantity: number
  image: string
}

const filteredProducts = computed(() => {
  return watches.value.filter((product) => {
    const matchesCharacteristics =
      selectedCharacteristics.value.length === 0 ||
      selectedCharacteristics.value.some((characteristic) =>
        product.characteristic_name?.includes(characteristic)
      )
    const matchesSearch =
      searchQuery.value === '' ||
      product.watch_name.toLowerCase().includes(searchQuery.value.toLowerCase())||
      product.characteristic_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCharacteristics && matchesSearch
  })
})

const formatPrice = (amount: number): string => {
  return '₱' + amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const addToCart = async (product: Product) => {
  try {
    await auth.ensureUserData();
    await apiAddToCart(product.watch_id);
    isCartOpen.value = true;
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};


const increaseQuantity = async (cartItemId: number) => {
  try {
    const item = cart.value.find(i => i.cart_item_id === cartItemId);
    if (item) {
      await updateCartItem(cartItemId, item.quantity + 1);
    }
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

const decreaseQuantity = async (cartItemId: number) => {
  try {
    const item = cart.value.find(i => i.cart_item_id === cartItemId);
    if (item) {
      if (item.quantity > 1) {
        await updateCartItem(cartItemId, item.quantity - 1);
      } else {
        await removeFromCart(cartItemId);
      }
    }
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

const toggleCartModal = () => {
  isCartOpen.value = !isCartOpen.value
}

const filterCategory = (category: string) => {
  console.log('Filtered by category:', category)
}

const handleCheckoutSubmit = async (data: { shipping_address: string; payment_method: string }) => {
  try {
    checkoutData.value = data
    isCheckoutModalOpen.value = false

    let result;

    if (buyNowProduct.value) {
      result = await checkoutSingleItem(
        buyNowProduct.value.watch_id,
        1, 
        data.shipping_address,
        data.payment_method
      );
      buyNowProduct.value = null;
    } else {
      result = await checkoutCart(data.shipping_address, data.payment_method);
    }

    buyNowProduct.value = null; // Reset after use

    console.log('Checkout success:', result)
    router.push('/checkout/success')
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}

const handleBuyNow = async (product: Product) => {
  try {
    await auth.ensureUserData();
    buyNowProduct.value = product;
    isCheckoutModalOpen.value = true;
  } catch (error) {
    console.error('Buy Now failed:', error);
  }
};

const checkoutProducts = computed(() => {
  if (buyNowProduct.value) {
    return [{
      id: buyNowProduct.value.watch_id,
      name: buyNowProduct.value.watch_name,
      price: parseFloat(buyNowProduct.value.watch_price),
      quantity: 1,
      image: buyNowProduct.value.watch_image
    }];
  } else {
    return cart.value.map(item => ({
      id: item.watch.watch_id,
      name: item.watch.watch_name,
      price: parseFloat(item.watch.watch_price),
      quantity: item.quantity,
      image: item.watch.watch_image
    }));
  }
});

const logout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = async () => {
  try {
    await auth.logout(); 
    localStorage.removeItem('user'); 
    localStorage.removeItem('authToken');
    
    router.push('/');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

watch(isCheckoutModalOpen, (newVal) => {
  if (!newVal) {
    buyNowProduct.value = null;
  }
});

</script>

<style scoped>
img {
  object-fit: contain;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
