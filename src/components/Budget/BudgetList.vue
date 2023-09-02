<script setup>
    import { getAllBudgets } from './budgetController';
    import { useUserState } from '../User/userState';
    import { useRouter } from 'vue-router';
    import AddBudget from "./AddBudget.vue";
    import {ref} from "vue";
    const user = useUserState();
    const budgets = ref([]);
    const router = useRouter();
    const addDialog = ref(false);

    refreshBudgets();

    async function refreshBudgets(){
        addDialog.value = false;
        try{
            budgets.value = await getAllBudgets();
        }
        catch(e){
            console.error(e);
        }
    }

    const selectBudget = (budget) => {
        user.saveBudget(budget);
        router.push("/transactions");
    };


</script>

<template>
    <v-dialog v-model="addDialog" max-width="400px">
        <AddBudget @budget-added="refreshBudgets"></AddBudget>
    </v-dialog>
    <v-container>
        <v-row>
            <v-col>
                <v-btn v-if="user.authenticated" @click="addDialog = true">Add Budget</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="budget in budgets" :key="budget.id" cols="12" md="4" xs="1">
                <v-card :title="budget.slug" @click="selectBudget(budget)">
                    <v-card-text>
                        <h2>{{ budget.description }}</h2>
                        <p>
                            <b>Categories:</b> {{ budget.categories.map(cat => cat.id).join(", ") }}.
                        </p>
                        <v-list density="compact">
                            <h4>Owners:</h4>
                            <v-list-item v-for="owner in budget.owners" :key="owner.id">
                                <b>{{ owner.name }}</b> {{ owner.email }}
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
</style>