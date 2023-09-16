<script setup>
import {defineEmits, reactive, ref} from "vue";
import {useUserState} from "../User/userState";
import {useRouter} from "vue-router";
import {addBudget} from "./budgetController";
import {rules} from "../validationRules";

const user = useUserState();
const router = useRouter();

// emit event to close the dialog
const emit = defineEmits(["budget-added"]);

// Loading status
const loading = ref(false)

const formData = reactive({
  description: "",
})

// Form reject carrier
let formReject = reactive({
  errorPresent: false,
  errorMessage: ""
});

async function submitForm() {
  try {
    loading.value = true;
    const response = await addBudget(formData.description);
    console.log(response.data);
    //user.saveBudget(response.data);
    emit("budget-added");
  } catch (e) {
    if (e.code === "ERR_BAD_REQUEST") {
      loading.value = false;
      console.log(e);
      formReject.message = e.response.data.message;
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
      <h3>New budget</h3>
      <v-form ref="form" :disabled="loading" @submit.prevent="submitForm">

        <v-text-field
            v-model="formData.description"
            :rules="[rules.required, rules.descLength]"
            label="Description"
            type="text"
        ></v-text-field>

        <v-btn :disabled="loading" type="submit">
          {{ loading ? "Loading..." : "New" }}
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>