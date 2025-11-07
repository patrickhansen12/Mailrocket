<template>
  <div id="app">
    <div class="app-container">
      <!-- Login Screen -->
      <div v-if="!isLoggedIn" class="login-screen">
        <div class="login-container">
          <div class="app-logo">
            <span class="logo-icon">✉️</span>
            <h1>MailApp</h1>
          </div>
          <p class="login-subtitle">Please login to start sending emails</p>
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <input
                  type="email"
                  v-model="loginData.email"
                  placeholder="Email address"
                  required
                  class="form-input"
              >
            </div>
            <div class="form-group">
              <input
                  type="password"
                  v-model="loginData.password"
                  placeholder="Password"
                  required
                  class="form-input"
              >
            </div>
            <button type="submit" class="login-btn">Login</button>
          </form>
          <div class="demo-credentials">
            <p>Demo: any email/password works</p>
          </div>
        </div>
      </div>

      <!-- Main App -->
      <div v-else class="main-app">
        <!-- Header -->
        <header class="app-header">
          <div class="header-content">
            <div class="header-left">
              <button @click="toggleSidebar" class="menu-btn">
                <span class="menu-icon">☰</span>
              </button>
              <h1>MailApp</h1>
            </div>
            <button @click="logout" class="logout-btn">Logout</button>
          </div>
        </header>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Sidebar -->
          <div :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
            <div class="sidebar-content">
              <nav class="sidebar-nav">
                <button
                    :class="['nav-item', { 'active': currentView === 'compose' }]"
                    @click="setView('compose')"
                >
                  <span class="nav-icon">📝</span>
                  <span>Compose</span>
                </button>
                <button
                    :class="['nav-item', { 'active': currentView === 'sent' }]"
                    @click="setView('sent')"
                >
                  <span class="nav-icon">📤</span>
                  <span>Sent</span>
                  <span class="badge" v-if="sentEmails.length > 0">{{ sentEmails.length }}</span>
                </button>
                <button
                    :class="['nav-item', { 'active': currentView === 'drafts' }]"
                    @click="setView('drafts')"
                >
                  <span class="nav-icon">📁</span>
                  <span>Drafts</span>
                  <span class="badge" v-if="drafts.length > 0">{{ drafts.length }}</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Content Area -->
          <div class="content-area">
            <!-- Compose View -->
            <div v-if="currentView === 'compose'" class="view-container">
              <EmailComposer
                  @send-email="sendEmail"
                  @save-draft="saveDraft"
              />
            </div>

            <!-- Sent Emails View -->
            <div v-if="currentView === 'sent'" class="view-container">
              <div class="view-header">
                <h2>Sent Emails</h2>
                <p class="view-subtitle">Your sent email history</p>
              </div>
              <div class="email-list">
                <div
                    v-for="email in sentEmails"
                    :key="email.id"
                    class="email-item"
                    @click="viewEmail(email)"
                >
                  <div class="email-header">
                    <div class="email-to">{{ email.to }}</div>
                    <div class="email-time">{{ formatTime(email.timestamp) }}</div>
                  </div>
                  <div class="email-subject">{{ email.subject || '(No subject)' }}</div>
                  <div class="email-preview">{{ getMessagePreview(email.message) }}</div>
                </div>
                <div v-if="sentEmails.length === 0" class="empty-state">
                  <span class="empty-icon">📤</span>
                  <h3>No sent emails</h3>
                  <p>Your sent emails will appear here</p>
                </div>
              </div>
            </div>

            <!-- Drafts View -->
            <div v-if="currentView === 'drafts'" class="view-container">
              <div class="view-header">
                <h2>Drafts</h2>
                <p class="view-subtitle">Your saved drafts</p>
              </div>
              <div class="email-list">
                <div
                    v-for="draft in drafts"
                    :key="draft.id"
                    class="email-item draft-item"
                    @click="editDraft(draft)"
                >
                  <div class="email-header">
                    <div class="email-to">{{ draft.to || 'No recipient' }}</div>
                    <div class="email-time">Draft</div>
                  </div>
                  <div class="email-subject">{{ draft.subject || '(No subject)' }}</div>
                  <div class="email-preview">{{ getMessagePreview(draft.message) }}</div>
                </div>
                <div v-if="drafts.length === 0" class="empty-state">
                  <span class="empty-icon">📁</span>
                  <h3>No drafts</h3>
                  <p>Your saved drafts will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Overlay -->
        <div
            v-if="isSidebarOpen"
            class="sidebar-overlay"
            @click="toggleSidebar"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import EmailComposer from './components/EmailComposer.vue'

