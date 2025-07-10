<template>
  <div class="profile-card">
    <h2>My Profile</h2>
    <div v-if="user">
      <div class="avatar-upload-area" @dragover.prevent @drop.prevent="onDrop">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" alt="avatar" class="avatar-large" />
          <button v-if="user.avatar" class="remove-btn" @click="removeAvatar" :disabled="uploading">
            Remove
          </button>
        </div>
        <div class="upload-actions">
          <input type="file" ref="fileInput" accept="image/*" @change="onFileChange" hidden />
          <button type="button" @click="$refs.fileInput.click()" :disabled="uploading">
            Choose Image
          </button>
          <button type="button" @click="uploadAvatar" :disabled="!selectedFile || uploading">
            Upload
          </button>
        </div>
        <div v-if="uploading" class="upload-progress">Uploading...</div>
        <div v-if="uploadSuccess" class="upload-success">Avatar updated!</div>
        <div v-if="uploadError" class="upload-error">{{ uploadError }}</div>
        <div class="drag-tip">Drag & drop an image here</div>
      </div>
      <div class="profile-details">
        <div class="profile-row">
          <span class="label">Name:</span> <span>{{ user.name }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Email:</span> <span>{{ user.email }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Role:</span> <span>{{ user.role }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Verified:</span> <span>{{ user.isVerified ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)
const avatarUrl = ref('')
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref('')
const selectedFile = ref(null)

const fetchProfile = async () => {
  const res = await axios.get('/api/users/me')
  user.value = res.data
  avatarUrl.value = `/api/users/avatar/${user.value.id}?t=${Date.now()}`
}

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0]
  uploadSuccess.value = false
  uploadError.value = ''
}

const onDrop = (e) => {
  if (e.dataTransfer.files.length) {
    selectedFile.value = e.dataTransfer.files[0]
    uploadSuccess.value = false
    uploadError.value = ''
  }
}

const uploadAvatar = async () => {
  if (!selectedFile.value) return
  uploading.value = true
  uploadSuccess.value = false
  uploadError.value = ''
  const formData = new FormData()
  formData.append('avatar', selectedFile.value)
  try {
    await axios.post('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    uploadSuccess.value = true
    fetchProfile()
  } catch (e) {
    uploadError.value = 'Failed to upload avatar.'
  } finally {
    uploading.value = false
    selectedFile.value = null
  }
}

const removeAvatar = async () => {
  // Optional: implement remove avatar endpoint in backend
  uploadError.value = 'Remove avatar not implemented.'
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-card {
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem 2.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-upload-area {
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem 1rem 1rem;
  border: 1.5px dashed #e0e7ef;
  position: relative;
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin: 20px;
}
.avatar-large {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
  margin-bottom: 0.5rem;
}
.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  border: none;
  border-radius: 50%;
  color: #dc2626;
  font-size: 1.1rem;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  transition: background 0.2s;
}
.remove-btn:hover {
  background: #fee2e2;
}
.upload-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.upload-actions button {
  padding: 0.4rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #6366f1;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-actions button[disabled] {
  background: #c7d2fe;
  cursor: not-allowed;
}
.upload-progress {
  color: #6366f1;
  font-size: 0.96rem;
  margin-bottom: 0.3rem;
}
.upload-success {
  color: #16a34a;
  font-size: 0.96rem;
  margin-bottom: 0.3rem;
}
.upload-error {
  color: #dc2626;
  font-size: 0.96rem;
  margin-bottom: 0.3rem;
}
.drag-tip {
  font-size: 0.88rem;
  color: #64748b;
  margin-top: 0.2rem;
}
.profile-details {
  width: 100%;
  margin-top: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.profile-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}
.profile-row:last-child {
  border-bottom: none;
}
.label {
  color: #64748b;
  font-weight: 500;
}
</style>
