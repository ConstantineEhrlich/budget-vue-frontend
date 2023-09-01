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
import {createRouter, createWebHistory} from 'vue-router';
import BudgetListVue from './components/Budget/BudgetList.vue';
import UserProfileVue from './components/User/UserProfile.vue';
import LoginFormVue from './components/User/LoginForm.vue';
import LogOutVue from './components/User/LogOut.vue';
import SignUpFormVue from './components/User/SignUpForm.vue'
import TransactionsVue from './components/Transaction/Transactions.vue'


const routes = [
    {path: '/', component: BudgetListVue},
    {path: '/profile', component: UserProfileVue},
    {path: '/login', component: LoginFormVue},
    {path: '/signup', component: SignUpFormVue},
    {path: '/logout', component: LogOutVue},
    {path: "/transactions", component: TransactionsVue}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Create app and add services
const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);

// Get User profile
const user = useUserState();
user.fetchProfile()
.then(() => console.log(user.authenticated))
.catch(error => console.error(error));

// Render
app.mount("#app");

