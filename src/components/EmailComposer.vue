<template>
  <div class="email-composer">
    <div class="composer-header">
      <h2>Compose New Email</h2>
    </div>

    <form @submit.prevent="sendEmail" class="email-form">
      <div class="form-group">
        <label for="to">To</label>
        <input
            type="email"
            id="to"
            v-model="email.to"
            placeholder="recipient@example.com"
            required
            class="form-input"
            @focus="handleFocus"
            @blur="handleBlur"
        >
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <input
            type="text"
            id="subject"
            v-model="email.subject"
            placeholder="Email subject"
            class="form-input"
            @focus="handleFocus"
            @blur="handleBlur"
        >
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
            id="message"
            v-model="email.message"
            placeholder="Write your message here..."
            rows="12"
            class="form-textarea"
            @focus="handleFocus"
            @blur="handleBlur"
        ></textarea>
      </div>

      <!-- Email Preview -->
      <div class="email-preview" v-if="hasContent">
        <h3>Email Preview</h3>
        <div class="preview-content">
          <div class="preview-field">
            <strong>To:</strong> {{ email.to || 'patrickbroehansenwor' }}
          </div>
          <div class="preview-field">
            <strong>Subject:</strong> {{ email.subject || 'test' }}
          </div>
          <div class="preview-field">
            <strong>Message:</strong>
            <div class="message-preview">{{ email.message || 'No message content' }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button type="button" class="quick-btn" @click="insertTemplate">
          📝 Insert Template
        </button>
        <button type="button" class="quick-btn" @click="clearForm">
          🗑️ Clear
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
            type="button"
            @click="saveDraft"
            class="btn btn-secondary"
            :disabled="!hasContent"
        >
          Save Draft
        </button>
        <button
            type="submit"
            class="btn btn-primary"
            :disabled="!email.to"
        >
          Send Email
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EmailComposer',
  data() {
    return {
      email: {
        to: '',
        subject: '',
        message: ''
      }
    }
  },
  computed: {
    hasContent() {
      return this.email.to || this.email.subject || this.email.message
    }
  },
  methods: {
    sendEmail() {
      if (this.email.to) {
        this.$emit('send-email', { ...this.email })
        this.resetForm()
        this.showNotification('Email sent successfully!')
      }
    },
    saveDraft() {
      if (this.hasContent) {
        this.$emit('save-draft', { ...this.email })
        this.showNotification('Draft saved successfully!')
      }
    },
    resetForm() {
      this.email = {
        to: '',
        subject: '',
        message: ''
      }
    },
    insertTemplate() {
      this.email.message = 'Dear recipient,\n\nThank you for your email.\n\nBest regards,\n[Your Name]'
    },
    clearForm() {
      this.resetForm()
      this.showNotification('Form cleared')
    },
    showNotification(message) {
      // Simple notification
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `
      notification.textContent = message
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    },
    handleFocus(event) {
      event.target.classList.add('focused')
      event.target.classList.remove('blurred')
    },
    handleBlur(event) {
      if (!event.target.value) {
        event.target.classList.remove('focused')
        event.target.classList.add('blurred')
      }
    }
  },
  mounted() {
    // Tilføj blur klasse til alle input/textarea ved start
    setTimeout(() => {
      const inputs = this.$el.querySelectorAll('.form-input, .form-textarea')
      inputs.forEach(input => {
        if (!input.value && document.activeElement !== input) {
          input.classList.add('blurred')
        }
      })
    }, 100)
  }
}
</script>

<style scoped>
.email-composer {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid #e1e5e9;
}

.composer-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
}

.composer-header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.email-form {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.05rem;
}

/* BASE STYLES - LYS MODE */
.form-input, .form-textarea {
  padding: 16px 18px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

/* Når feltet er i fokus - MØRKEBLÅ tekst (synlig på både mørk og lys baggrund) */
.form-input.focused, .form-textarea.focused {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  color: #1a365d !important; /* Mørkeblå - god kontrast */
  font-weight: 500;
}

/* Når feltet IKKE er i fokus - LYSBLÅ tekst (går i baggrunden) */
.form-input.blurred, .form-textarea.blurred {
  color: #90cdf4 !important; /* Lys blå - dæmpet visning */
  opacity: 0.9;
}

/* Placeholder styling */
.form-input::placeholder, .form-textarea::placeholder {
  color: #a0aec0;
  transition: color 0.3s ease;
}

.form-input.blurred::placeholder, .form-textarea.blurred::placeholder {
  color: #90cdf4 !important;
  opacity: 0.8;
}

.form-input.focused::placeholder, .form-textarea.focused::placeholder {
  color: #a0aec0 !important;
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.5;
}

/* Email Preview */
.email-preview {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
}

.email-preview h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 600;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-field {
  color: #333;
  line-height: 1.5;
}

.preview-field strong {
  color: #333;
}

.message-preview {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  margin-top: 8px;
  white-space: pre-wrap;
  color: #333;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 0 10px 0;
  border-top: 1px solid #e1e5e9;
}

.quick-btn {
  padding: 12px 20px;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
  color: #333;
  font-weight: 500;
}

.quick-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  min-height: 54px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
}

.btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .composer-header {
    padding: 20px 25px;
  }

  .composer-header h2 {
    font-size: 1.4rem;
  }

  .email-form {
    padding: 25px 20px;
    gap: 20px;
  }

  .form-input, .form-textarea {
    padding: 14px 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    padding: 14px 20px;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-btn {
    flex: 1;
    min-width: auto;
  }

  .email-preview {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .email-composer {
    border-radius: 16px;
    margin: 0 -5px;
  }

  .composer-header {
    padding: 18px 20px;
  }

  .email-form {
    padding: 20px 15px;
  }

  .form-textarea {
    min-height: 150px;
  }
}

/* DARK MODE - Tilpasninger */
@media (prefers-color-scheme: dark) {
  .email-composer {
    background: #1a1a1a;
    border-color: #2d3748;
  }

  .form-group label {
    color: #e2e8f0 !important;
  }

  .form-input, .form-textarea {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
  }

  /* DARK MODE: Fokuseret - HVID tekst */
  .form-input.focused, .form-textarea.focused {
    border-color: #667eea !important;
    background: #2d3748 !important;
    color: #ffffff !important; /* Hvid tekst i dark mode fokus */
    font-weight: 500;
  }

  /* DARK MODE: Blurred - LYS GRÅ tekst */
  .form-input.blurred, .form-textarea.blurred {
    color: #a0aec0 !important; /* Lys grå i dark mode */
    opacity: 0.8;
  }

  /* Dark mode placeholder */
  .form-input::placeholder, .form-textarea::placeholder {
    color: #718096;
  }

  .form-input.blurred::placeholder, .form-textarea.blurred::placeholder {
    color: #a0aec0 !important;
    opacity: 0.7;
  }

  .form-input.focused::placeholder, .form-textarea.focused::placeholder {
    color: #cbd5e0 !important;
  }

  .email-preview {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
  }

  .email-preview h3 {
    color: #e2e8f0 !important;
  }

  .preview-field, .preview-field strong {
    color: #e2e8f0 !important;
  }

  .message-preview {
    background: #1a1a1a !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }

  .quick-btn {
    background: #2d3748 !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }

  .quick-btn:hover {
    background: #4a5568 !important;
  }
}

/* ANIMATIONER for smooth transitions */
@keyframes focusIn {
  from {
    color: #90cdf4;
    opacity: 0.9;
  }
  to {
    color: #1a365d;
    opacity: 1;
  }
}

@keyframes blurOut {
  from {
    color: #1a365d;
    opacity: 1;
  }
  to {
    color: #90cdf4;
    opacity: 0.9;
  }
}

/* Dark mode animationer */
@keyframes focusInDark {
  from {
    color: #a0aec0;
    opacity: 0.8;
  }
  to {
    color: #ffffff;
    opacity: 1;
  }
}

@keyframes blurOutDark {
  from {
    color: #ffffff;
    opacity: 1;
  }
  to {
    color: #a0aec0;
    opacity: 0.8;
  }
}

/* Apply animations for light mode */
.form-input.focused, .form-textarea.focused {
  animation: focusIn 0.3s ease forwards;
}

.form-input.blurred, .form-textarea.blurred {
  animation: blurOut 0.3s ease forwards;
}

/* Apply animations for dark mode */
@media (prefers-color-scheme: dark) {
  .form-input.focused, .form-textarea.focused {
    animation: focusInDark 0.3s ease forwards;
  }

  .form-input.blurred, .form-textarea.blurred {
    animation: blurOutDark 0.3s ease forwards;
  }
}

/* Alternative: Hvis felterne er MEGET mørke, brug neon effekt */
.form-input.blurred.neon, .form-textarea.blurred.neon {
  color: #00ffff !important; /* Cyan neon */
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.form-input.focused.neon, .form-textarea.focused.neon {
  color: #ffffff !important; /* Hvid */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

/* For felter med indhold - vis det klart */
.form-input:not(.blurred),
.form-textarea:not(.blurred) {
  color: #2d3748 !important; /* Mørk grå-blå */
}

@media (prefers-color-scheme: dark) {
  .form-input:not(.blurred),
  .form-textarea:not(.blurred) {
    color: #e2e8f0 !important; /* Lys grå */
  }
}

/* Ensure text is always visible with text-shadow */
.form-input.blurred, .form-textarea.blurred {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .form-input.blurred, .form-textarea.blurred {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* High contrast backup */
.form-input, .form-textarea {
  -webkit-text-fill-color: currentColor;
  -webkit-opacity: 1;
  opacity: 1;
}

/* Ensure focus state is clear */
.form-input.focused, .form-textarea.focused {
  border-width: 2.5px !important;
  transform: scale(1.005);
}
</style>