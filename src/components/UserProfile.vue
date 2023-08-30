<script setup>
    import{ref, watchEffect} from "vue";
    import { getUserProfile } from '../controllers/UserController';

    let loadedUser = ref(null);
    let isLoading = ref(true);
    let loadMessage = ref("Loading profile...");

    watchEffect(() => {console.log("User changed!", loadedUser.value)});

    getUserProfile().then(result => {
        isLoading.value = false;
        loadedUser.value = result;
        console.log("Result:", result);
        console.log("Result user id: ", result.id);
        console.log("Result name: ", result.name);
        console.log("Result email:", result.email);
        
    }).catch(err => {
        if(err.code === "ERR_BAD_REQUEST" && err.response.status === 401){
            loadMessage.value = "You have to log in to view profiles!";
        }
        else{
            loadMessage.value = "Profile can't be loaded";
            console.error(err.message);
        }
    });


</script>


<template>
    <div v-if="isLoading">{{ loadMessage }}</div>
    <div v-else id="userProfile">
        <h1>User Profile</h1>
        <p><b>User id: </b>{{ loadedUser.value.id }}</p><br/>
        <p><b>Name: </b>{{ loadedUser.value.name }}</p><br/>
        <p><b>Email: </b>{{ loadedUser.value.email  }}</p><br/>
    </div>
</template>