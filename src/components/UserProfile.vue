<script setup>
    import{ref, watchEffect} from "vue";
    import { getUserProfile } from '../controllers/UserController';

    let loadedUser = ref(null);
    let isLoading = ref(true);
    let loadMessage = ref("Loading profile...");

    watchEffect(() => {console.log("User changed!", loadedUser.value)});

    getUserProfile("john").then(result => {
        isLoading.value = false;
        loadedUser.value = result;
        console.log("Result:", result);
        console.log("Result user id: ", result.id);
        console.log("Result name: ", result.name);
        console.log("Result email:", result.email);
        
    }).catch(err => {
        if(err.code === "ERR_BAD_REQUEST" && err.response.status === 401){
            isLoading = false;
            loadMessage.value = "You have to log in to view profiles!";
        }
        else{
            isLoading = false;
            loadMessage.value = "Profile can't be loaded";
            console.error(err.message);
        }
    });


</script>


<template>
    <div v-if="isLoading">{{ loadMessage }}</div>
    <div v-else id="userProfile">
        <h1>User Profile</h1>
        <p><b>User id: </b>{{ loadedUser.id }}</p><br/>
        <p><b>Name: </b>{{ loadedUser.name }}</p><br/>
        <p><b>Email: </b>{{ loadedUser.email  }}</p><br/>   </div>
</template>