export default {
  name: 'App',
  components: {
    EmailComposer
  },
  data() {
    return {
      isLoggedIn: false,
      isSidebarOpen: false,
      currentView: 'compose',
      loginData: {
        email: '',
        password: ''
      },
      sentEmails: [
        {
          id: 1,
          to: 'patrickbreehansenwork@hotmail.com',
          subject: 'test',
          message: 'yugedwagy udayyuga...',
          timestamp: new Date().toISOString()
        }
      ],
      drafts: []
    }
  },
  mounted() {
    // Check screen size and auto-open sidebar on desktop
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    login() {
      if (this.loginData.email && this.loginData.password) {
        this.isLoggedIn = true
      }
    },
    logout() {
      this.isLoggedIn = false
      this.loginData = { email: '', password: '' }
      this.currentView = 'compose'
      this.isSidebarOpen = false
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    setView(view) {
      this.currentView = view
      // On mobile, close sidebar after selecting view
      if (window.innerWidth < 768) {
        this.isSidebarOpen = false
      }
    },
    handleResize() {
      // Auto-show sidebar on desktop, hide on mobile
      if (window.innerWidth >= 768) {
        this.isSidebarOpen = true
      } else {
        this.isSidebarOpen = false
      }
    },
    sendEmail(emailData) {
      this.sentEmails.unshift({
        ...emailData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      })
    },
    saveDraft(draftData) {
      if (draftData.to || draftData.subject || draftData.message) {
        // Remove existing draft with same content to avoid duplicates
        this.drafts = this.drafts.filter(draft =>
            draft.to !== draftData.to ||
            draft.subject !== draftData.subject
        )
        this.drafts.unshift({
          ...draftData,
          id: Date.now()
        })
      }
    },
    viewEmail(email) {
      alert(`To: ${email.to}\nSubject: ${email.subject}\n\n${email.message}`)
    },
    editDraft(draft) {
      this.currentView = 'compose'
      // In a real app, you'd pass this to the composer component via props/event bus
      setTimeout(() => {
        // This would be handled by the EmailComposer component
        console.log('Editing draft:', draft)
      }, 100)
    },
    formatTime(timestamp) {
      try {
        const date = new Date(timestamp)
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Recent'
        }
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return 'Recent'
      }
    },
    getMessagePreview(message) {
      if (!message) return 'No message content'
      return message.length > 60 ? message.substring(0, 60) + '...' : message
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  line-height: 1.6;
  color: #333;
}

#app {
  min-height: 100vh;
}

/* Login Screen */
.login-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 40px 35px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 420px;
  width: 100%;
}

.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 15px;
}

.logo-icon {
  font-size: 2.2rem;
}

.app-logo h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.login-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s;
  background: white;
  color: #333;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 10px;
}

.login-btn:hover {
  transform: translateY(-2px);
}

.demo-credentials {
  margin-top: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.demo-credentials p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Main App */
.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.menu-btn:hover {
  background: #f5f5f5;
}

.app-header h1 {
  color: #333;
  font-size: 1.4rem;
  font-weight: 700;
}

.logout-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: #c82333;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e1e5e9;
  transition: left 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar-open {
  left: 0;
}

.sidebar-content {
  padding: 90px 20px 30px 20px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 1.3rem;
}

.badge {
  background: #dc3545;
  color: white;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: auto;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 30px;
  min-height: calc(100vh - 80px);
}

.view-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.view-header {
  margin-bottom: 30px;
  text-align: center;
}

.view-header h2 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.view-subtitle {
  color: #666;
  font-size: 1.1rem;
}

/* Email List */
.email-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.email-item {
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e1e5e9;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.email-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #667eea;
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 15px;
}

.email-to {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  word-break: break-all;
}

.email-time {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.email-subject {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.email-preview {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

.draft-item {
  border-left: 4px solid #ffc107;
  background: #fffbf0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  display: block;
  opacity: 0.7;
}

.empty-state h3 {
  margin-bottom: 12px;
  color: #333;
  font-size: 1.3rem;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Responsive Design */
@media (min-width: 768px) {
  .sidebar {
    position: static;
    width: 280px;
    height: auto;
    min-height: calc(100vh - 80px);
  }

  .sidebar-overlay {
    display: none;
  }

  .menu-btn {
    display: none;
  }

  .content-area {
    padding: 40px;
  }

  .view-header {
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .main-content {
    gap: 0;
  }

  .sidebar {
    width: 300px;
  }
}

@media (max-width: 767px) {
  .content-area {
    padding: 20px;
  }

  .email-item {
    padding: 16px;
  }

  .app-header {
    padding: 14px 20px;
  }

  .header-content {
    padding: 0;
  }

  .view-header h2 {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 25px;
    margin: 10px;
  }

  .app-logo h1 {
    font-size: 1.7rem;
  }

  .content-area {
    padding: 15px;
  }

  .email-header {
    flex-direction: column;
    gap: 8px;
  }

  .email-time {
    align-self: flex-start;
  }
}
</style>