<script setup>
import { ref } from 'vue';
import MonthlySummary from "./MontlySummary.vue";
import {useUserState} from "@/components/User/userState";

import {getSummaryByCategory, getOpeningBalance, getClosingBalance, getSummaryByOwner} from "@/components/Summary/summaryController";
import BalanceTable from "@/components/Summary/BalanceTable.vue";

const user = useUserState();
let loadFinished = ref(false);
const loading = ref(false);

const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - 4 + i);
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
  loading.value = true;
  const year = selectedYear.value;
  const period = selectedPeriod.value;
  
  try {
    summaryData.value = await getSummaryByCategory(user.budgetId, year, period);

    balanceData.value.openingBalance = await getOpeningBalance(user.budgetId, year, period);
    balanceData.value.summaryByOwner = await getSummaryByOwner(user.budgetId, year, period);
    balanceData.value.closingBalance = await getClosingBalance(user.budgetId, year, period);
    loadFinished.value = true;
  } finally {
    loading.value = false;
  }
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
  <v-container fluid class="summary-container" v-if="loadFinished">
    <v-row justify="center" class="summary-row--compact">
      <v-col cols="12" md="6" lg="5" xl="4" class="summary-col--compact">
        <v-card elevation="3" class="date-selector-card">
          <v-card-text class="pa-4">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="auto" class="pr-4">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Year"
          variant="outlined"
          density="compact"
          :menu-props="{ maxHeight: 200, contentClass: 'compact-select-menu' }"
          hide-details
          class="year-select"
          @update:model-value="updateView"
        />
              </v-col>
              <v-col cols="auto">
        <v-select
          v-model="selectedPeriod"
          :items="periods"
          item-title="text"
          item-value="value"
          label="Month"
          variant="outlined"
          density="compact"
          :menu-props="{ maxHeight: 200, contentClass: 'compact-select-menu' }"
          hide-details
          class="month-select"
          @update:model-value="updateView"
        />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-row class="summary-row--compact">
      <v-col cols="12" class="summary-col--compact">
  <v-card elevation="3" class="summary-card monthly-summary-card">
          <v-card-text class="table-container">
            <MonthlySummary :data="summaryData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="summary-row--compact">
      <v-col cols="12" class="summary-col--compact">
  <v-card elevation="3" class="summary-card">
          <v-card-text class="table-container">
            <BalanceTable :data="balanceData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.summary-container {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
}

.date-selector-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.date-selector-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Reduce margin below the date selector so cards sit tightly */
.date-selector-card {
  margin-bottom: 0 !important;
}

.summary-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 0 !important;
}

.summary-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.table-container {
  overflow-x: auto;
  padding: 16px 12px;
  font-family: 'Poppins', sans-serif;
}

/* Reduce spacing between rows inside the summary container */
.summary-container .v-row {
  gap: 0 !important;
}

/* Compact helpers for rows/cols we added to the template */
.summary-row--compact {
  margin-bottom: 0 !important;
  gap: 0 !important;
}

.summary-col--compact {
  padding-bottom: 0 !important;
}

/* Ensure cards themselves don't leave whitespace */
.summary-container .v-card {
  margin-bottom: 0 !important;
}

/* Make the monthly summary card have a small bottom margin to separate it from the balance table */
.monthly-summary-card {
  margin-bottom: 6px !important;
}

@media (max-width: 600px) {
  .monthly-summary-card {
    margin-bottom: 4px !important;
  }
}

.year-select {
  width: 120px;
  font-family: 'Poppins', sans-serif;
}

.month-select {
  width: 180px;
  font-family: 'Poppins', sans-serif;
}

@media (max-width: 768px) {
  .year-select {
    width: 110px;
  }
  
  .month-select {
    width: 160px;
  }
  
  .table-container {
    padding: 12px 10px;
  }
  
  .summary-card {
    margin-bottom: 12px !important;
  }
}

@media (max-width: 600px) {
  .table-container {
    padding: 10px 8px;
  }
  
  .year-select,
  .month-select {
    width: 100%;
  }
  
  .summary-card {
    margin-bottom: 10px !important;
  }

  /* Make the date selector more compact on small screens */
  .date-selector-card .v-card-text {
    padding: 8px !important;
  }

  /* Reduce vertical spacing between cards on small screens */
  .date-selector-card {
    margin-bottom: 8px !important;
  }

  .table-container {
    padding: 8px 6px;
  }
}

/* Further compaction for very small devices */
@media (max-width: 480px) {
  .date-selector-card .v-card-text {
    padding: 6px !important;
  }

  .summary-card {
    margin-bottom: 6px !important;
  }

  .table-container {
    padding: 6px 4px;
  }

  .year-select {
    width: 100%;
    font-size: 0.9rem;
  }

  .month-select {
    width: 100%;
    font-size: 0.9rem;
  }
}

/* Further reduce selector size and vertical spacing on small screens */
@media (max-width: 600px) {
  /* Override Vuetify margin utility classes for these cards */
  .date-selector-card.mb-4 {
    margin-bottom: 6px !important;
  }

  .summary-card.mb-6 {
    margin-bottom: 6px !important;
  }

  /* Make the selects more compact */
  .year-select,
  .month-select {
    font-size: 0.85rem !important;
    height: 36px !important;
    line-height: 1.1 !important;
  }

  /* Target internal selection area when possible */
  .year-select .v-select__selections,
  .month-select .v-select__selections,
  .year-select .v-field,
  .month-select .v-field {
    padding: 4px 8px !important;
  }

  /* Slightly reduce container padding */
  .date-selector-card .v-card-text {
    padding: 6px !important;
  }

  .table-container {
    padding: 6px 4px;
  }
}

