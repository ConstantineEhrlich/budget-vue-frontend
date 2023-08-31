<script setup>
  import { useUserStore } from './components/User/userStore';
  const user = useUserStore();
</script>

<template>
  <nav>
    <router-link to="/">Budgets</router-link> |
    <div v-if="user.authenticated">
      <router-link to="/profile">User Profile</router-link> |
      <router-link to="/logout">Logout</router-link>
    </div>
    <div v-else>
      <router-link to="/login"> Login</router-link>
    </div>
  </nav>
  <br>
  <router-view></router-view>
</template>

<style scoped>
</style>
