<script setup>
    import{ref} from "vue";
    import {userLogin} from "../controllers/UserController"

    let username = ref("");
    let password = ref("");
    let formResult = ref("");

    const login = () => {
        userLogin(username.value, password.value)
        .then(r => formResult.value = r.message)
        .catch(err => {
            formResult.value = "Login failed!";
        });
    }

    function clearResultMessage(){
        formResult.value = "";
    }

</script>

<template>
    <div id="loginForm">
        <h1>Sing in</h1>
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