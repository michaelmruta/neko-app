<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Users List</h2>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <button class="btn btn-primary d-none d-sm-inline-block" @click="openAddRecordModal">
              <i class="ti ti-plus"></i>
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <!-- Users list -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Users</h3>
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
                  name="Search"
                  class="form-control form-control-sm"
                  v-model="searchQuery"
                  placeholder="Search users..."
                  value=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table card-table table-vcenter text-nowrap datatable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(user.status)">{{
                    user.status
                  }}</span>
                </td>
                <td>{{ user.role }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="btn-list flex-nowrap">
                    <button class="btn btn-sm btn-outline-primary" @click="editUser(user)">
                      <i class="ti ti-edit"></i>
                      Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteUser(user)">
                      <i class="ti ti-trash"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="7" class="text-center">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer d-flex align-items-center">
          <p class="m-0 text-muted">
            Showing
            <span>{{ (currentPage - 1) * pageSize + 1 }}</span> to
            <span>{{ Math.min(currentPage * pageSize, filteredUsers.length) }}</span> of
            <span>{{ filteredUsers.length }}</span> entries
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

  <!-- Add/Edit User Modal -->
  <div
    class="modal modal-blur fade"
    :class="{ show: showRecordModal }"
    tabindex="-1"
    :style="showRecordModal ? 'display: block;' : ''"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditing ? 'Edit User' : 'Add New User' }}</h5>
          <button type="button" class="btn-close" @click="closeUserModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              v-model="currentRecord.name"
              placeholder="User name"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="currentRecord.email"
              placeholder="Email address"
            />
          </div>
          <div class="mb-3" v-if="!isEditing">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="currentRecord.password"
              placeholder="Password"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Role</label>
            <select class="form-select" v-model="currentRecord.role">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="currentRecord.status">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-link link-secondary" @click="closeUserModal">
            Cancel
          </button>
          <button type="button" class="btn btn-primary ms-auto" @click="saveUser">
            <i class="ti ti-device-floppy"></i>
            {{ isEditing ? 'Update user' : 'Create user' }}
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showRecordModal" style="z-index: -1"></div>
  </div>

  <!-- Delete Confirmation Modal -->
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
          <div>If you proceed, you will delete the user {{ userToDelete?.name }}.</div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-link link-secondary me-auto"
            @click="closeDeleteModal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteUser">Yes, delete user</button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal" style="z-index: -1"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { userService } from '@/services/api'

// Mock data for users - in a real app, this would come from an API
const users = ref([])

// UI state
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const showRecordModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentRecord = ref({
  name: '',
  email: '',
  password: '',
  role: 'USER',
  status: 'ACTIVE',
})
const userToDelete = ref(null)

// Computed properties
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value || []

  const query = searchQuery.value.toLowerCase()
  return (
    users.value?.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query),
    ) || []
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value)
})

// Methods
function getStatusBadgeClass(status) {
  const statusMap = {
    ACTIVE: 'bg-success',
    INACTIVE: 'bg-secondary',
    SUSPENDED: 'bg-danger',
    PENDING: 'bg-warning',
  }
  return statusMap[status] || 'bg-secondary'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function openAddRecordModal() {
  currentRecord.value = {
    name: '',
    email: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE',
  }
  isEditing.value = false
  showRecordModal.value = true
}

function editUser(user) {
  currentRecord.value = { ...user }
  isEditing.value = true
  showRecordModal.value = true
}

function closeUserModal() {
  showRecordModal.value = false
}

async function saveUser() {
  try {
    if (isEditing.value) {
      // Update existing user
      await userService.update(currentRecord.value.id, currentRecord.value)
    } else {
      // Add new user
      await userService.create(currentRecord.value)
    }

    // Refresh the user list
    const data = await userService.getList(currentPage.value, pageSize.value, searchQuery.value)
    users.value = data.results

    closeUserModal()
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

function confirmDeleteUser(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
}

async function deleteUser() {
  if (userToDelete.value) {
    try {
      await userService.delete(userToDelete.value.id)

      // Refresh the user list
      const data = await userService.getList(currentPage.value, pageSize.value, searchQuery.value)
      users.value = data.results

      closeDeleteModal()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

watch([searchQuery, pageSize], () => {
  currentPage.value = 1
})

// Fetch users from the API
onMounted(async () => {
  try {
    const data = await userService.getList(currentPage.value, pageSize.value, searchQuery.value)
    users.value = data.results
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})

watch([currentPage, pageSize, searchQuery], async () => {
  try {
    const data = await userService.getList(currentPage.value, pageSize.value, searchQuery.value)
    users.value = data.results
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>
