<script setup>
import {reactive, ref} from "vue";
import {userSignUp} from "./userController";
import {useRouter} from "vue-router";
import {rules} from "../validationRules";

const router = useRouter();
const signUpForm = ref(null);
const formdata = ref({
  id: "",
  name: "",
  email: "",
  password: "",
});


// Form submit status
let loading = ref(false);

// Form submit handling
let successRegistration = reactive({
  status: false,
  message: ""
})

let failedRegistration = reactive({
  errorPresent: false,
  message: ""
});

async function submitForm() {
  loading.value = true;
  const form = await signUpForm.value.validate();

  if (!form.valid) {
    loading.value = false;
    failedRegistration.errorPresent = true;
    failedRegistration.message = "Please check form values!";
    return null;
  }

  try {
    const response = await userSignUp(formdata.value);
    successRegistration.status = true;
    successRegistration.message = response.message;
    await setTimeout(() => router.push("/login"), 1500);
  } catch (e) {
    failedRegistration.errorPresent = true;
    // Bad request means there is issue in a form
    if (e.code === "ERR_BAD_REQUEST") {
      loading.value = false;
      failedRegistration.message = e.response.data.message;
      return null;
    }
    // Otherwise, it's unkwnown error, need to log and learn
    else {
      loading.value = false;
      console.error(e);
      failedRegistration.message = "Error occurred, please try again"
      return null;
    }
  }
}


</script>

<template>
  <v-container v-if="failedRegistration.errorPresent">
    <v-alert
        :text="failedRegistration.message"
        closable
        title="Error!"
        type="error"
        @click:close="failedRegistration.errorPresent=false"
    ></v-alert>
  </v-container>
  <v-container v-else-if="!successRegistration.status">
    <h1>Registration</h1>
    <v-form ref="signUpForm" :disabled="loading" style="max-width:400px" @submit.prevent="submitForm">
      <v-text-field
          v-model="formdata.id"
          :rules="[rules.required, rules.loginLiterals, rules.loginLength]"
          label="Login"
      ></v-text-field>
      <v-text-field
          v-model="formdata.name"
          :rules="[rules.required, rules.descLength]"
          label="Name"
      ></v-text-field>
      <v-text-field
          v-model="formdata.email"
          :rules="[rules.required, rules.email]"
          label="Email"
      ></v-text-field>
      <v-text-field
          v-model="formdata.password"
          :rules="[rules.required]"
          label="Password"
          type="password"
      ></v-text-field>
      <v-btn :disabled="loading" type="submit">
        {{ loading ? "Loading..." : "Submit" }}
      </v-btn>
    </v-form>

  </v-container>
  <v-container v-else>
    <h1>Success</h1>
    <p>{{ successRegistration.message }}</p>
    <p>You will be now redirected to the login page...</p>
  </v-container>
</template>