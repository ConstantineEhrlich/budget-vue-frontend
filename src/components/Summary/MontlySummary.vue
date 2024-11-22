<script setup>
import {computed, defineProps, ref} from 'vue';
import {typesTrans, transTypes} from "@/components/Transaction/transactionController";
import {useUserState} from "@/components/User/userState";

const numRender = {
  style: 'decimal',
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const user = useUserState();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const tableData = ref(null);


const incomeData = computed(() => {
  const result = {
    Categories: [],
    Length: 0,
    TotalActual: 0,
    TotalForecast: 0,
    TotalBalance: 0,
  };

  result.Categories = user.budget.categories.filter(category => category.defaultType === transTypes.get("Income"));

  for (const incomeCat of result.Categories) {
    const incomeAct = getCategoryData(incomeCat.id, transTypes.get("Income"));
    incomeCat.actualText = incomeAct.toLocaleString("en-US", numRender);
    const incomeFcs = getCategoryData(incomeCat.id, transTypes.get("Forecast"));
    incomeCat.forecastText = incomeFcs.toLocaleString("en-US", numRender);
    // The calculation of balance for income is reverse than for expense and recurring
    const incomeBlc = incomeAct - incomeFcs;
    incomeCat.balanceText = incomeBlc.toLocaleString("en-US", numRender);
    result.TotalActual = result.TotalActual + incomeAct;
    result.TotalForecast = result.TotalForecast + incomeFcs;
    result.TotalBalance = result.TotalBalance + incomeBlc;
  }

  result.Length = result.Categories.length;
  return result;
});

const recurringData = computed(() => {
  const result = {
    Categories: [],
    Length: 0,
    TotalActual: 0,
    TotalForecast: 0,
    TotalBalance: 0,
  };

  result.Categories = getRecurringCategories(props.data, transTypes.get("Recurring"));
  for (const recurringCat of result.Categories) {
    const recurAct = getCategoryData(recurringCat.id, transTypes.get("Recurring"));
    recurringCat.actualText = recurAct.toLocaleString("en-US", numRender);
    recurringCat.forecastText = recurringCat.actualText;
    recurringCat.balanceText = Number(0).toLocaleString("en-US", numRender);
    result.TotalActual = result.TotalActual + recurAct;
    result.TotalForecast = result.TotalForecast + recurAct;
    result.TotalBalance = 0;
  }

  result.Length = result.Categories.length;
  return result;
});

const expenseData = computed(() => {
  const result = {
    Categories: [],
    Length: 0,
    TotalActual: 0,
    TotalForecast: 0,
    TotalBalance: 0,
  };

  result.Categories = user.budget.categories.filter(category => category.defaultType === transTypes.get("Expense"));
  for (const expenseCat of result.Categories) {
    const expAct = getCategoryData(expenseCat.id, transTypes.get("Expense"));
    expenseCat.actualText = expAct.toLocaleString("en-US", numRender);
    const expFcs = getCategoryData(expenseCat.id, transTypes.get("Forecast"));
    expenseCat.forecastText = expFcs.toLocaleString("en-US", numRender);
    const expBlc = expFcs - expAct;
    expenseCat.balanceText = expBlc.toLocaleString("en-US", numRender);
    result.TotalActual = result.TotalActual + expAct;
    result.TotalForecast = result.TotalForecast + expFcs;
    result.TotalBalance = result.TotalBalance + expBlc;
  }

  result.Length = result.Categories.length;
  return result;
});

function getRecurringCategories(data, targetType) {
  const cats = new Set();

  for (const item of data) {
    if (item.type === targetType) {
      cats.add(item.categoryId);
    }
  }

  // Convert the Set to an array before returning
  const result = [];
  for(const catId of cats) {
    result.push({
      id: catId,
      description: getCategoryFromBudget(user.budget, catId).description,
    })
  }

  return result;
}

function getCategoryFromBudget(budget, catId){
  return budget.categories.find(cat => cat.id === catId);
}


// Helper to get amounts and forecasts
const getCategoryData = (categoryId, type) => {
  const entries = props.data.filter(entry => entry.categoryId === categoryId && entry.type === type);
  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
  return totalAmount;
};
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3>Monthly summary</h3>
          <table class="summary-table">
            <thead>
            <tr>
              <th class="header-type">Type</th>
              <th class="header-category">Category</th>
              <th class="header-amount">Amount</th>
              <th class="header-forecast">Forecast</th>
              <th class="header-balance">Balance</th>
            </tr>
            </thead>
            <tbody>
            <!-- Income -->
            <template v-if="incomeData.Categories.length > 0">
            <tr v-for="(incomeCat, index) in incomeData.Categories">
              <td v-if="index === 0" class="rotated-text" :rowspan="incomeData.Length">Income</td>
              <td>{{ incomeCat.description }}</td>
              <td class="text-right">{{ incomeCat.actualText }}</td>
              <td class="text-right">{{ incomeCat.forecastText }}</td>
              <td class="text-right">{{ incomeCat.balanceText }}</td>
            </tr>
            <tr>
              <td colspan="2" class="subtotal-header">TOTAL:</td>
              <td class="text-right subtotal-text">{{ Number(incomeData.TotalActual).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(incomeData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(incomeData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
            </tr>
            </template>

            <!-- Recurring -->
            <template v-if="recurringData.Categories.length > 0">
            <tr v-for="(recurCat, index) in recurringData.Categories">
              <td v-if="index === 0" class="rotated-text" :rowspan="recurringData.Length">Recurring</td>
              <td>{{ recurCat.description }}</td>
              <td class="text-right">{{ recurCat.actualText }}</td>
              <td class="text-right">{{ recurCat.forecastText }}</td>
              <td class="text-right">{{ recurCat.balanceText }}</td>
            </tr>
            <tr>
              <td colspan="2" class="subtotal-header">TOTAL:</td>
              <td class="text-right subtotal-text">{{ Number(recurringData.TotalActual).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(recurringData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(recurringData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
            </tr>
            </template>

            <!-- Expense -->
            <template v-if="expenseData.Categories.length > 0">
            <tr v-for="(expenseCat, index) in expenseData.Categories">
              <td v-if="index === 0" class="rotated-text" :rowspan="expenseData.Length">Expense</td>
              <td>{{ expenseCat.description }}</td>
              <td class="text-right">{{ expenseCat.actualText }}</td>
              <td class="text-right">{{ expenseCat.forecastText }}</td>
              <td class="text-right">{{ expenseCat.balanceText }}</td>
            </tr>
            <tr>
              <td colspan="2" class="subtotal-header">TOTAL:</td>
              <td class="text-right subtotal-text">{{ Number(expenseData.TotalActual).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(expenseData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
              <td class="text-right subtotal-text">{{ Number(expenseData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
            </tr>
            </template>

            </tbody>
          </table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

.summary-table {
  width: 60%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: .75em;
  text-align: left;
}
.summary-table th,
.summary-table td {
  padding: 12px 15px;
}
.summary-table thead tr {
  background-color: #d57928;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}
.summary-table tbody tr {
  border-bottom: 1px solid #dddddd;
}
.summary-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
.summary-table tbody tr:last-of-type {
  border-bottom: 2px solid #d57928;
}
.summary-table tbody tr:hover {
  background: #f1f1f1;
}
.text-right {
  text-align: right;
  font-family: monospace;
}

.header-type {
  width: 10%;
}

.header-amount {
  width: 12%;
}

.header-forecast {
  width: 12%;
}

.header-balance {
  width: 12%;
}

.rotated-text {
  text-align: center;
  background-color: #d57928;
  color: #ffffff;
  font-weight: bold;
}

.subtotal-header{
  background-color: #ffffff !important;
  text-align: right;
  font-weight: bolder;
}

.subtotal-text{
  font-weight: bolder;
  background-color: #ffffff !important;
}


</style>