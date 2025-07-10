module.exports = (model) =>
  `<script>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
    import { useApiStore } from '@/stores/api'
    import { useRouter } from 'vue-router'

    export default {
      setup() {
        const router = useRouter();

        const searchQuery = ref('');
        const pageSize = ref(10);
        const currentPage = ref(1);
        const totalPages = ref(1);
        const items = ref([]);
        const authStore = useAuthStore();
        const apiStore = useApiStore();

        const isEditing = ref(false)
        const showDeleteModal = ref(false)
        const itemToDelete = ref(null);

        function addRecord() {
          router.push(\`/${model?.toLowerCase()}/edit\`)
        }
  
        function edit(item) {
          router.push(\`/${model?.toLowerCase()}/edit?id=\${item.id}\`)
        }

        function confirmDelete(item) {
          itemToDelete.value = item
          showDeleteModal.value = true
        }

        function closeDeleteModal() {
          showDeleteModal.value = false
          itemToDelete.value  = null
        }

        function deleteRecord() {
          if (itemToDelete.value) {
            // Call API to delete the record
            apiStore.deleteItem('${model?.toLowerCase()}', itemToDelete.value.id)
              .then(() => {
                // Remove item from the list
                items.value = items.value.filter(item => item.id !== itemToDelete.value.id)
                // Close the modal
                closeDeleteModal()
              })
              .catch(error => {
                console.error('Failed to delete item:', error)
              })
          }
        }

        const paginatedSet = computed(() => {
          const start = (currentPage.value - 1) * pageSize.value
          const end = start + pageSize.value
          return items.value.slice(start, end)
        })

        watch([searchQuery, pageSize], () => {
          currentPage.value = 1
        })

        onMounted(async () => {
          try {
            const response = await apiStore.getList('${model?.toLowerCase()}', currentPage.value, pageSize.value)
            items.value = response.results
            totalPages.value = response.totalPages
          } catch (error) {
            console.error('Failed to fetch items:', error)
          }
        })

        watch([currentPage, pageSize, searchQuery], async () => {
          try {
            const response = await apiStore.getList('${model?.toLowerCase()}', currentPage.value, pageSize.value, searchQuery.value)
            items.value = response.results
            totalPages.value = response.totalPages
          } catch (error) {
            console.error('Failed to fetch items:', error)
          }
        })

        return {
          items,
          paginatedSet,
          totalPages,
          searchQuery,
          pageSize,
          currentPage,
          
          closeDeleteModal,
          itemToDelete,
          showDeleteModal,
          confirmDelete,
          deleteRecord,

          edit,
          isEditing,
          addRecord,
        }
      },
      computed: {
        name() {
          return this.$route.name
        },
        title() {
          return '${model} List'
        }
      }
    }
</script>`;
