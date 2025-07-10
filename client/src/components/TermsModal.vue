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
          <h5 class="modal-title">Terms of Service</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close" />
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow: auto">
          <p><strong>Effective Date:</strong> [Insert Date]</p>

          <p>
            Welcome to <strong>[Your Web App Name]</strong> (the "Service"). By accessing or using
            our web application, you agree to be bound by these Terms of Service ("Terms"). If you
            do not agree to these Terms, please do not use the Service.
          </p>

          <h2>1. Use of the Service</h2>
          <p>
            You must be at least 13 years old to use the Service. By using the Service, you
            represent and warrant that you have the legal capacity to enter into a binding
            agreement.
          </p>
          <p>
            You agree to use the Service only for lawful purposes and in accordance with these
            Terms. You may not use the Service in any way that could harm
            <strong>[Your Web App Name]</strong> or its users.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You may need to create an account to access certain features. You are responsible for
            maintaining the confidentiality of your account credentials and for all activity under
            your account.
          </p>
          <p>
            [Optional: We reserve the right to suspend or terminate your account if we suspect any
            unauthorized use.]
          </p>

          <h2>3. User Content</h2>
          <p>
            You retain ownership of any content you upload or submit through the Service ("User
            Content"). By submitting User Content, you grant <strong>[Your Web App Name]</strong> a
            non-exclusive, royalty-free license to use, display, and distribute it in connection
            with providing the Service.
          </p>
          <p>
            You agree not to upload content that is illegal, offensive, or violates the rights of
            others.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content and materials on the Service (excluding User Content), including text,
            graphics, logos, and software, are the property of
            <strong>[Your Web App Name]</strong> and are protected by applicable intellectual
            property laws.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Our collection and use of your information is governed by our
            <a href="#">Privacy Policy</a>, which is incorporated into these Terms by reference.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time, with or without
            cause or notice. Upon termination, your right to use the Service will immediately cease.
          </p>

          <h2>7. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind,
            either express or implied. We do not guarantee that the Service will be error-free,
            secure, or available at all times.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, <strong>[Your Web App Name]</strong> shall not
            be liable for any indirect, incidental, special, or consequential damages arising out of
            or related to your use of the Service.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of any changes by
            updating the “Effective Date” above. Your continued use of the Service after changes are
            posted constitutes your acceptance of the revised Terms.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
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
