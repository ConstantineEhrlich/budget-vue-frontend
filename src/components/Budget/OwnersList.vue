<script setup>
    import { ref, reactive } from "vue";
    import { useUserState } from "../User/userState";
    import { useRouter } from "vue-router";
    import AddOwner from "./AddOwner.vue";
    import { removeOwner } from "./budgetController";

    const loadFinished = ref(false);
    const router = useRouter();

    const addOwnerDialog = ref(false);

    const user = useUserState();

    if(!user.authenticated){
        router.push("/");
    }
    
    async function refreshOwners(){
        
        addOwnerDialog.value = false;    
        loadFinished.value = false;
        await user.fetchBudget();
        loadFinished.value = true;
    }
    
    async function deleteOwner(owner){
        try{
            await removeOwner(user.budgetId, owner.id);
            await refreshOwners();
        }
        catch(e){
            console.error(e);
        }

    }

    refreshOwners();


</script>

<template>
    <v-dialog v-model="addOwnerDialog" max-width="400px">
        <AddOwner @owner-added="refreshOwners()"></AddOwner>
    </v-dialog>


    <div style="margin: 10px;" v-if="loadFinished">
        <h1>Owners</h1>
        <div class="button-container"><v-btn @click="addOwnerDialog = true">Add owner</v-btn></div>
        <div>
        <v-table height="90%" fixed-header density="compact">
            <thead>
                <tr>
                    <th class="text-left">
                        Id
                    </th>
                    <th class="text-left">
                        Name
                    </th>
                    <th class="text-left">
                        Revoke
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="owner in user.budget.owners" :key="owner.id">
                    <td>{{ owner.id }}</td>
                    <td>{{ owner.name }}</td>
                    <td class="text-center">
                        <v-icon @click="deleteOwner(owner)">mdi-account-remove</v-icon>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
    </div>
</template>

<style>
    th{
        font-weight: bold !important;
    }
    .isactive-checkbox{
        margin-bottom: -25px;
        margin-top:-5px
    }
    .button-container{
        margin: 5px;
    }
</style>