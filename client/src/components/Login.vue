<template>
  <div class="page page-center">
    <div class="container-tight py-4">
      <div class="text-center mb-4">
        <a href="#" class="navbar-brand">
          <!-- <img src="/logo.svg" height="36" alt="Tabler Logo" /> -->
        </a>
      </div>

      <form class="card card-md" @submit.prevent="handleLogin">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Login to your account</h2>

          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          <div class="mb-2">
            <label class="form-label">
              Password
              <span class="form-label-description">
                <a href="#">Forgot password?</a>
              </span>
            </label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Your password"
              required
            />
          </div>

          <div class="mb-2">
            <label class="form-check">
              <input type="checkbox" class="form-check-input" v-model="rememberMe" />
              <span class="form-check-label">Remember me</span>
            </label>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-footer">
            <button type="submit" class="btn btn-primary w-100">Sign in</button>
          </div>
        </div>
        <div class="hr-text">or</div>
        <div class="card-body">
          <div class="btn-list">
            <a href="#" class="btn btn-white w-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon me-2 text-google"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17.788 17.761a8.5 8.5 0 1 1 .24-11.294l-3.029 2.5a4.5 4.5 0 1 0 .13 6.583"
                />
              </svg>
              Login with Google
            </a>
          </div>
        </div>
      </form>

      <div class="text-center text-muted mt-3">Don’t have account yet? <a href="#">Sign up</a></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')

function handleLogin() {
  if (email.value === 'admin@example.com' && password.value === '1234') {
    alert('Logged in!')
    errorMessage.value = ''
  } else {
    errorMessage.value = 'Invalid email or password.'
  }
}
</script>
