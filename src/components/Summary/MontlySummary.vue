<script setup>
import {computed, defineProps, ref} from 'vue';
import {typesTrans, transTypes} from "@/components/Transaction/transactionController";
import {useUserState} from "@/components/User/userState";

// State to control visibility of details rows
const showDetails = ref({
  income: false,
  recurring: false,
  expense: true,
});

function toggleDetails(section) {
  showDetails.value[section] = !showDetails.value[section];
}

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

// Detect mobile screen width
import { onMounted, onUnmounted } from 'vue';
const isMobile = ref(window.innerWidth <= 640);
function handleResize() {
  isMobile.value = window.innerWidth <= 640;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


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
  <div class="monthly-summary-wrapper">
    <div class="table-responsive">
      <table class="summary-table">
        <thead>
        <tr>
          <th class="header-type"></th>
          <th class="header-category">Category</th>
          <th class="header-amount">Actual</th>
          <th class="header-forecast">Budget</th>
          <th class="header-balance">Balance</th>
        </tr>
        </thead>
        <tbody>
        <!-- Income -->
        <template v-if="incomeData.Categories.length > 0">
          <tr v-for="(incomeCat, index) in incomeData.Categories" :key="`income-${incomeCat.id}`" v-if="showDetails.income">
            <!-- Hide type-cell on mobile, but keep column alignment with empty td -->
            <td v-if="index === 0" class="type-cell hide-on-mobile" :rowspan="incomeData.Length">
              <div class="truncate-text">Income</div>
            </td>
            <td v-else-if="index !== 0" class="type-cell hide-on-mobile" style="display:none"></td>
            <td v-if="index === 0" class="type-cell show-on-mobile" :rowspan="incomeData.Length" style="display:none"></td>
            <td v-else-if="index !== 0" class="type-cell show-on-mobile" style="display:none"></td>
            <td class="category-cell" :colspan="isMobile ? 2 : 1">
              <div class="truncate-text">{{ incomeCat.description }}</div>
            </td>
            <td class="text-right">{{ incomeCat.actualText }}</td>
            <td class="text-right">{{ incomeCat.forecastText }}</td>
            <td class="text-right">{{ incomeCat.balanceText }}</td>
          </tr>
          <tr class="summary-row" @click="toggleDetails('income')" style="cursor:pointer;">
            <td class="toggle-cell">
              <span class="toggle-arrow" :class="{open: showDetails.income}"></span>
            </td>
            <td class="subtotal-header">
              <span v-if="!isMobile">Total Income:</span>
              <span v-else>Income:</span>
            </td>
            <td class="text-right subtotal-text">{{ Number(incomeData.TotalActual).toLocaleString("en-US", numRender) }}</td>
            <td class="text-right subtotal-text">{{ Number(incomeData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
            <td class="text-right subtotal-text">{{ Number(incomeData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
          </tr>
        </template>
          
                  <!-- Recurring -->
                  <template v-if="recurringData.Categories.length > 0">
                    <tr v-for="(recurCat, index) in recurringData.Categories" :key="`recurring-${recurCat.id}`" v-if="showDetails.recurring">
                      <!-- Hide type-cell on mobile, but keep column alignment with empty td -->
                      <td v-if="index === 0" class="type-cell hide-on-mobile" :rowspan="recurringData.Length">
                        <div class="truncate-text">Recurring</div>
                      </td>
                      <td v-else-if="index !== 0" class="type-cell hide-on-mobile" style="display:none"></td>
                      <td v-if="index === 0" class="type-cell show-on-mobile" :rowspan="recurringData.Length" style="display:none"></td>
                      <td v-else-if="index !== 0" class="type-cell show-on-mobile" style="display:none"></td>
                      <td class="category-cell" :colspan="isMobile ? 2 : 1">
                        <div class="truncate-text">{{ recurCat.description }}</div>
                      </td>
                      <td class="text-right">{{ recurCat.actualText }}</td>
                      <td class="text-right">{{ recurCat.forecastText }}</td>
                      <td class="text-right">{{ recurCat.balanceText }}</td>
                    </tr>
                    <tr class="summary-row" @click="toggleDetails('recurring')" style="cursor:pointer;">
                      <td class="toggle-cell">
                        <span class="toggle-arrow" :class="{open: showDetails.recurring}"></span>
                      </td>
                      <td class="subtotal-header">
                        <span v-if="!isMobile">Total Recurring:</span>
                        <span v-else>Recurring:</span>
                      </td>
                      <td class="text-right subtotal-text">{{ Number(recurringData.TotalActual).toLocaleString("en-US", numRender) }}</td>
                      <td class="text-right subtotal-text">{{ Number(recurringData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
                      <td class="text-right subtotal-text">{{ Number(recurringData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
                    </tr>
                  </template>
          
                  <!-- Expense -->
                  <template v-if="expenseData.Categories.length > 0">
                    <tr v-for="(expenseCat, index) in expenseData.Categories" :key="`expense-${expenseCat.id}`" v-if="showDetails.expense">
                      <!-- Hide type-cell on mobile, but keep column alignment with empty td -->
                      <td v-if="index === 0" class="type-cell hide-on-mobile" :rowspan="expenseData.Length">
                        <div class="truncate-text">Expense</div>
                      </td>
                      <td v-else-if="index !== 0" class="type-cell hide-on-mobile" style="display:none"></td>
                      <td v-if="index === 0" class="type-cell show-on-mobile" :rowspan="expenseData.Length" style="display:none"></td>
                      <td v-else-if="index !== 0" class="type-cell show-on-mobile" style="display:none"></td>
                      <td class="category-cell" :colspan="isMobile ? 2 : 1">
                        <div class="truncate-text">{{ expenseCat.description }}</div>
                      </td>
                      <td class="text-right">{{ expenseCat.actualText }}</td>
                      <td class="text-right">{{ expenseCat.forecastText }}</td>
                      <td class="text-right">{{ expenseCat.balanceText }}</td>
                    </tr>
                    <tr class="summary-row" @click="toggleDetails('expense')" style="cursor:pointer;">
                      <td class="toggle-cell">
                        <span class="toggle-arrow" :class="{open: showDetails.expense}"></span>
                      </td>
                      <td class="subtotal-header">
                        <span v-if="!isMobile">Total Expense:</span>
                        <span v-else>Expense:</span>
                      </td>
                      <td class="text-right subtotal-text">{{ Number(expenseData.TotalActual).toLocaleString("en-US", numRender) }}</td>
                      <td class="text-right subtotal-text">{{ Number(expenseData.TotalForecast).toLocaleString("en-US", numRender) }}</td>
                      <td class="text-right subtotal-text">{{ Number(expenseData.TotalBalance).toLocaleString("en-US", numRender) }}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          
<style scoped>
.slide-row-enter-active, .slide-row-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}
.slide-row-enter-from, .slide-row-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
.slide-row-enter-to, .slide-row-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toggle-cell {
  width: 1px;
  padding: 0;
  text-align: left;
  vertical-align: middle;
}
.toggle-arrow {
  display: inline-block;
  margin: 0;
  width: 7px;
  height: 7px;
  border-right: 1px solid #d57928;
  border-bottom: 1px solid #d57928;
  transform: rotate(-45deg);
  transition: transform 0.2s;
}
.toggle-arrow.open {
  transform: rotate(45deg);
}
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
          
          .monthly-summary-wrapper {
            width: 100%;
            font-family: 'Poppins', sans-serif;
            margin-bottom: 0;
          }
          
          .table-responsive {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 0;
          }
          
          .summary-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.9rem;
            text-align: left;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 0;
            table-layout: fixed;
          }
          
          .summary-table th,
          .summary-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .summary-table thead tr {
            background-color: #d57928;
            color: #ffffff;
            text-align: left;
            font-weight: 600;
            letter-spacing: 0.4px;
            font-size: 0.9rem;
            text-transform: uppercase;
          }
          
          .summary-table thead th {
            padding-top: 12px;
            padding-bottom: 12px;
          }
          
          .summary-table tbody tr {
            transition: all 0.2s ease;
          }
          
          .summary-table tbody tr:nth-of-type(even) {
            background-color: #f8f8f8;
          }
          
          .summary-table tbody tr:last-of-type {
            border-bottom: 2px solid #d57928;
          }
          
          .summary-table tbody tr:hover {
            background-color: rgba(213, 121, 40, 0.05);
            transform: translateY(-1px);
          }
          
          .text-right {
            text-align: right;
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            letter-spacing: -0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .truncate-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          
          .category-cell {
            max-width: 200px;
          }
          
          .header-type {
            width: 9%;
          }
          
          .header-category {
            width: 34%;
          }
          
          .header-amount,
          .header-forecast,
          .header-balance {
            width: 19%;
            text-align: right;
          }
          
          .type-cell {
            text-align: center;
            background-color: #d57928;
            color: #ffffff;
            font-weight: 600;
            vertical-align: middle;
            letter-spacing: 0.4px;
            text-transform: uppercase;
            font-size: 0.85rem;
          }
          /* Hide type-cell on mobile screens */
          @media (max-width: 640px) {
            .type-cell.hide-on-mobile {
              display: none !important;
            }
          }
          
          .subtotal-header {
            text-align: right;
            font-weight: 700;
            letter-spacing: 0.4px;
            padding-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .subtotal-text {
            font-weight: 700;
            letter-spacing: 0.4px;
            font-size: inherit;
          }
          
          .summary-row {
            background-color: rgba(213, 121, 40, 0.08) !important;
            border-top: 1px solid rgba(213, 121, 40, 0.3);
            border-bottom: 1px solid rgba(213, 121, 40, 0.3) !important;
          }
          
          .summary-table td {
            padding-top: 10px;
            padding-bottom: 10px;
          }
          
          @media (max-width: 768px) {
            .summary-table {
              font-size: 0.8rem;
            }
            
            .summary-table th,
            .summary-table td {
              padding: 8px 6px;
            }
            
            .summary-table thead th {
              padding-top: 10px;
              padding-bottom: 10px;
              font-size: 0.8rem;
            }
            
            .type-cell {
              font-size: 0.75rem;
            }
            
            .category-cell {
              max-width: 150px;
            }
            
            .header-category {
              width: 32%;
            }
            
            .header-type {
              width: 10%;
            }
            
            .summary-table td {
              padding-top: 8px;
              padding-bottom: 8px;
            }
            
            .text-right, .subtotal-text {
              font-size: 0.8rem;
            }
          }
          
          @media (max-width: 640px) {
            .summary-table {
              font-size: 0.75rem;
            }
            
            .summary-table th,
            .summary-table td {
              padding: 6px 4px;
            }
            
            .summary-table thead th {
              font-size: 0.75rem;
              letter-spacing: 0.2px;
              padding-top: 8px;
              padding-bottom: 8px;
            }
            
            .type-cell {
              font-size: 0.7rem;
            }
            
            .header-category {
              width: 30%;
            }
            
            .header-type {
              width: 12%;
            }
            
            .header-amount,
            .header-forecast,
            .header-balance {
              width: 19%;
            }
            
            .summary-table td {
              padding-top: 6px;
              padding-bottom: 6px;
            }
            
            .category-cell {
              max-width: 100px;
            }
            
            .text-right, .subtotal-text {
              font-size: 0.75rem;
            }
          }
          
          @media (max-width: 480px) {
            .summary-table {
              font-size: 0.7rem;
            }
            
            .summary-table th,
            .summary-table td {
              padding: 5px 3px;
            }
            
            .summary-table thead th {
              font-size: 0.65rem;
              letter-spacing: 0;
              padding-top: 6px;
              padding-bottom: 6px;
            }
            
            .type-cell {
              font-size: 0.65rem;
              letter-spacing: 0;
              padding: 2px;
            }
            
            .header-type {
              width: 11%;
            }
            
            .header-category {
              width: 29%;
            }
            
            .header-amount,
            .header-forecast,
            .header-balance {
              width: 20%;
            }
            
            .category-cell {
              max-width: 85px;
            }
            
            .text-right, .subtotal-text {
              font-size: 0.7rem;
  }
}
</style>