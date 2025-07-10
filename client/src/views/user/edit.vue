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

        <div class="row g-2 align-items-center">
          <div class="col">
            <form @submit.prevent="saveRecord">
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" id="name" v-model="formData.name" />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="formData.email" />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="role" class="form-label">Role</label>
                  <input type="text" class="form-control" id="role" v-model="formData.role" />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="status" class="form-label">Status</label>
                  <input type="text" class="form-control" id="status" v-model="formData.status" />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="lastLogin" class="form-label">Last Login</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="lastLogin"
                    :value="formatDateTime(formData.lastLogin)"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="isVerified"
                      v-model="formData.isVerified"
                    />
                    <label class="form-check-label" for="isVerified">Is Verified</label>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="avatar" class="form-label">Avatar</label>
                  <input type="text" class="form-control" id="avatar" v-model="formData.avatar" />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="verificationToken" class="form-label">Verification Token</label>
                  <input
                    type="password"
                    class="form-control"
                    id="verificationToken"
                    v-model="formData.verificationToken"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="resetToken" class="form-label">Reset Token</label>
                  <input
                    type="password"
                    class="form-control"
                    id="resetToken"
                    v-model="formData.resetToken"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="resetTokenExpiry" class="form-label">Reset Token Expiry</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="resetTokenExpiry"
                    :value="formatDateTime(formData.resetTokenExpiry)"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="googleId" class="form-label">Google Id</label>
                  <input
                    type="text"
                    class="form-control"
                    id="googleId"
                    v-model="formData.googleId"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="createdAt" class="form-label">Created At</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="createdAt"
                    :value="formatDateTime(formData.createdAt)"
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
                  <label for="updatedAt" class="form-label">Updated At</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="updatedAt"
                    :value="formatDateTime(formData.updatedAt)"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-between mt-4 card-footer">
                <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isNewRecord ? 'Create' : 'Update' }}
                </button>
              </div>
              <div v-if="isDev" class="p-3 rounded bg-light">
                <h5>Form Data (Debug):</h5>
                <pre class="mb-0">{{ JSON.stringify(formData, null, 2) }}</pre>
              </div>
            </form>
          </div>
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    // const isDev = ref(process.env.NODE_ENV === 'development');
    const isDev = ref(false)

    // Router and store setup
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    // State management
    const formData = ref({})
    const isLoading = ref(false)
    const errorMessage = ref('')
    const isNewRecord = ref(true)

    // Lifecycle hooks
    onMounted(() => {
      loadRecordIfExists()
    })

    // Methods
    async function loadRecordIfExists() {
      const recordId = route.query.id

      if (!recordId) {
        isNewRecord.value = true
        return
      }

      isNewRecord.value = false
      await fetchRecord(recordId)
    }

    async function fetchRecord(id) {
      try {
        isLoading.value = true
        errorMessage.value = ''

        const response = await api.getItem('user', id)
        console.log('Fetched record:', response)
        formData.value = response.data || {}
      } catch (error) {
        errorMessage.value = 'Failed to load record: ' + (error.message || 'Unknown error')
        console.error('Failed to fetch record:', error)
      } finally {
        isLoading.value = false
      }
    }

    async function saveRecord() {
      try {
        isLoading.value = true
        errorMessage.value = ''

        if (isNewRecord.value) {
          await createRecord()
        } else {
          await updateRecord()
        }

        // Navigate back to list view on success
        router.push(`/user`)
      } catch (error) {
        errorMessage.value = 'Failed to save: ' + (error.message || 'Unknown error')
        console.error('Failed to save record:', error)
      } finally {
        isLoading.value = false
      }
    }

    async function createRecord() {
      return api.createItem('user', formData.value)
    }

    async function updateRecord() {
      return api.updateItem('user', route.query.id, formData.value)
    }

    function cancel() {
      router.push(`/user`)
    }

    function formatDateTime(dateValue) {
      if (!dateValue) return ''
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
      if (isNaN(date.getTime())) return ''
      return date.toISOString().slice(0, 16)
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
      formatDateTime,
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    name() {
      return this.$route.name
    },
    title() {
      return this.isNewRecord ? 'New User' : 'Edit User'
    },
  },
}
</script>
