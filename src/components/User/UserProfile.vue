<script setup>
    import{ref, watchEffect} from "vue";
    import { getUserProfile } from './UserController';
    import { useUserStore } from "./userStore";

    let loadedUser = useUserStore();
    console.log(loadedUser.authenticated);

</script>


<template>
    <div v-if="loadedUser.authenticated" id="userProfile">
        <h1>User Profile</h1>
        <p>
            <b>User id: </b>{{ loadedUser.profile.id }}<br/>
            <b>Name: </b>{{ loadedUser.profile.name }}<br/>
            <b>Email: </b>{{ loadedUser.profile.email  }}<br/>
        </p>
    </div>
</template>