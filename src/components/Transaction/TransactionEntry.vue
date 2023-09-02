<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserState } from "../User/userState";
import { addTransaction } from "./transactionController";
import { rules } from "../validationRules";
import { transTypes } from "./transactionController";
const user = useUserState();
const router = useRouter();
const transactionForm = ref(null);

// Form data

const formdata = reactive({
    category: "",
    amount: null,
    description: "",
    transactionType: "Expense",
    owner: ""
});
const owners = ref([]);


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
        formdata.owner = user.budget.owners.filter(o => o.id === user.profile.id)[0].name;
        refreshCategories();
    }
});


// Categories management

const categories = ref([]);

function refreshCategories() {
    let cats = user.budget.categories
        .filter(c => c.isActive);
    switch (formdata.transactionType) {
        case "Income":
            categories.value = cats.filter(c => c.defaultType == 5).map(c => c.description);
            break;
        case "Expense":
            categories.value = cats.filter(c => c.defaultType == 10).map(c => c.description);
            break;
        case "Forecast":
            categories.value = cats.map(c => c.description);
            break;
    }
}
// watch for changes in formdata.transtype and call refresh categories
watch(
    () => formdata.transactionType,
    () => { refreshCategories(); }
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

    if(!form.valid){
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
    if (!owners.value.map(o => o.name).includes(formdata.owner)){
        loading.value = false;
        formReject.errorPresent = true;
        formReject.message = "Invalid owner, please pick one from the list!";
        return null;
    }
    
    // try submitting the form
    try {
        // calculate local time in ISO format (SO 12413243) - including tz offset
        const t = new Date();
        const offset = t.getTimezoneOffset() * 60 * 1000;
        const tLocal = new Date(t - offset);


        const transactionDate = new Date();
        const payload = {
            categoryId: user.budget.categories.filter(c => c.description == formdata.category)[0].id,
            amount: formdata.amount,
            description: formdata.description,
            transactionType: transTypes.get(formdata.transactionType),
            ownerId: user.budget.owners.filter(o => o.name === formdata.owner)[0].id,
            date: tLocal.toISOString(),
            year: tLocal.getFullYear(),
            period: tLocal.getMonth() + 1
        };
        
        const response = await addTransaction(user.budgetId, payload);
        loading.value = false;
        formSubmit.success = true;
        formSubmit.message = "Transaction saved!";
        await setTimeout(() => router.push("/transactions"), 1000);
    }
    catch (e) {
        if (e.code === "ERR_BAD_REQUEST") {
            loading.value = false;
            formReject.errorPresent = true;
            formReject.message = e.response.data.message;
            return null;
        }
        else {
            loading.value = false;
            console.error(e);
            formReject.errorPresent = true;
            formReject.message = "Error occured, please try again";
        }
    }
}



</script>

<template>
    <v-container v-if="formReject.errorPresent">
        <v-alert closable @click:close="formReject.errorPresent = false; loading = false" title="Error!"
            :text="formReject.message" type="error"></v-alert>
    </v-container>

    <v-container v-else-if="!formSubmit.success">
        <h1>New entry</h1>
        <p v-if="user.budget"><b>Budget file:</b> {{ user.budget.slug }} </p><br>
        <v-form ref="transactionForm" style="max-width:400px" @submit.prevent="submitForm" :disabled="loading">
            <v-combobox
                v-model="formdata.owner"
                label="Owner"
                :rules="[rules.required]"
                :items="owners.map(o => o.name)"
            ></v-combobox>

            <v-combobox
                v-model="formdata.transactionType"
                label="Type"
                :rules="[rules.required]"
                :items="Array.from(transTypes.keys())"
                :clearable="false"></v-combobox>
            
            <v-combobox
                v-model="formdata.category"
                label="Category"
                :items="categories"
                :rules="[rules.required]"
                :clearable="false"></v-combobox>


            <v-text-field
                v-model="formdata.amount"
                type="number"
                :step="10"
                label="Amount"
                :rules="[rules.isNumber]"
                inputmode="decimal"></v-text-field>
            
            <v-textarea
                v-model="formdata.description"
                type="text"
                label="Description"
                :rules="[rules.detailsLength]"

            ></v-textarea>

            <v-btn type="submit" :disabled="loading">
                {{ loading ? "Loading..." : "Submit" }}
            </v-btn>

        </v-form>
    </v-container>

    <v-container v-else>
        <h1>Success</h1>
        <p>{{ formSubmit.message }}</p>
    </v-container>
</template>