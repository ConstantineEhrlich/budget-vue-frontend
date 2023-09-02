// Base
import { createApp } from 'vue'
import App from './App.vue'

// State management
import { createPinia } from 'pinia'
import {useUserState} from './components/User/userState';

// Vuetify
import { buildVuetify } from './plugins/vuetify';
const vuetify = buildVuetify();

// Router
import {router} from "./routing";

// Create app and add services
const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);

// Get User profile
const user = useUserState();
user.fetchProfile()
    .then(() => console.log("Auth status:", user.authenticated))
    .catch(error => console.error("User is not authenticated"));

// Render
app.mount("#app");

