<script setup>
import {ref, watch} from "vue";
import {useUserState} from "./components/User/userState";
import {useRouter} from "vue-router";
import {generateMenu} from "./routing";

const router = useRouter();
const user = useUserState();
const drawer = ref(true);

const dynamicMenu = ref(generateMenu(user));

// Watch for changes in the user state
watch(
    () => [user.authenticated, user.budgetId, user.isOwner],
    () => {
      dynamicMenu.value = generateMenu(user);
    }
);


</script>

<template>
  <v-app>
    <!-- Application toolbar -->
    <v-app-bar :elevation="1" color="light-blue-darken-3" density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Budget Application</v-app-bar-title>
    </v-app-bar>

    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" :elevation="2" color="grey-lighten-4">
      <v-list>
        <v-list-item v-for="menuitem of dynamicMenu" :key="menuitem.path" @click="$router.push(menuitem.path)">
          <v-list-item-title><b>{{ menuitem.meta.text }}</b></v-list-item-title>
          <template v-slot:prepend>
            <v-icon>{{ menuitem.meta.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Page content -->
    <v-main class="d-flex align-start justify-start">
      <router-view></router-view>
    </v-main>


  </v-app>
</template>

<style scoped>
input, textarea, select {
  font-size: 16px;
}
</style>