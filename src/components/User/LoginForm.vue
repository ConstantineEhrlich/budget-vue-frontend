<script setup>
    import{ref} from "vue";
    import {userLogin} from "./UserController"
    import {useRouter} from 'vue-router';
    import {useUserState} from './userState';
    const router = useRouter();

    let username = ref("");
    let password = ref("");
    let formResult = ref("");

    let user = useUserState();

    const login = async () => {
        try {
            await userLogin(username.value, password.value);
            await user.fetchProfile();
            router.push('/');
        } catch (error) {
            formResult.value = "Login failed!";
        }
        };


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
</template>./userState