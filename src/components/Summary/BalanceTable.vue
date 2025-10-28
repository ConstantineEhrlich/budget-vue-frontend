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
}

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
  <div class="balance-table-wrapper">
    <div class="table-responsive">
      <table class="summary-table">
        <thead>
          <tr>
            <th class="category-header"></th>
            <th v-for="owner in owners" :key="owner.id" class="owner-column">
              <div class="truncate-text">{{ owner.name }}</div>
            </th>
            <th class="total-column">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.label" :class="{ 'highlight-row': row.label === 'Closing Balance' }">
            <td class="row-header" :class="{ 'closing-balance-header': row.label === 'Closing Balance' }">
              <div class="truncate-text">{{ row.label }}</div>
            </td>
            <td v-for="(value, index) in row.values" :key="index" class="text-right" :class="{ 'closing-balance-cell': row.label === 'Closing Balance' }">
              {{ formatNumber(value) }}
            </td>
            <td class="text-right total-cell" :class="{ 'closing-balance-total': row.label === 'Closing Balance' }">{{ formatNumber(row.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

.balance-table-wrapper {
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

.table-responsive {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.summary-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  table-layout: fixed;
}

.summary-table thead tr {
  background-color: #d57928;
  color: #ffffff;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.summary-table thead th {
  padding: 10px 8px;
}

.category-header {
  background-color: white;
  width: 22%;
}

.owner-column {
  width: auto;
}

.total-column {
  width: 18%;
}

.summary-table tbody tr {
  border-bottom: 1px solid rgba(213, 138, 40, 0.3);
  transition: all 0.25s ease;
}

.summary-table tbody tr:hover {
  background-color: rgba(213, 121, 40, 0.05);
  transform: translateY(-1px);
}

.summary-table th,
.summary-table td {
  padding: 10px 8px;
}

.row-header {
  text-align: center;
  background-color: #d57928;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.3px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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

.total-cell {
  font-weight: 700;
  background-color: rgba(213, 121, 40, 0.08);
  border-left: 1px solid rgba(213, 121, 40, 0.2);
}

.highlight-row td {
  font-weight: 700;
  border-top: 2px solid #d57928;
  padding-top: 12px;
  padding-bottom: 12px;
}

.closing-balance-header {
  background-color: #a85c1f;
  color: white;
  font-weight: 700;
  letter-spacing: 0.3px;
  font-size: 0.85rem;
}

.closing-balance-cell {
  background-color: #f8f0e8;
  font-weight: 700;
}

.closing-balance-total {
  background-color: #f0dbc9;
  font-weight: 700;
}

.summary-table tbody tr:last-child {
  border-bottom: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .summary-table {
    font-size: 0.8rem;
  }
  
  .summary-table th,
  .summary-table td {
    padding: 8px 5px;
  }
  
  .summary-table thead th {
    font-size: 0.8rem;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  
  .row-header {
    font-size: 0.75rem;
  }
  
  .closing-balance-header {
    font-size: 0.75rem;
  }
  
  .text-right, .total-cell, .closing-balance-cell, .closing-balance-total {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
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
  
  .category-header {
    width: 18%;
  }
  
  .total-column {
    width: 20%;
  }
  
  .row-header {
    font-size: 0.7rem;
    letter-spacing: 0;
    text-align: left;
    padding-left: 6px;
  }
  
  .closing-balance-header {
    font-size: 0.7rem;
    text-align: left;
    padding-left: 6px;
  }
  
  .highlight-row td {
    padding-top: 6px;
    padding-bottom: 6px;
  }
  
  .text-right, .total-cell, .closing-balance-cell, .closing-balance-total {
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
  
  .row-header {
    font-size: 0.65rem;
    text-align: left;
    padding-left: 4px;
  }
  
  .closing-balance-header {
    text-align: left;
    padding-left: 4px;
  }
  
  .text-right, .total-cell, .closing-balance-cell, .closing-balance-total {
    font-size: 0.7rem;
  }
}
</style>
