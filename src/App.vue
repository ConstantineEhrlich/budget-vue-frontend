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

      <!-- Application toolbar -->
      <v-app-bar color="surface-variant">
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>Budget Application</v-toolbar-title>
      </v-app-bar>

      <!-- Navigation items -->
      <v-navigation-drawer v-model="drawer">
        <v-list>
          <div>
            <!-- Home - budgets item -->
            <v-list-item @click="$router.push('/')">
              <v-icon>mdi-cash-multiple</v-icon>
              <v-list-item-title>All Budgets</v-list-item-title>
            </v-list-item>

            <!-- Transactions - shows only if "budgetSelected" is true -->
            <v-list-item v-if="user.budgetId != null" @click="$router.push('/transactions')">
              <v-icon>mdi-format-list-bulleted-type</v-icon>
              <v-list-item-title>Transactions</v-list-item-title>
            </v-list-item>
          </div>


          <!-- If authenticated  -->
          <div v-if="user.authenticated">

            <!-- Add transaction - -->
            <v-list-item v-if="user.isOwner" @click="router.push('/add')">
              <v-icon>mdi-receipt-text-plus</v-icon>
              <v-list-item-title>Add transaction</v-list-item-title>
            </v-list-item>

            <!-- User profile -->
            <v-list-item @click="$router.push('/profile')">
              <v-icon>mdi-account</v-icon>
              <v-list-item-title>User Profile</v-list-item-title>
            </v-list-item>

            <!-- Logout -->
            <v-list-item @click="$router.push('/logout')">
              <v-icon>mdi-logout</v-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </div>

          <!-- If not authenticated -->
          <div v-else>
            <!-- Login item -->
            <v-list-item @click="$router.push('/login')">
              <v-icon>mdi-login</v-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>

            <!-- Sign up item -->
            <v-list-item @click="$router.push('/signup')">
              <v-icon>mdi-account-plus</v-icon>
              <v-list-item-title>Sign up</v-list-item-title>
            </v-list-item>
          </div>

        </v-list>
      </v-navigation-drawer>



      <v-main class="d-flex align-start justify-start">
        <!-- Page content -->
        <router-view></router-view>
      </v-main>


    </v-layout>
  </v-app>
</template>

<style scoped></style>