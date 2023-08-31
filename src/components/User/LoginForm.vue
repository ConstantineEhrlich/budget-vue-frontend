<script setup>
    import{ref} from "vue";
    import {userLogin} from "./UserController"
    import {useRouter} from 'vue-router';
    import {useUserStore} from './userStore';
    const router = useRouter();

    let username = ref("");
    let password = ref("");
    let formResult = ref("");

    let user = useUserStore();

    const login = () => {
        userLogin(username.value, password.value)
        .then(() => {
            user.fetchProfile().then(() => router.push('/')).catch(e => console.error(e));
        })
        .catch(() => formResult.value = "Login failed!");
    }

    function clearResultMessage(){
        formResult.value = "";
    }

</script>

<template>
    <div id="loginForm">
        <h1>Sign in</h1>
        <form @submit.prevent="login">
            <div id="usernameInput">
                <label for="username">Username: </label>
                <input
                    type="text"
                    id="username"
                    v-model="username"
                    @focus="clearResultMessage"
                    @input="clearResultMessage"
                    required>
            </div>
            <div id="passwordInput">
                <label for="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    @focus="clearResultMessage"
                    @input="clearResultMessage"
                    required>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
    <br>
    <div id="formResult">
        <p>{{ formResult }}</p>    
    </div>
</template>