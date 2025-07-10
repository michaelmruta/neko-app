<template>
  <div class="page page-center">
    <div class="container-tight py-4">
      <div class="text-center mb-4">
        <a href="#" class="navbar-brand">
          <!-- <img src="/logo.svg" height="36" alt="Tabler Logo" /> -->
        </a>
      </div>

      <form class="card card-md" @submit.prevent="handleSignUp">
        <div class="card-body">
          <h1 class="text-center">
            <a href="#">
              <img src="/static/logo.svg" height="90" alt="Tabler" class="navbar-brand-image" />
              <h1>Neko App</h1>
            </a>
          </h1>

          <h2 class="card-title text-center">Create new account</h2>

          <div class="mb-3">
            <label class="form-label">Name</label>
            <input
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

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

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Your password"
              required
            />
          </div>

          <div class="mb-3">
            <div class="form-check d-inline-flex align-items-center flex-wrap">
              <input
                type="checkbox"
                class="form-check-input me-2"
                id="agreeTerms"
                v-model="agreeTerms"
                required
              />
              <label for="agreeTerms" class="form-check-label me-1"> I agree to the </label>
              <a href="#" @click.prevent.stop="showTermsModal = true" class="me-1">terms</a>
              and
              <a href="#" @click.prevent.stop="showPolicyModal = true" class="ms-1">policy</a>.
            </div>

            <TermsModal :show="showTermsModal" @close="showTermsModal = false" />
            <PolicyModal :show="showPolicyModal" @close="showPolicyModal = false" />
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success mt-2" role="alert">
            {{ successMessage }}
          </div>

          <div class="form-footer">
            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Create new account
            </button>
          </div>
        </div>
      </form>

      <div class="text-center text-muted mt-3">
        Already have an account? <a href="#" @click.prevent="goToLogin">Sign in</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TermsModal from './TermsModal.vue'
import PolicyModal from './PolicyModal.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const agreeTerms = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const showTermsModal = ref(false)
const showPolicyModal = ref(false)

async function handleSignUp() {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    isLoading.value = true

    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    successMessage.value =
      data.message || 'Registration successful! Please check your email to verify your account.'

    // Clear form
    name.value = ''
    email.value = ''
    password.value = ''
    agreeTerms.value = false
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
