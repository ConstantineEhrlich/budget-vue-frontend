import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {useUserStore} from './components/User/userStore';
import {createRouter, createWebHistory} from 'vue-router';
import BudgetListVue from './components/Budget/BudgetList.vue';
import UserProfileVue from './components/User/UserProfile.vue';
import LoginFormVue from './components/User/LoginForm.vue';
import LogOutVue from './components/User/LogOut.vue';


const routes = [
    {path: '/', component: BudgetListVue},
    {path: '/profile', component: UserProfileVue},
    {path: '/login', component: LoginFormVue},
    {path: '/logout', component: LogOutVue}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App);
app.use(createPinia());
app.use(router);

console.log("Init user store")
const user = useUserStore();
user.fetchProfile()
.then(() => console.log(user.authenticated))
.catch(error => console.error(error));

app.mount("#app");

