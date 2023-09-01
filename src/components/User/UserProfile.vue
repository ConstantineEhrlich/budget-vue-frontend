<script setup>
    import { useUserState } from "./userState";

    let loadedUser = useUserState();

</script>


<template>
    <v-card title="User Profile" style="width:600px;">
        <v-card-text>
            <v-list>
                <v-list-item>
                    <v-icon>mdi-identifier</v-icon>
                    <v-list-item-title>{{ loadedUser.profile.id }}</v-list-item-title>
                    <v-list-item-subtitle>User ID</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-icon>mdi-passport</v-icon>
                    <v-list-item-title>{{ loadedUser.profile.name }}</v-list-item-title>
                    <v-list-item-subtitle>Full Name</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-icon>mdi-email</v-icon>
                    <v-list-item-title>{{ loadedUser.profile.email }}</v-list-item-title>
                    <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>./userState