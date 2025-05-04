<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Settings</h2>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Account Settings</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveProfile">
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">Name</label>
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  v-model="profile.name"
                  placeholder="Your name"
                />
              </div>
            </div>
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">Email address</label>
              <div class="col">
                <input type="email" class="form-control" v-model="profile.email" disabled />
                <small class="form-hint">Email cannot be changed</small>
              </div>
            </div>
            <div class="form-footer">
              <button type="submit" class="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">
          <h3 class="card-title">Change Password</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="changePassword">
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">Current Password</label>
              <div class="col">
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.currentPassword"
                  placeholder="Current password"
                />
              </div>
            </div>
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">New Password</label>
              <div class="col">
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.newPassword"
                  placeholder="New password"
                />
              </div>
            </div>
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">Confirm Password</label>
              <div class="col">
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.confirmPassword"
                  placeholder="Confirm new password"
                />
                <div v-if="passwordMismatch" class="invalid-feedback d-block">
                  Passwords do not match
                </div>
              </div>
            </div>
            <div class="form-footer">
              <button type="submit" class="btn btn-primary" :disabled="passwordMismatch">
                Update password
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-header">
          <h3 class="card-title">Notification Settings</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveNotificationSettings">
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">Email Notifications</label>
              <div class="col">
                <label class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="notificationSettings.email"
                  />
                  <span class="form-check-label">Receive email notifications</span>
                </label>
              </div>
            </div>
            <div class="form-group mb-3 row">
              <label class="form-label col-3 col-form-label">System Notifications</label>
              <div class="col">
                <label class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="notificationSettings.system"
                  />
                  <span class="form-check-label">Receive system notifications</span>
                </label>
              </div>
            </div>
            <div class="form-footer">
              <button type="submit" class="btn btn-primary">Save notification settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Profile settings
const profile = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
})

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordMismatch = computed(() => {
  return (
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
  )
})

// Notification settings
const notificationSettings = ref({
  email: true,
  system: true,
})

// Methods
async function saveProfile() {
  // In a real app, this would call an API
  alert('Profile updated successfully')
}

async function changePassword() {
  if (passwordMismatch.value) return

  // In a real app, this would call an API
  alert('Password changed successfully')

  // Reset form
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

async function saveNotificationSettings() {
  // In a real app, this would call an API
  alert('Notification settings updated successfully')
}
</script>
