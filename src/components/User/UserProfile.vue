<script setup>
import {useUserState} from "./userState";

let loadedUser = useUserState();

</script>


<template>
  <v-card v-if="loadedUser" style="width:600px;" title="User Profile">
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-icon>mdi-identifier</v-icon>
          <v-list-item-title>{{ loadedUser.profile.login }}</v-list-item-title>
          <v-list-item-subtitle>User ID</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-icon>mdi-passport</v-icon>
          <v-list-item-title>{{ loadedUser.profile.fullName }}</v-list-item-title>
          <v-list-item-subtitle>Full Name</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-icon>mdi-email</v-icon>
          <v-list-item-title>{{ loadedUser.profile.publicEmail }}</v-list-item-title>
          <v-list-item-subtitle>Email</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>./userState