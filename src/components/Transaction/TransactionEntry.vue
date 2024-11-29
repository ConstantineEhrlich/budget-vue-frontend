<script setup>
import {reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useUserState} from "../User/userState";
import {addTransaction, transTypes} from "./transactionController";
import {rules} from "../validationRules";

const user = useUserState();
const router = useRouter();
const transactionForm = ref(null);

// Form data

const formdata = reactive({
  category: "",
  amount: null,
  date: get_date_with_offset(),
  description: "",
  transactionType: "",
  owner: ""
});
const owners = ref([]);

function get_date_with_offset(){
  // calculate local time in ISO format (SO 12413243) - including tz offset
  const utcDate = new Date();
  const offset = utcDate.getTimezoneOffset() * 60 * 1000;
  return new Date(utcDate - offset);
}


// This variable is used to prevent form interaction while loading
let loading = ref(true);

// If this page is accessed directly, the user state is not loaded yet
// Therefore, before adding a transaction, fetch user profile
user.fetchProfile().then(() => {
  // If user not authenticated or budget not selected or not owner
  if (!user.authenticated || user.budgetId == null || !user.isOwner) {
    router.push("/");
  }
  // Else - fetch categories and owners
  else {
    loading.value = false;
    owners.value = user.budget.owners;
    formdata.owner = user.budget.owners.filter(o => o.id === user.profile.login)[0].name;
    refreshCategories();
    formdata.transactionType = "Expense"
  }
});


// Categories management

const categories = ref([]);

function refreshCategories() {
  let cats = user.budget.categories
      .filter(c => c.isActive);
  switch (formdata.transactionType) {
    case "Income":
      categories.value = cats.filter(c => c.defaultType === 5).map(c => c.description);
      break;
    case "Expense":
      categories.value = cats.filter(c => c.defaultType === 10).map(c => c.description);
      break;
    default:
      categories.value = cats.map(c => c.description);
      break;
  }
}

// watch for changes in formdata.transtype and call refresh categories
watch(
    () => formdata.transactionType,
    () => {
      refreshCategories();
    }
)

// Form submit carrier
let formSubmit = reactive({
  success: false,
  message: ""
})

// Form reject carrier
let formReject = reactive({
  errorPresent: false,
  errorMessage: ""
});


// Form submit action
async function submitForm() {
  loading.value = true;
  const form = await transactionForm.value.validate();

  if (!form.valid) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Please check form values!";
    return null;
  }

  // check if transaction type has changed
  if (!Array.from(transTypes.keys()).includes(formdata.transactionType)) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Invalid type, please pick one from the list!";
    return null;
  }

  // check if selected category value has changed
  if (!user.budget.categories.map(c => c.description).includes(formdata.category)) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Invalid category, please pick one from the list!";
    return null;
  }

  // check if owner has changed
  if (!owners.value.map(o => o.name).includes(formdata.owner)) {
    loading.value = false;
    formReject.errorPresent = true;
    formReject.message = "Invalid owner, please pick one from the list!";
    return null;
  }

  // try submitting the form
  try {

    const transactionDate = new Date();
    const payload = {
      categoryId: user.budget.categories.filter(c => c.description === formdata.category)[0].id,
      amount: formdata.amount,
      description: formdata.description,
      transactionType: transTypes.get(formdata.transactionType),
      ownerId: user.budget.owners.filter(o => o.name === formdata.owner)[0].id,
      date: formdata.date.toISOString(),
      year: formdata.date.getFullYear(),
      period: formdata.date.getMonth() + 1
    };

    const response = await addTransaction(user.budgetId, payload);
    loading.value = false;
    formSubmit.success = true;
    formSubmit.message = "Transaction saved!";
    await setTimeout(() => router.push("/transactions"), 1000);
  } catch (e) {
    if (e.code === "ERR_BAD_REQUEST") {
      loading.value = false;
      formReject.errorPresent = true;
      formReject.message = e.response.data.message;
      return null;
    } else {
      loading.value = false;
      console.error(e);
      formReject.errorPresent = true;
      formReject.message = "Error occurred, please try again";
    }
  }
}


</script>

<template>
  <v-container v-if="formReject.errorPresent">
    <v-alert :text="formReject.message" closable title="Error!"
             type="error" @click:close="formReject.errorPresent = false; loading = false"></v-alert>
  </v-container>

  <v-container v-else-if="!formSubmit.success">
    <h1>New entry</h1>
    <p v-if="user.budget"><b>Budget file:</b> {{ user.budget.slug }} </p><br>
    <v-form ref="transactionForm" :disabled="loading" style="max-width:400px" @submit.prevent="submitForm">
      <v-combobox
          v-model="formdata.owner"
          :items="owners.map(o => o.name)"
          :rules="[rules.required]"
          label="Owner"
      ></v-combobox>

      <v-combobox
          v-model="formdata.transactionType"
          :clearable="false"
          :items="Array.from(transTypes.keys())"
          :rules="[rules.required]"
          label="Type"></v-combobox>

      <v-combobox
          v-model="formdata.category"
          :clearable="false"
          :items="categories"
          :rules="[rules.required]"
          label="Category"></v-combobox>


      <v-text-field
          v-model="formdata.amount"
          :rules="[rules.isNumber]"
          :step="10"
          inputmode="decimal"
          label="Amount"
          type="number"></v-text-field>

      <v-textarea
          v-model="formdata.description"
          :rules="[rules.detailsLength]"
          label="Description"
          type="text"

      ></v-textarea>

      <v-expansion-panels>
        <v-expansion-panel style="margin-bottom: 15px">
          <v-expansion-panel-title>
            Date: {{formdata.date.toLocaleDateString("en-IL")}}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-date-picker
                v-model="formdata.date"
                :disabled="loading"
                label="Transaction Date"
                scrollable
                :rules="[rules.validDate]"
            ></v-date-picker>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-btn :disabled="loading" type="submit">
        {{ loading ? "Loading..." : "Submit" }}
      </v-btn>

    </v-form>
  </v-container>

  <v-container v-else>
    <h1>Success</h1>
    <p>{{ formSubmit.message }}</p>
  </v-container>
</template>

<style scoped>
.v-combobox input{
  font-size: 16px !important;
}
</style>