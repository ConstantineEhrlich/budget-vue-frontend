<script setup>
import {reactive, ref} from "vue";
import {userLogin} from "./userController"
import {useRouter} from 'vue-router';
import {useUserState} from './userState';

const loginForm = ref(null);

// Use router to redirect to next page
const router = useRouter();

let user = useUserState();

// Form data - sign-in DTO
const formData = ref({
  id: "",
  password: ""
});

// Form submit status
let loading = ref(false);

// Error carrier
let failedLogin = reactive({
  errorPresent: false,
  errorMessage: ""
})

// Validation rules
const rules = {
  // Required field
  required: value => !!value || 'Required field',
};

// Form handler
const login = async () => {
  loading.value = true;
  const form = await loginForm.value.validate();

  if (!form.valid) {
    loading.value = false;
    failedLogin.errorPresent = true;
    failedLogin.errorMessage = "Please check form values!";
    return null;
  }

  loading.value = true;
  try {
    await userLogin(formData.value);
    await user.fetchProfile();
    router.push('/profile');
  } catch (e) {
    failedLogin.errorPresent = true;
    // Bad request means there is issue in a form

    //if(e.code==="ERR_BAD_REQUEST"){
    if (e.response.data.message) {
      loading.value = false;
      console.log(e);
      failedLogin.message = e.response.data.message;
    }
    // Otherwise, it's unkwnown error, need to log and learn
    else {
      loading.value = false;
      console.error(e);
      failedLogin.message = "Error occurred, please try again";
    }
  }
};
</script>

<template>
  <v-container v-if="failedLogin.errorPresent">
    <v-alert
        :text="failedLogin.errorMessage"
        closable
        title="Error!"
        type="error"
        @click:close="failedLogin.errorPresent=false"
    ></v-alert>
  </v-container>

  <v-container v-else>
    <h1>Login</h1>
    <v-form ref="loginForm" :disabled="loading" style="max-width:400px" @submit.prevent="login">
      <v-text-field
          v-model="formData.id"
          :rules="[rules.required]"
          label="Login"
      ></v-text-field>
      <v-text-field
          v-model="formData.password"
          :rules="[rules.required]"
          label="Password"
          type="password"
      ></v-text-field>
      <v-btn :disabled="loading" type="submit">
        {{ loading ? "Loading..." : "Login" }}
      </v-btn>
    </v-form>
  </v-container>
</template>./userState