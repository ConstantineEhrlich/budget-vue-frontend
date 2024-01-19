<script setup>
import {getAllBudgets} from './budgetController';
import {useUserState} from '../User/userState';
import {useRouter} from 'vue-router';
import AddBudget from "./AddBudget.vue";
import {ref} from "vue";
import BudgetCard from "@/components/Budget/BudgetCard.vue";

const user = useUserState();
const budgets = ref([]);
const router = useRouter();
const addDialog = ref(false);

refreshBudgets();

async function refreshBudgets() {
  addDialog.value = false;
  try {
    budgets.value = await getAllBudgets();
  } catch (e) {
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
        <BudgetCard :budget="budget" @select-budget="selectBudget(budget)"></BudgetCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>