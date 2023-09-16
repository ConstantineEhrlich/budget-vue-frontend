<script setup>
import {reactive, ref} from "vue";
import {useUserState} from "../User/userState";
import {useRouter} from "vue-router";
import {rules} from "../validationRules";
import {addOwner} from "./budgetController";

const user = useUserState();
const router = useRouter();
const form = ref(null);

// emit event to close the dialog
const emit = defineEmits(["owner-added"]);

// Loading status
const loading = ref(false)

// Form data
const formData = reactive({
  userid: "",
})

// Form reject carrier
let formReject = reactive({
  errorPresent: false,
  errorMessage: ""
});

async function submitForm() {
  loading.value = true;

  // validate form
  const formResult = await form.value.validate();
  if (!formResult.valid) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Please check form values!";
    return null;
  }

  try {
    loading.value = true;
    const response = await addOwner(user.budgetId, formData.userid);
    emit("owner-added");
  } catch (e) {
    if (e.code === "ERR_BAD_REQUEST") {
      loading.value = false;
      console.log(e);
      formReject.message = e.response.data.message ?? "User not found";
      formReject.errorPresent = true;
      return null;
    } else {
      loading.value = false;
      console.error(e);
      formReject.message = "Error occurred, please try again";
      formReject.errorPresent = true;
      return null;
    }
  }
}


</script>

<template>
  <v-card>
    <v-container v-if="formReject.errorPresent">
      <v-alert
          :text="formReject.message"
          closable
          title="Error!"
          type="error"
          @click:close="formReject.errorPresent = false"
      ></v-alert>
    </v-container>
    <v-container v-else>
      <h3>Add owner</h3>
      <v-form ref="form" :disabled="loading" @submit.prevent="submitForm">
        <v-text-field
            v-model="formData.userid"
            :rules="[rules.required, rules.loginLiterals]"
            label="User ID"
            type="text"
        ></v-text-field>

        <v-btn :disabled="loading" type="submit">
          {{ loading ? "Loading..." : "Add" }}
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>