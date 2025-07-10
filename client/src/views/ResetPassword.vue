<template>
  <div class="page page-center">
    <div class="container-tight py-4">
      <div class="text-center mb-4">
        <a href="#" class="navbar-brand">
          <!-- <img src="/logo.svg" height="36" alt="Tabler Logo" /> -->
        </a>
      </div>
      <form class="card card-md" @submit.prevent="submit">
        <div class="card-body">
          <h1 class="text-center">
            <a href="#">
              <img src="/static/logo.svg" height="90" alt="Tabler" class="navbar-brand-image" />
              <h1>Neko App</h1>
            </a>
          </h1>
          <h2 class="card-title text-center">Reset Password</h2>
          <div class="mb-3">
            <label class="form-label">New password</label>
            <input v-model="password" type="password" class="form-control" required autocomplete="new-password" placeholder="Enter new password" />
          </div>
          <div v-if="message" class="alert alert-success mt-2" role="alert">{{ message }}</div>
          <div v-if="error" class="alert alert-danger mt-2" role="alert">{{ error }}</div>
          <div class="form-footer">
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">Reset Password</button>
          </div>
        </div>
      </form>
      <div class="text-center text-muted mt-3">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')
const token = ref('')

onMounted(() => {
  token.value = route.query.token || route.params.token || ''
  if (!token.value) {
    router.replace('/forgot-password')
  }
})

const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await axios.post(`/api/users/reset-password/${token.value}`, { password: password.value })
    message.value = 'Password reset successful! You can now log in.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = (e.response?.data?.message) || 'Invalid or expired token.'
  } finally {
    loading.value = false
  }
}
</script>
