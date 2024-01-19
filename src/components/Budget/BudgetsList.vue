<script setup>
import {defineProps} from 'vue';
import {getAllBudgets, getMyBudgets} from './budgetController';
import {useUserState} from '../User/userState';
import {useRouter} from 'vue-router';
import {ref} from "vue";
import AddBudget from "./AddBudget.vue";
import BudgetCard from "./BudgetCard.vue";

const props = defineProps({
  ownBudgetsOnly: {
    type: Boolean,
    required: true
  }
});

const user = useUserState();
const router = useRouter();
const budgets = ref([]);
const addDialog = ref(false);


refreshBudgets();

async function refreshBudgets() {
  addDialog.value = false;
  try {
    if (props.ownBudgetsOnly){
      budgets.value = await getMyBudgets();
    }
    else{
      budgets.value = await getAllBudgets();
    }
    
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
      <v-col v-if="props.ownBudgetsOnly">
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