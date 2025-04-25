<template>
  <div>
    <div v-if="loading" class="loading-container flex justify-center items-center py-10">
      <a-spin size="large" />
    </div>
    <a-table v-else :columns="columns" :data-source="dataSource" :scroll="{ y: 500 }" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="isEditableColumn(column.dataIndex) && column.dataIndex !== 'preferences'">
          <div>
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][getSafeDataIndex(column.dataIndex)]"
              class="transition duration-300 ease-in-out border-gray-700 bg-gray-800 text-white"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <!-- Special handling for preferences dropdown with max 3 -->
        <template v-else-if="column.dataIndex === 'preferences'">
          <div>
            <div v-if="editableData[record.key]">
              <a-select
                v-model:value="editableData[record.key].preferences"
                mode="multiple"
                style="width: 100%; margin: -5px 0"
                class="custom-select"
                placeholder="Select preferences (max 3)"
                :max-tag-count="3"
                :max-tag-text-length="10"
                :disabled="isSelectDisabled(record.key)"
                @change="handlePreferencesChange(record.key, $event)"
              >
                <a-select-option 
                  v-for="pref in allPreferences" 
                  :key="pref.preference_id" 
                  :value="pref.preference_id"
                  :disabled="isOptionDisabled(record.key, pref.preference_id)"
                >
                  {{ pref.preference_name }}
                </a-select-option>
              </a-select>
              <div v-if="prefWarningVisible" class="text-xs text-red-500 mt-1">
                Maximum 3 preferences allowed
              </div>
            </div>
            <template v-else>
              <span>{{ formatPreferences(record.preferences) }}</span>
            </template>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)" class="text-green-500 hover:text-green-700">Save</a-typography-link>
              <a-popconfirm title="Are you sure to cancel?" @confirm="cancel(record.key)">
                <a class="text-red-500 hover:text-red-700">Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)" class="text-blue-500 hover:text-blue-700">Edit</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useUserManagement } from '../../composables/useUserManagement';
  import { usePreferences } from '../../composables/usePreferences';
  import { message } from 'ant-design-vue';

  const { users, fetchUsers, updateUser } = useUserManagement();
  const { preferences: allPreferences, fetchPreferences } = usePreferences();
  const dataSource = ref<DataItem[]>([]);
  const loading = ref(true);
  const prefWarningVisible = ref(false);
  const MAX_PREFERENCES = 3;

  const loadData = async () => {
    loading.value = true;
    try {
      await Promise.all([fetchUsers(), fetchPreferences()]);
      
      console.log('All Preferences:', allPreferences.value);

      if (Array.isArray(allPreferences.value)) {
        dataSource.value = users.value.map(user => {
          return {
            key: user.user_id.toString(), 
            name: user.user_name,
            email: user.user_email,
            preferences: Array.isArray(user.preferences) ? user.preferences : user.preferences ? [user.preferences] : []
          };
        });
      } else {
        message.error("Failed to load preferences data.");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      message.error("Failed to load data. Please try again.");
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadData();
  });

  watch(users, () => {
    if (users.value.length > 0) {
      dataSource.value = users.value.map(user => ({
        key: user.user_id.toString(),
        name: user.user_name,
        email: user.user_email,
        preferences: Array.isArray(user.preferences) ? user.preferences : user.preferences ? [user.preferences] : []
      }));
    }
  });

  const handlePreferencesChange = (key: string, selectedPreferences: number[]) => {
    if (selectedPreferences.length > MAX_PREFERENCES) {
      prefWarningVisible.value = true;
      setTimeout(() => {
        prefWarningVisible.value = false;
      }, 3000);
      
      editableData[key].preferences = selectedPreferences.slice(-MAX_PREFERENCES);
    } else {
      editableData[key].preferences = selectedPreferences;
    }
  };
  
  const isSelectDisabled = (key: string) => {
    return false;
  };
  
  const isOptionDisabled = (key: string, prefId: number) => {
    const selectedPrefs = editableData[key]?.preferences || [];
    return selectedPrefs.length >= MAX_PREFERENCES && !selectedPrefs.includes(prefId);
  };

  const formatPreferences = (preferences: any[] | null | undefined) => {
    if (!preferences || preferences.length === 0) return 'None';
    
    if (preferences[0] && typeof preferences[0] === 'object' && 'preference_name' in preferences[0]) {
      return preferences.map(pref => pref.preference_name).join(', ');
    }
    
    return preferences.map(prefId => {
      const pref = allPreferences.value.find(p => p.preference_id === prefId);
      return pref ? pref.preference_name : `ID: ${prefId}`;
    }).join(', ');
  };

  type DataKey = 'name' | 'email' | 'preferences' | 'operation';

  interface DataItem {
    key: string;
    name: string;
    email: string;
    preferences: any[];
  }

  interface ColumnType {
    title: string;
    dataIndex?: DataKey;
    width?: string;
    sorter?: (a: DataItem, b: DataItem) => number;
  }

  const columns = ref<ColumnType[]> ([
    { title: 'Name', dataIndex: 'name', width: '15%', sorter: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', width: '25%', sorter: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email) },
    { 
      title: 'Preferences', 
      dataIndex: 'preferences', 
      width: '25%',
    },
    { title: 'Operation', dataIndex: 'operation', width: '25%' },
  ]);



  type EditableData = Record<string, DataItem>;
  const editableData = reactive<EditableData>({});

  const isEditableColumn = (dataIndex?: DataKey): dataIndex is 'name' | 'email' | 'preferences' => {
    return !!dataIndex && ['name', 'email', 'preferences'].includes(dataIndex);
  };

  const getSafeDataIndex = (dataIndex?: DataKey): keyof DataItem => {
    if (dataIndex && isEditableColumn(dataIndex)) {
      return dataIndex;
    }
    throw new Error('Invalid data index access');
  };

  const edit = (key: string) => {
    const item = dataSource.value.find(item => item.key === key);
    if (item) {
      editableData[key] = cloneDeep(item);
      
      if (item.preferences?.[0] && typeof item.preferences[0] === 'object' && 'preference_id' in item.preferences[0]) {
        editableData[key].preferences = item.preferences.map(pref => pref.preference_id);
      }
    }
  };

  const save = async (key: string) => {
    const messageKey = 'updatable';
    message.loading({ content: 'Updating...', key: messageKey });
    
    try {
      const editedData = editableData[key];
      if (!editedData) return;
      
      const preferencesToSave = editedData.preferences?.slice(0, MAX_PREFERENCES) || [];
      
      const updatedData = {
        user_name: editedData.name,
        user_email: editedData.email,
        preferences: preferencesToSave,
      };

      const result = await updateUser(key, updatedData); 
      
      await loadData();
      
      message.success({ content: 'User updated successfully!', key: messageKey, duration: 2 });
      delete editableData[key];
    } catch (err) {
      console.error("Error saving data:", err);
      message.error({ content: 'Failed to update user.', key: messageKey, duration: 2 });
    }
  };

  const cancel = (key: string) => {
    delete editableData[key];
  };
</script>



<style scoped>
 .loading-container {
    min-height: 200px;
  }

  :global(.ant-table-thead > tr > th) {
    background-color: #2d3748 !important;
    color: #fff !important;
    font-weight: 600;
  }

  :global(.ant-table-tbody > tr > td) {
    background-color: #1a202c !important;
    color: #fff !important;
  }

  :global(.ant-table-tbody > tr > td a) {
    text-decoration: none !important;
    color: #ef4444 !important;
  }

  :global(.ant-table-tbody > tr > td a:hover) {
    color: #fff !important; 
  }

  :global(.ant-pagination) {
    color: #fff;
  }

  :global(.ant-pagination .ant-pagination-item) {
    color: #a0aec0; 
  }

  :global(.ant-pagination .ant-pagination-item:hover) {
    color: #ef4444; 
    border-color: #ffff !important;
  }

  :global(.ant-pagination .ant-pagination-item a){
    color: #fff;
  }

  :global(.ant-pagination .ant-pagination-item a:hover){
    border-color: #ef4444;
  }

  :global(.ant-pagination .ant-pagination-item-active) {
    background-color: #ef4444 !important;
    color: #fff !important; 
    border-color: #ef4444 !important;
  }

  :global(.ant-pagination .ant-pagination-item-active:hover) {
    border-color: #ffff !important;
  }

  :global(.ant-pagination .ant-pagination-item-active a) {
    color: #fff !important; 
  }

  :global(.ant-pagination .ant-pagination-disabled .ant-pagination-item-link) {
    color: #a0aec041;
  }

  :global(.ant-pagination .ant-pagination-next .ant-pagination-item-link) {
    color: #a0aec0;
  }

  :global(.ant-pagination .ant-pagination-prev .ant-pagination-item-link) {
    color: #a0aec0;
  }

  :global(.ant-pagination .ant-pagination-next .ant-pagination-item-link:hover) {
    color: #ef4444; 
  }

  :global(.ant-pagination .ant-pagination-prev .ant-pagination-item-link:hover) {
    color: #ef4444; 
  }

  :global(.ant-typography){
    color: #ef4444 !important; 
    margin-right: 10px;
  }

  :global(.custom-select) {
    color: white !important;
  }
  
  :global(.custom-select .ant-select-selector) {
    color: white !important;
  }
  
  :global(.custom-select .ant-select-selection-item) {
    color: white !important;
    background-color: #4a5568 !important;
  }
  
  :global(.ant-select-dropdown) {
    background-color: #2d3748 !important;
    color: white !important;
  }
  
  :global(.ant-select-item) {
    color: white !important;
  }
  
  :global(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
    background-color: #4a5568 !important;
  }
  
  :global(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
    background-color: #ef4444 !important;
  }

  :global(.ant-select-multiple .ant-select-selection-overflow){
    background-color: white !important;
    color: #1a202c !important;
  }

  :global(.ant-table-wrapper .ant-table-filter-trigger){
    color: #fff !important;
  }

  :global(.ant-table-wrapper .ant-table-column-sorter-inner){
    color: #fff !important;
  }

  :global(.ant-table-wrapper .ant-table-column-sorter-down.active){
    color: red !important;
  }

  :global(.ant-table-wrapper .ant-table-column-sorter-up.active){
    color: red !important;
  }

  :global(.ant-empty-normal){
    color: white !important;
  }
</style>