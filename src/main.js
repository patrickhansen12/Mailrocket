import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import "@/assets/iconImport/IconImports.js"


const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');