<script setup>
  import { ref } from "vue";
  import { useUserState } from "./components/User/userState";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const user = useUserState();
  const drawer = ref(true);
</script>

<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar app>
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>Budget Frontend</v-toolbar-title>
      </v-app-bar>

    <!-- Navigation items -->
    <v-navigation-drawer v-model="drawer" app>  
      <v-list>

        <!-- Home - budgets item -->
        <v-list-item @click="$router.push('/')">
          <v-icon>mdi-cash-multiple</v-icon>
          <v-list-item-title>Budgets</v-list-item-title>
        </v-list-item>
        
        <!-- If authenticated  - display profile item -->
        <v-list-item v-if="user.authenticated" @click="$router.push('/profile')">
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>User Profile</v-list-item-title>
        </v-list-item>

        <!-- If autheicated - display logout item -->
        <v-list-item v-if="user.authenticated" @click="$router.push('/logout')">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>

        <!-- If not authenticated - display login item -->
        <v-list-item v-else @click="$router.push('/login')">
          <v-icon>mdi-login</v-icon>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>



    <v-main>
      <!-- Page content -->
      <router-view></router-view>
    </v-main>


  </v-layout>
  </v-app>
</template>

<style scoped>
</style>
./components/User/userState