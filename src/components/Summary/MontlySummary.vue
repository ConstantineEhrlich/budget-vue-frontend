<script setup>
import {computed, defineProps, ref} from 'vue';
import {typesTrans, transTypes} from "@/components/Transaction/transactionController";
import {useUserState} from "@/components/User/userState";

const numRender = {
  style: "decimal",
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

// Filter and group categories by type
const calculateDataByCategory = computed(() => {
  const groups = {
    Income: [],
    Recurring: [],
    Expense: []
  };

  groups.Income = user.budget.categories.filter(category => category.defaultType === transTypes.get("Income"));
  for (const category of groups.Income) {
    category.actual = Number(getCategoryData(category.id, transTypes.get("Income")));
    category.actualText = Number(category.actual).toLocaleString("en-US", numRender);
    category.forecast =  Number(getCategoryData(category.id, transTypes.get("Forecast")));
    category.forecastText = Number(category.forecast).toLocaleString("en-US", numRender);
    // The calculation of balance for income is reverse than for expense
    category.balanceText = Number(category.actual - category.forecast).toLocaleString("en-US", numRender);
  }

  groups.Expense = user.budget.categories.filter(category => category.defaultType === transTypes.get("Expense"));
  for (const category of groups.Expense) {
    category.actual = Number(getCategoryData(category.id, transTypes.get("Expense")));
    category.actualText = Number(category.actual).toLocaleString("en-US", numRender);
    category.forecast =  Number(getCategoryData(category.id, transTypes.get("Forecast")));
    category.forecastText = Number(category.forecast).toLocaleString("en-US", numRender);
    category.balanceText = Number(category.forecast - category.actual).toLocaleString("en-US", numRender);
  }


  groups.Recurring = getRecurringCategories(props.data, transTypes.get("Recurring"));
  for (const category of groups.Recurring) {
    category.actualText = Number(getCategoryData(category.id, transTypes.get("Recurring")));
    category.actual = Number(category.actual).toLocaleString("en-US", numRender);
    category.forecastText = category.actual;
    category.balanceText = Number(0).toLocaleString("en-US", numRender);
  }

  return groups;
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
  cats.forEach(categoryId => result.push(getCategoryFromBudget(user.budget, categoryId)));

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
            <tr v-for="category in calculateDataByCategory.Income" :key="category.id">
              <td>Income</td>
              <td>{{ category.description }}</td>
              <td class="text-right">{{ category.actualText }}</td>
              <td class="text-right">{{ category.forecastText }}</td>
              <td class="text-right">{{ category.balanceText }}</td>
            </tr>

            <!-- Recurring -->
            <tr v-for="category in calculateDataByCategory.Recurring" :key="category.id">
              <td>Recurring</td>
              <td>{{ category.description }}</td>
              <td class="text-right">{{ category.actualText }}</td>
              <td class="text-right">{{ category.forecastText }}</td>
              <td class="text-right">{{ category.balanceText }}</td>
            </tr>

            <!-- Expense -->
            <tr v-for="category in calculateDataByCategory.Expense" :key="category.id">
              <td>Expense</td>
              <td>{{ category.description }}</td>
              <td class="text-right">{{ category.actualText }}</td>
              <td class="text-right">{{ category.forecastText }}</td>
              <td class="text-right">{{ category.balanceText }}</td>
            </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

.summary-table {
  width: 65%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: .85em;
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

</style>