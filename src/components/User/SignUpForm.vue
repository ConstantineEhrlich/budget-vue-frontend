<script setup>
    import {ref, reactive } from "vue";
    import {userSignUp} from "./userController";
    import { useRouter } from "vue-router";
    import { rules } from "../validationRules";
    const router = useRouter();
    const signUpForm = ref(null);
    const formdata = ref({
        id: "",
        name: "",
        email: "",
        password: "",
    });


    // Form submit status
    let loading=ref(false);

    // Form submit handling
    let successRegistration = reactive({
        status: false,
        message: ""
    })
    
    let failedRegistration = reactive({
        errorPresent: false,
        message: ""
    });

    async function submitForm(){
        loading.value = true;
        const form = await signUpForm.value.validate();

        if(!form.valid){
            loading.value = false;
            failedRegistration.errorPresent = true;
            failedRegistration.message = "Please check form values!";
            return null;
        }
        
        try{
            const response = await userSignUp(formdata.value);
            successRegistration.status = true;
            successRegistration.message = response.message;
            await setTimeout(() => router.push("/login"), 1500);
        }
        catch(e){
            failedRegistration.errorPresent = true;
            // Bad request means there is issue in a form
            if(e.code==="ERR_BAD_REQUEST"){
                loading.value = false;
                failedRegistration.message = e.response.data.message;
                return null;
            }
            // Otherwise, it's unkwnown error, need to log and learn
            else{
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
            closable
            @click:close="failedRegistration.errorPresent=false"
            title="Error!"
            :text="failedRegistration.message"
            type="error"
        ></v-alert>
    </v-container>
    <v-container v-else-if="!successRegistration.status">
        <h1>Registration</h1>
        <v-form ref="signUpForm" style="max-width:400px" @submit.prevent="submitForm" :disabled="loading">
            <v-text-field
                v-model="formdata.id"
                label="Login"
                :rules="[rules.required, rules.loginLiterals, rules.loginLength]"
            ></v-text-field>
            <v-text-field
                v-model="formdata.name"
                label="Name"
                :rules="[rules.required, rules.descLength]"
            ></v-text-field>
            <v-text-field
                v-model="formdata.email"
                label="Email"
                :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-text-field
                v-model="formdata.password"
                label="Password"
                type="password"
                :rules="[rules.required]"
            ></v-text-field>
            <v-btn type="submit" :disabled="loading">
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