<script setup>
    import { getAllBudgets } from './budgetController';
    import { useUserState } from '../User/userState';
    import { useRouter } from 'vue-router';
    import {ref} from "vue";
    const user = useUserState();
    const budgets = ref([]);
    const router = useRouter();
    getAllBudgets().then(r => budgets.value = r).catch(e => console.error(e));

    const selectBudget = (budgetId) => {
        user.saveBudget(budgetId);
        router.push("/transactions");
    };


</script>

<template>
    <v-container>
        <v-row>
            <v-col v-for="budget in budgets" :key="budget.id" cols="12" md="4" xs="1">
                <v-card :title="budget.slug" @click="selectBudget(budget.id)">
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