<template>
  <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(30,41,59,0.25);" v-if="show">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reset Password</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">New password</label>
              <input v-model="password" type="password" class="form-control" required autocomplete="new-password" placeholder="Enter new password" />
            </div>
            <div v-if="message" class="alert alert-success mt-2" role="alert">{{ message }}</div>
            <div v-if="error" class="alert alert-danger mt-2" role="alert">{{ error }}</div>
            <div class="modal-footer px-0 pb-0">
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: Boolean,
  token: String
})
const emit = defineEmits(['close', 'success'])

const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const close = () => {
  emit('close')
  password.value = ''
  message.value = ''
  error.value = ''
}

const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await axios.post(`/api/users/reset-password/${props.token}`, { password: password.value })
    message.value = 'Password reset successful! You can now log in.'
    emit('success')
    setTimeout(close, 1500)
  } catch (e) {
    error.value = (e.response?.data?.message) || 'Invalid or expired token.'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (val) => {
  if (!val) close()
})
</script>
