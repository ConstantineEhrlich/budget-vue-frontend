<script setup>
import {defineProps} from 'vue';
import {getAllBudgets, getMyBudgets} from './budgetController';
import {useUserState} from '../User/userState';
import {useRouter} from 'vue-router';
import {ref} from "vue";
import AddBudget from "./AddBudget.vue";
import BudgetCard from "./BudgetCard.vue";
import BudgetWindow from "./BudgetWindow.vue";

const props = defineProps({
  ownBudgetsOnly: {
    type: Boolean,
    required: true
  }
});

const user = useUserState();
const router = useRouter();
const budgets = ref([]);
const addDialogVisible = ref(false);
const selectedBudget = ref(null);
const budgetDialogVisible = ref(false);


refreshBudgets();

async function refreshBudgets() {
  addDialogVisible.value = false;
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

function cardClick(budget) {
  if (props.ownBudgetsOnly){
    selectedBudget.value = budget;
    budgetDialogVisible.value = true;
  }
  else{
    selectBudget(budget);
  }
}

function selectBudget(budget){
  user.saveBudget(budget);
  router.push("/transactions");
}

async function dialogClose(){
  budgetDialogVisible.value = false;
  await refreshBudgets();
}

</script>


<template>
  <v-dialog v-model="addDialogVisible" max-width="400px">
    <AddBudget @budget-added="refreshBudgets"/>
  </v-dialog>
  <v-dialog v-model="budgetDialogVisible" max-width="400px">
    <BudgetWindow
        :budget="selectedBudget"
        @select-budget="selectBudget"
        @close="dialogClose"/>
  </v-dialog>

  <v-container>
    <v-row>
      <v-col v-if="props.ownBudgetsOnly">
        <v-btn v-if="user.authenticated" @click="addDialogVisible = true">Add Budget</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="budget in budgets" :key="budget.id" cols="12" md="4" xs="1">
        <BudgetCard :budget="budget" @select-budget="cardClick(budget)"></BudgetCard>
      </v-col>
    </v-row>
  </v-container>
</template>