@media (max-width: 420px) {
  .date-selector-card.mb-4,
  .summary-card.mb-6 {
    margin-bottom: 4px !important;
  }

  .year-select,
  .month-select {
    font-size: 0.8rem !important;
    height: 34px !important;
  }

  .year-select .v-select__selections,
  .month-select .v-select__selections {
    padding: 3px 6px !important;
  }
}

/* Prevent dropdowns from overflowing and reduce their font-size/padding on small screens */
@media (max-width: 600px) {
  /* Target the menu/list content produced by Vuetify dropdowns */
  .year-select .v-menu__content,
  .month-select .v-menu__content,
  .year-select .v-list,
  .month-select .v-list {
    max-height: 180px !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    font-size: 0.85rem !important;
  }

  /* Make list items more compact */
  .year-select .v-list-item,
  .month-select .v-list-item {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    min-height: 0 !important;
    font-size: 0.85rem !important;
  }

  /* Reduce title text size inside list items */
  .year-select .v-list-item__title,
  .month-select .v-list-item__title {
    font-size: 0.85rem !important;
  }

  /* Reduce the visible select field font and padding */
  .year-select .v-field__input,
  .month-select .v-field__input,
  .year-select .v-select__selections,
  .month-select .v-select__selections {
    font-size: 0.85rem !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
}

@media (max-width: 420px) {
  .year-select .v-menu__content,
  .month-select .v-menu__content,
  .year-select .v-list,
  .month-select .v-list {
    max-height: 140px !important;
    font-size: 0.8rem !important;
  }

  .year-select .v-list-item,
  .month-select .v-list-item {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    font-size: 0.8rem !important;
  }

  .year-select .v-field__input,
  .month-select .v-field__input {
    font-size: 0.8rem !important;
    padding-top: 3px !important;
    padding-bottom: 3px !important;
  }
}

/* Stronger rules to force the closed v-select controls to be compact */
@media (max-width: 1024px) {
  .year-select, .month-select {
    height: 38px !important;
    min-height: 38px !important;
    font-size: 0.9rem !important;
  }

  /* Target common Vuetify internal wrappers to reduce padding/height */
  .year-select .v-field,
  .month-select .v-field,
  .year-select .v-input,
  .month-select .v-input,
  .year-select .v-select__slot,
  .month-select .v-select__slot {
    height: 38px !important;
    min-height: 38px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .year-select .v-select__selections,
  .month-select .v-select__selections,
  .year-select .v-field__input,
  .month-select .v-field__input {
    height: 38px !important;
    line-height: 1 !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    font-size: 0.9rem !important;
    display: flex !important;
    align-items: center !important;
  }

  /* shrink the floating label a bit so it doesn't force extra height */
  .year-select .v-label,
  .month-select .v-label {
    transform-origin: left top !important;
    transform: translateY(-6px) scale(0.9) !important;
  }
}

@media (max-width: 420px) {
  .year-select, .month-select {
    height: 34px !important;
    min-height: 34px !important;
    font-size: 0.82rem !important;
  }

  .year-select .v-field,
  .month-select .v-field,
  .year-select .v-input,
  .month-select .v-input,
  .year-select .v-select__slot,
  .month-select .v-select__slot {
    height: 34px !important;
    min-height: 34px !important;
  }

  .year-select .v-select__selections,
  .month-select .v-select__selections,
  .year-select .v-field__input,
  .month-select .v-field__input {
    height: 34px !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    font-size: 0.82rem !important;
  }
}
</style>

/* Global rules for compact select menu so dropdowns (appended to body) get smaller font and padding */
/* Not scoped so it applies to the appended menu content */
<style>
.compact-select-menu .v-list {
  max-height: 200px !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  font-size: 0.85rem !important;
}

.compact-select-menu .v-list-item {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  min-height: 0 !important;
}

.compact-select-menu .v-list-item__title,
.compact-select-menu .v-list-item__subtitle,
.compact-select-menu .v-list-item .v-list-item__title {
  font-size: 0.85rem !important;
}

.compact-select-menu .v-list-item__content {
  font-size: 0.85rem !important;
}
</style>

/* Extra-force smaller fonts for the closed v-select controls in this component */
<style>
/* Target the selects themselves and common internal elements Vuetify v3 uses */
.year-select, .month-select,
.year-select .v-field__input, .month-select .v-field__input,
.year-select .v-select__selections, .month-select .v-select__selections,
.year-select .v-field__control, .month-select .v-field__control,
.year-select .v-label, .month-select .v-label,
.year-select .v-field__append-inner, .month-select .v-field__append-inner {
  font-size: 0.82rem !important;
}

/* Reduce icon size inside select */
.year-select .v-icon, .month-select .v-icon {
  font-size: 18px !important;
}

/* Reduce padding/height so selects fit the card */
.year-select, .month-select,
.year-select .v-field__control, .month-select .v-field__control,
.year-select .v-field__input, .month-select .v-field__input {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  height: 34px !important;
  min-height: 34px !important;
}

/* Align content vertically */
.year-select .v-select__selections, .month-select .v-select__selections {
  display: flex !important;
  align-items: center !important;
}

/* If Vuetify inserts wrappers, force their font too */
.year-select .v-input__control, .month-select .v-input__control,
.year-select .v-field__outline, .month-select .v-field__outline {
  font-size: 0.82rem !important;
}
</style>