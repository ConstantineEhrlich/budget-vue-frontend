<script setup>
    import { useUserState } from "./userState";

    let loadedUser = useUserState();
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
</template>./userState