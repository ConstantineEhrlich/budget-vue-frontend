<script setup>
import {defineEmits, reactive, ref} from "vue";
import {useUserState} from "../User/userState";
import {useRouter} from "vue-router";
import {rules} from "../validationRules";
import {transTypes} from "../Transaction/transactionController";
import {addCategory} from "./categoryController";

const user = useUserState();
const router = useRouter();
const form = ref(null);

// emit allows binding event to the component
const emit = defineEmits(["category-added"]);

const formData = reactive({
  id: "",
  description: "",
  defaultType: "Expense"
})

// Loading status
const loading = ref(false)

// Form reject carrier
let formReject = reactive({
  errorPresent: false,
  errorMessage: ""
});

async function submitForm() {
  loading.value = true;
  const formResult = await form.value.validate();

  if (!formResult.valid) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Please check form values!";
    return null;
  }

  // Check that selected type is not changed
  if (!Array.from(transTypes.keys()).includes(formData.defaultType)) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Invalid type, please pick one from the list!";
    return null;
  }

  try {
    const payload = {
      categoryId: formData.id,
      description: formData.description,
      defaultType: transTypes.get(formData.defaultType)
    };
    console.log(user.budgetId);
    console.log(payload);
    await addCategory(user.budgetId, payload);
    emit("category-added");
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
      <v-form ref="form" :disabled="loading" @submit.prevent="submitForm">
        <h3>Add category</h3><br>
        <v-text-field
            v-model="formData.id"
            :rules="[rules.required, rules.loginLiterals]"
            label="Category id"
            type="text"
        ></v-text-field>
        <v-text-field
            v-model="formData.description"
            :rules="[rules.required]"
            label="Description"
            type="text"
        ></v-text-field>
        <v-combobox
            v-model="formData.defaultType"
            :items="Array.from(transTypes.keys())"
        ></v-combobox>
        <v-btn :disabled="loading" type="submit">
          {{ loading ? "Loading..." : "Add" }}
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>