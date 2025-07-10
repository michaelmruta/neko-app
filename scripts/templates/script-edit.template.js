module.exports = (model) =>
  `<script>
    import { ref, onMounted } from 'vue'
    import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
    import { useRouter, useRoute } from 'vue-router'

    export default {
      setup() {
        // const isDev = ref(process.env.NODE_ENV === 'development');
        const isDev = ref(false);

        // Router and store setup
        const router = useRouter();
        const route = useRoute();
        const authStore = useAuthStore();
        
        // State management
        const formData = ref({});
        const isLoading = ref(false);
        const errorMessage = ref('');
        const isNewRecord = ref(true);
        
        // Lifecycle hooks
        onMounted(() => {
          loadRecordIfExists();
        });
        
        // Methods
        async function loadRecordIfExists() {
          const recordId = route.query.id;
          
          if (!recordId) {
            isNewRecord.value = true;
            return;
          }
          
          isNewRecord.value = false;
          await fetchRecord(recordId);
        }
        
        async function fetchRecord(id) {
          try {
            isLoading.value = true;
            errorMessage.value = '';
            
            const response = await api.getItem('${model?.toLowerCase()}', id);
            console.log('Fetched record:', response);
            formData.value = response.data || {};
          } catch (error) {
            errorMessage.value = 'Failed to load record: ' + (error.message || 'Unknown error');
            console.error('Failed to fetch record:', error);
          } finally {
            isLoading.value = false;
          }
        }

        async function saveRecord() {
          try {
            isLoading.value = true;
            errorMessage.value = '';
            
            if (isNewRecord.value) {
              await createRecord();
            } else {
              await updateRecord();
            }
            
            // Navigate back to list view on success
            router.push(\`/${model?.toLowerCase()}\`);
          } catch (error) {
            errorMessage.value = 'Failed to save: ' + (error.message || 'Unknown error');
            console.error('Failed to save record:', error);
          } finally {
            isLoading.value = false;
          }
        }
        
        async function createRecord() {
          return api.createItem('${model?.toLowerCase()}', formData.value);
        }
        
        async function updateRecord() {
          return api.updateItem(
            '${model?.toLowerCase()}', 
            route.query.id, 
            formData.value
          );
        }

        function cancel() {
          router.push(\`/${model?.toLowerCase()}\`);
        }

        function formatDateTime(dateValue) {
          if (!dateValue) return '';
          const date = dateValue instanceof Date ? dateValue : new Date(dateValue);          
          if (isNaN(date.getTime())) return '';          
          return date.toISOString().slice(0, 16);
        }

        // Expose to template
        return {
          isDev,

          // State
          formData,
          isLoading,
          errorMessage,
          isNewRecord,
          
          // Methods
          saveRecord,
          cancel,
          formatDateTime
        }
      },
      computed: {
        id() {
          return this.$route.query.id;
        },
        name() {
          return this.$route.name
        },
        title() {
          return this.isNewRecord? 'New ${model}' : 'Edit ${model}'
        }
      }
    }
</script>`;
