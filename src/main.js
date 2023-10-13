import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router/router'
import Vue3FormWizard from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'



const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(Vue3FormWizard)

loadFonts()

app.mount('#app')
