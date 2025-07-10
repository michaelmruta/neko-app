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
          <h2 class="card-title text-center">Forgot Password</h2>
          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              required
              autocomplete="email"
              placeholder="Enter your email"
            />
          </div>
          <div v-if="message" class="alert alert-success mt-2" role="alert">
            {{ message }}
          </div>
          <div v-if="error" class="alert alert-danger mt-2" role="alert">
            {{ error }}
          </div>
          <div class="form-footer">
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              Send Reset Link
            </button>
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
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await axios.post('/api/users/forgot-password', { email: email.value })
    message.value = 'If that email exists, a reset link has been sent.'
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
