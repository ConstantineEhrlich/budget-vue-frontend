<script setup>
import {defineEmits, reactive, ref} from "vue";
import {useUserState} from "../User/userState";
import {useRouter} from "vue-router";
import {rules} from "../validationRules";
import {transTypes, typesTrans} from "../Transaction/transactionController";
import {addCategory, updateCategory} from "./categoryController";

const props = defineProps(["isEditMode", "category"]);
const emit = defineEmits(["dialog-finished", "dialog-cancelled"]);
const user = useUserState();
const router = useRouter();

let dialogType; // "Add" or "Update"

// Define dialog mode
if (props.isEditMode && props.category) { // Edit mode
  dialogType = "Update";
} else { // Add mode
  dialogType = "Add"
}

// object to access form validation functions
const form = ref(null);

// object to hold form values
const formData = reactive({
  id: props.category?.id ?? "",
  description: props.category?.description ?? "",
  defaultType: typesTrans.get(props.category?.defaultType) ?? "Expense"
})

// Loading status
const loading = ref(false)

// Form reject carrier
let formReject = reactive({
  errorPresent: false,
  errorMessage: ""
});

// Submit form function
async function submitForm() {
  loading.value = true;

  // Validate form values
  const formResult = await form.value.validate();
  if (!formResult.valid) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Please check form values!";
    return null;
  }

  // Try to submit the form
  try {
    if (props.isEditMode) { // Update existing category
      const payload = {
        description: formData.description,
        defaultType: transTypes.get(formData.defaultType)
      }
      await updateCategory(user.budgetId, props.category.id, payload);
    } else { // Create a new category
      const payload = {
        categoryId: formData.id,
        description: formData.description,
        defaultType: transTypes.get(formData.defaultType)
      };
      await addCategory(user.budgetId, payload);
    }

    emit("dialog-finished");
  } catch (e) {
    // Bad request means there is error in the data
    if (e.code === "ERR_BAD_REQUEST") {
      loading.value = false;
      console.log(e);
      formReject.message = e.response.data.message;
      formReject.errorPresent = true;
      return null;
    }
    // Any other error means there is something else wrong
    else {
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

        <v-row dense>
          <v-col>
            <h2>{{ dialogType }} category</h2>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <template v-if="!props.isEditMode">
              <v-text-field
                  v-model="formData.id"
                  :rules="[rules.required, rules.loginLiterals]"
                  label="Category ID"
                  type="text"
              ></v-text-field>
            </template>

            <template v-else>
              <p>
                <b>Category ID:</b> <span class="monospace">{{ props.category.id }}</span>
              </p>
            </template>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <v-text-field
                v-model="formData.description"
                :rules="[rules.required]"
                label="Description"
                type="text"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <v-select
                v-model="formData.defaultType"
                :items="Array.from(transTypes.keys())"
                label="Default type"
            ></v-select>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <v-btn :disabled="loading" type="submit">
              {{ loading ? "Loading..." : dialogType }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="emit('dialog-cancelled')">
              Cancel
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

      </v-form>

    </v-container>
  </v-card>
</template>

<style scoped>
.monospace {
  font-family: monospace;
}
</style>