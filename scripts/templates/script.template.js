module.exports = (model) =>
  `<script>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    import { useRouter } from 'vue-router'

    export default {
      setup() {
        const router = useRouter();

        const searchQuery = ref('');
        const pageSize = ref(10);
        const currentPage = ref(1);
        const items = ref([]);
        const authStore = useAuthStore();

        const showRecordModal = ref(false)
        const isEditing = ref(false)
        const showDeleteModal = ref(false)
        const itemToDelete = ref(null);
  
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
            authStore.deleteItem('${model?.toLowerCase()}', itemToDelete.value.id)
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

        const filteredSet = computed(() => {
          if (!searchQuery.value) return items.value || []

          const query = searchQuery.value.toLowerCase()
          return (
            items.value?.filter(
              (row) =>
                row.name.toLowerCase().includes(query)
            ) || []
          )
        })

        const paginatedSet = computed(() => {
          const start = (currentPage.value - 1) * pageSize.value
          const end = start + pageSize.value
          return filteredSet.value.slice(start, end)
        })

        const totalPages = computed(() => {
          return Math.ceil(filteredSet.value.length / pageSize.value)
        })

        const openAddRecordModal = () => {
          return true
        }

        watch([searchQuery, pageSize], () => {
          currentPage.value = 1
        })

        onMounted(async () => {
          try {
            const response = await authStore.getList('${model?.toLowerCase()}', currentPage.value, pageSize.value)
            items.value = response.results
          } catch (error) {
            console.error('Failed to fetch items:', error)
          }
        })

        watch([currentPage, pageSize], async () => {
          try {
            const response = await authStore.getList('${model?.toLowerCase()}', currentPage.value, pageSize.value)
            items.value = response.data
          } catch (error) {
            console.error('Failed to fetch items:', error)
          }
        })

        return {
          searchQuery,
          pageSize,
          currentPage,
          items,
          filteredSet,
          paginatedSet,
          totalPages,
          openAddRecordModal,
          confirmDelete,
          closeDeleteModal,
          deleteRecord,
          edit,
          isEditing,
          showRecordModal,
        }
      },
      computed: {
        name() {
          return this.$route.name
        }
      }
    }
</script>`;
