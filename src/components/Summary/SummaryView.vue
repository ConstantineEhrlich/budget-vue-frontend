<script setup>
import { ref } from 'vue';
import MonthlySummary from "./MontlySummary.vue";
import {useUserState} from "@/components/User/userState";
import {getSummaryByCategory, getOpeningBalance, getClosingBalance, getSummaryByOwner} from "@/components/Summary/summaryController";
import BalanceTable from "@/components/Summary/BalanceTable.vue";

const user = useUserState();
let loadFinished = ref(false);

const years = [2023, 2024, 2025];
const periods = [
  { text: 'January', value: 1 },
  { text: 'February', value: 2 },
  { text: 'March', value: 3 },
  { text: 'April', value: 4 },
  { text: 'May', value: 5 },
  { text: 'June', value: 6 },
  { text: 'July', value: 7 },
  { text: 'August', value: 8 },
  { text: 'September', value: 9 },
  { text: 'October', value: 10 },
  { text: 'November', value: 11 },
  { text: 'December', value: 12 }
];

const selectedYear = ref(years[1]);
const selectedPeriod = ref(periods[0].value);
const summaryData = ref([]);
const balanceData = ref({
  openingBalance: null,
  summaryByOwner: null,
  closingBalance: null,
});

async function updateView() {
  const year = selectedYear.value;
  const period = selectedPeriod.value;
  summaryData.value = await getSummaryByCategory(user.budgetId, year, period);

  balanceData.value.openingBalance = await getOpeningBalance(user.budgetId, year, period);
  balanceData.value.summaryByOwner = await getSummaryByOwner(user.budgetId, year, period);
  balanceData.value.closingBalance = await getClosingBalance(user.budgetId, year, period);
  loadFinished.value = true;
}

function setCurrentYearAndMonth() {
  const currentDate = new Date();
  selectedYear.value = currentDate.getFullYear();
  selectedPeriod.value = currentDate.getMonth() + 1; // getMonth() is zero-based
}

setCurrentYearAndMonth();
updateView();

</script>

<template>
  <v-container v-if="loadFinished">
    <v-row>
      <v-col cols="6">
        <v-select
            v-model="selectedYear"
            :items="years"
            label="Year"
            @update:menu="updateView"
        />
      </v-col>
      <v-col cols="6">
        <v-select
            v-model="selectedPeriod"
            :items="periods"
            item-title="text"
            item-value="value"
            label="Month"
            @update:menu="updateView"
        />
      </v-col>
    </v-row>

    <v-row>
      <BalanceTable :data="balanceData" />
    </v-row>

    <v-row>
      <v-col>
        <MonthlySummary :data="summaryData" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>