import { ref } from 'vue'
import axios from 'axios'

interface Watch {
  watch_id: number
  watch_name: string
  watch_image: string
  watch_characteristic: number
  watch_price: string
  watch_stock: number
  created_at: string
  characteristic_name?: string
}

export function useWatches() {
  const watches = ref<Watch[]>([])  // Defining the type of the watches array as Watch[]
  const isLoading = ref(false)
  const error = ref(null)

  const fetchWatches = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const [watchesRes, preferencesRes] = await Promise.all([
        axios.get('http://localhost:5002/api/watches'),
        axios.get('http://localhost:5002/api/preferences')
      ]);

      // Create a map for quick preference lookup
      const prefMap = new Map(
        preferencesRes.data.map((p: any) => [p.preference_id, p.preference_name])
      );

      watches.value = watchesRes.data.map((watch: Watch) => ({
        ...watch,
        characteristic_name: prefMap.get(watch.watch_characteristic)
      }));
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch watches';
      console.error('Fetch watches error:', err);
      throw err; // Rethrow to handle in component
    } finally {
      isLoading.value = false;
    }
  };

  return {
    watches,
    isLoading,
    error,
    fetchWatches
  }
}
