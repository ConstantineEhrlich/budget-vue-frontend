// Base
import {createApp} from 'vue'
import App from './App.vue'

// State management
import {createPinia} from 'pinia'
import {useUserState} from './components/User/userState';

// Vuetify
import {buildVuetify} from './plugins/vuetify';
// Router
import {router} from "./routing";

const vuetify = buildVuetify();

// Create app and add services
const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);

// Get User profile
const user = useUserState();
user.fetchProfile()
    .catch(error => console.error("User is not authenticated"));

// Render
app.mount("#app");

