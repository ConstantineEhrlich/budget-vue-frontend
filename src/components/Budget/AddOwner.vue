<script setup>
    import {ref, reactive} from "vue";
    import { useUserState } from "../User/userState";
    import { useRouter } from "vue-router";
    const user = useUserState();
    const router = useRouter();

    // Loading status
    const loading = ref(true)

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
    
    async function submitForm(){
        console.log(form.values);
    }


</script>

<template>
    <v-card>
        <v-container v-if="formReject.errorPresent">
            <v-alert
                closable
                @click:close="formReject.errorPresent = false"
                title="Error!"
                :text="formReject.message"
                type="error"
            ></v-alert>
        </v-container>
        <v-container v-else-if="!formSubmit.success">
            <h3>New category</h3>
            <v-form ref="form" @submit.prevent="submitForm" :disabled="loading">
                Text
            </v-form>
        </v-container>

        <v-container v-else>
            Category added!
        </v-container>
    </v-card>
</template>