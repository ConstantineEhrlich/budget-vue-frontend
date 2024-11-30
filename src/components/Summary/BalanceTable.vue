<script setup>
import { computed, defineProps } from 'vue';

const numRender = {
  style: 'decimal',
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

// Number formatting function
function formatNumber(value) {
  return new Intl.NumberFormat('en-US', numRender).format(value);
};

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Extract owners from openingBalance data
const owners = computed(() => {
  return props.data.openingBalance.map(entry => ({
    id: entry.owner.id,
    name: entry.owner.name,
  }));
});

// Create maps for quick data access
const createDataMap = (dataArray) => {
  return dataArray.reduce((map, entry) => {
    map[entry.owner.id] = entry;
    return map;
  }, {});
};

const openingBalanceMap = computed(() => createDataMap(props.data.openingBalance));
const summaryByOwnerMap = computed(() => createDataMap(props.data.summaryByOwner));
const closingBalanceMap = computed(() => createDataMap(props.data.closingBalance));

// Prepare table rows
const tableRows = computed(() => {
  const rows = [
    { label: 'Opening Balance', key: 'balance', source: openingBalanceMap },
    { label: 'Income', key: 'income', source: summaryByOwnerMap },
    { label: 'Recurring', key: 'recurring', source: summaryByOwnerMap },
    { label: 'Expense', key: 'expense', source: summaryByOwnerMap },
    { label: 'Total for Month', key: 'balance', source: summaryByOwnerMap },
    { label: 'Closing Balance', key: 'balance', source: closingBalanceMap },
  ];

  return rows.map(row => {
    const values = owners.value.map(owner => {
      const data = row.source.value[owner.id];
      return data ? data[row.key] : 0;
    });
    const total = values.reduce((sum, val) => sum + val, 0);
    return { label: row.label, values, total };
  });
});


</script>

<template>
  <table class="summary-table" style="margin-left: 16px; min-width: 50%">
    <thead>
    <tr>
      <th style="background-color: white; width: 40%"></th>
      <th v-for="owner in owners" :key="owner.id">{{ owner.name }}</th>
      <th>Grand Total</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in tableRows" :key="row.label">
      <td class="row-header">{{ row.label }}</td>
      <td v-for="(value, index) in row.values" :key="index" class="text-right">
        {{ formatNumber(value) }}
      </td>
      <td class="text-right" style="font-weight: bold;">{{ formatNumber(row.total) }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.summary-table {
  border-collapse: collapse;
  font-size: .8em;
}

.summary-table thead tr {
  background-color: #d57928;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
}

.summary-table tbody tr {
  border-bottom: 1px solid #d58a28;
}

.summary-table th,
.summary-table td {
  padding: 8px 12px;
}

.row-header {
  text-align: center;
  background-color: #d57928;
  color: #ffffff;
  font-weight: bold;
}
.text-right {
  text-align: right;
  font-family: monospace;
}


</style>
