<script setup>
    import {ref } from "vue";
    const formdata = ref({
        id: "",
        name: "",
        email: "",
        password: "",
    })


</script>

<template>
    <div id="signUpForm">
        <h1>Sign up</h1>
    </div>
    <br>
    <div id="formResult">
        <p>{{ formResult }}</p>    
    </div>
</template>