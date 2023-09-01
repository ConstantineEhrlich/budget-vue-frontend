<script setup>
    import { ref, reactive } from "vue";
    import { useRouter } from "vue-router";
    import { useUserState } from "../User/userState";
    import { transTypes, addTransaction } from "./transactionController";
    import {rules} from "../validationRules";
    const user = useUserState();
    const router = useRouter();

    // If this page is accessed directly, the user state is not loaded yet
    // Therefore, before adding a transaction, fetch user profile
    user.fetchProfile().then(() => {
        // If user not authenticated or budget not selected or not owner
        if(!user.authenticated || user.budgetId == null || !user.isOwner){
            router.push("/");
        };
    });
    

    
    // Form submit status
    let loading=ref(false);

    // Form submit handling
    let formSubmit = reactive({
        success: false,
        message: ""
    })

    // Form reject handling
    let formReject = reactive({
        errorPresent: false,
        errorMessage: ""
    });


    // Form data
    const formdata =ref({
        categoryId: "",
        amount: null,
        description: "",
        transactionType: 0,
        ownerId: "",
        date: null,
        year: null,
        period: null,
    });

    // Form submit action
    async function submitForm(){
        loading.value = true;
        try{
            const response = await addTransaction(user.budgetId, formdata);
            loading.value = false;
            formSubmit.success = true;
            formSubmit.message = "Transaction saved!";
        }
        catch(e){
            if(e.code==="ERR_BAD_REQUEST"){
                loading.value = false;
                formReject.errorPresent = true;
                formReject.message = e.response.data.message;
                return null;
            }
            else{
                loading.value = false;
                console.error(e);
                formReject.message = "Error occured, please try again"
            }
        }

    }
    


    
    
</script>

<template>
    <v-container v-if="formReject.errorPresent">
        <v-alert
            closable
            @click:close="formReject.errorPresent=false"
            title="Error!"
            :text="formReject.message"
            type="error"
        ></v-alert>
    </v-container>

    <v-container v-else-if="!formSubmit.success">
        <h1>New entry</h1>
        <v-form style="max-width:400px" @submit.prevent="submitForm" :disabled="loading">
            <v-text-field
                v-model="formdata.amount"
                type="number"
                :step="10"
                label="Amount"
                :rules="[rules.isNumber]"
                inputmode="decimal"
            ></v-text-field>
        </v-form>
    </v-container>

    <v-container v-else>
        <h1>Success</h1>
        <p>{{ formSubmit.message }}</p>
  </v-container>

</template>