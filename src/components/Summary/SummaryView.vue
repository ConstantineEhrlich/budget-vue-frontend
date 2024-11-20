<script setup>
import { ref } from 'vue';
import MonthlySummary from "./MontlySummary.vue";
import {useUserState} from "@/components/User/userState";

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

const user = useUserState();

function updateView() {
  const year = selectedYear.value;
  const period = selectedPeriod.value;
  summaryData.value = getMockData(year, period);
}

function setCurrentYearAndMonth() {
  const currentDate = new Date();
  selectedYear.value = currentDate.getFullYear();
  selectedPeriod.value = currentDate.getMonth() + 1; // getMonth() is zero-based
}

function getMockData(year, period) {
  return [
    {
      year: year,
      period: period,
      type: 5,
      categoryId: "salary",
      count: 1,
      amount: 120000
    },
    {
      year: year,
      period: period,
      type: 10,
      categoryId: "demo",
      count: 2,
      amount: 5774
    },
    {
      year: year,
      period: period,
      type: 10,
      categoryId: "food",
      count: 2,
      amount: 431
    }
  ];
}

setCurrentYearAndMonth();
updateView();

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-select
            v-model="selectedYear"
            :items="years"
            label="Year"
            @change="updateView"
        />
      </v-col>
      <v-col cols="6">
        <v-select
            v-model="selectedPeriod"
            :items="periods"
            item-text="text"
            item-value="value"
            label="Month"
            @change="updateView"
        />
      </v-col>
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