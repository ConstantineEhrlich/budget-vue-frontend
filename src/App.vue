<script setup>
  import { ref, watch } from "vue";
  import { useUserState } from "./components/User/userState";
  import { useRouter } from "vue-router";
  import { generateMenu } from "./routing";

  const router = useRouter();
  const user = useUserState();
  const drawer = ref(true);

  const dynamicMenu = ref(generateMenu(user));

  // Watch for changes in the user state
  watch(
    () => [user.authenticated, user.budgetId, user.isOwner],
    () => { dynamicMenu.value = generateMenu(user); }
  );

 

</script>

<template>
  <v-app>
    <v-app-bar color="surface-variant" scroll-behavior="elevate" density="compact">
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>Budget Application</v-toolbar-title>
      </v-app-bar>

      <!-- Application toolbar -->


      <!-- Navigation items -->
      <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-item v-for="menuitem of dynamicMenu" :key="menuitem.path" @click="$router.push(menuitem.path)">
            <v-list-item-title><b>{{ menuitem.meta.text }}</b></v-list-item-title>
            <template v-slot:prepend>
              <v-icon>{{ menuitem.meta.icon }}</v-icon>  
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>



      <v-main class="d-flex align-start justify-start">
        <!-- Page content -->
        <router-view></router-view>
      </v-main>


  </v-app>
</template>

<style scoped></style>