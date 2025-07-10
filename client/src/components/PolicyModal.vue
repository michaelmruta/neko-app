<template>
  <div
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(30, 41, 59, 0.25)"
    v-if="show"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Privacy Policy</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close" />
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow: auto">
          <p><strong>Effective Date:</strong> [Insert Date]</p>

          <p>
            This Privacy Policy explains how <strong>[Your Web App Name]</strong> ("we", "our", or
            "us") collects, uses, and protects your information when you use our web application
            (the "Service").
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> such as your name, email address, and contact
              details when you register or contact us.
            </li>
            <li>
              <strong>Usage Data:</strong> such as IP address, browser type, pages visited, and
              actions on the platform.
            </li>
            <li>
              <strong>Cookies:</strong> small data files stored on your device to improve
              functionality and user experience.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our Service</li>
            <li>To communicate with you, including responding to inquiries and sending updates</li>
            <li>To monitor and analyze usage patterns</li>
            <li>To ensure security and prevent abuse</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li>Service providers who assist in delivering our services</li>
            <li>Legal authorities if required by law or to protect our rights</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your information
            from unauthorized access, disclosure, alteration, or destruction.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal data</li>
            <li>Withdraw consent at any time</li>
            <li>Object to certain types of processing</li>
          </ul>
          <p>
            To exercise these rights, contact us at
            <a href="mailto:support@example.com">support@example.com</a>.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            Our Service may contain links to external sites. We are not responsible for the content
            or privacy practices of those sites.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. Any changes will be posted here with the
            updated effective date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            <a href="mailto:support@example.com">support@example.com</a>.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close'])
function close() {
  emit('close')
}
</script>
