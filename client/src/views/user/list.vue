<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">{{ title }}</h2>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <button
              v-if="items"
              class="btn btn-primary d-none d-sm-inline-block"
              @click="addRecord()"
            >
              <i class="ti ti-plus"></i>
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="card-title">User</h4>
          <h3 class="card-title">{{ id ? '#' + id : '' }}</h3>
        </div>
        <div class="card-body border-bottom py-3">
          <div class="d-flex">
            <div class="text-muted">
              Show
              <div class="mx-2 d-inline-block">
                <select class="form-select form-select-sm" v-model="pageSize">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              entries
            </div>
            <div class="ms-auto text-muted">
              Search:
              <div class="ms-2 d-inline-block">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="searchQuery"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row g-2 align-items-center">
          <div class="col">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Password</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last Login</th>
                    <th scope="col">Is Verified</th>
                    <th scope="col">Verification Token</th>
                    <th scope="col">Reset Token</th>
                    <th scope="col">Reset Token Expiry</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in items" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.password }}</td>
                    <td>{{ item.role }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.lastLogin }}</td>
                    <td>{{ item.isVerified }}</td>
                    <td>{{ item.verificationToken }}</td>
                    <td>{{ item.resetToken }}</td>
                    <td>{{ item.resetTokenExpiry }}</td>
                    <td>{{ item.createdAt }}</td>
                    <td>{{ item.updatedAt }}</td>
                    <td>
                      <div class="btn-list flex-nowrap">
                        <button class="btn btn-sm btn-outline-primary" @click="edit(item)">
                          <i class="ti ti-edit"></i>
                          Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(item)">
                          <i class="ti ti-trash"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex align-items-center">
          <p class="m-0 text-muted">
            Showing
            <span>{{ (currentPage - 1) * pageSize + 1 }}</span> to
            <span>{{ Math.min(currentPage * pageSize, items.length) }}</span> of
            <span>{{ items.length }}</span> entries
          </p>
          <ul class="pagination m-0 ms-auto">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                Previous
              </button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="currentPage = page">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button
                class="page-link"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal modal-blur fade"
    :class="{ show: showDeleteModal }"
    tabindex="-1"
    :style="showDeleteModal ? 'display: block;' : ''"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="modal-title">Are you sure?</div>
          <div>If you proceed, you will delete the record #{{ itemToDelete?.id }}.</div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-link link-secondary me-auto"
            @click="closeDeleteModal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteRecord">
            Yes, delete record
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal" style="z-index: -1"></div>
  </div>
</template>
<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApiStore } from '@/stores/api'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const searchQuery = ref('')
    const pageSize = ref(10)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const items = ref([])
    const authStore = useAuthStore()
    const apiStore = useApiStore()

    const isEditing = ref(false)
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)

    function addRecord() {
      router.push(`/user/edit`)
    }

    function edit(item) {
      router.push(`/user/edit?id=${item.id}`)
    }

    function confirmDelete(item) {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    function closeDeleteModal() {
      showDeleteModal.value = false
      itemToDelete.value = null
    }

    function deleteRecord() {
      if (itemToDelete.value) {
        // Call API to delete the record
        apiStore
          .deleteItem('user', itemToDelete.value.id)
          .then(() => {
            // Remove item from the list
            items.value = items.value.filter((item) => item.id !== itemToDelete.value.id)
            // Close the modal
            closeDeleteModal()
          })
          .catch((error) => {
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
        const response = await apiStore.getList('user', currentPage.value, pageSize.value)
        items.value = response.results
        totalPages.value = response.totalPages
      } catch (error) {
        console.error('Failed to fetch items:', error)
      }
    })

    watch([currentPage, pageSize, searchQuery], async () => {
      try {
        const response = await apiStore.getList(
          'user',
          currentPage.value,
          pageSize.value,
          searchQuery.value,
        )
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
      return 'User List'
    },
  },
}
</script>
