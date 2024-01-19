<script>
export default {
  props: {
    budget: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectBudget(budget) {
      this.$emit('select-budget', budget);
    }
  }
};
</script>

<template>
  <v-card :title="budget.slug" @click="selectBudget(budget)">
    <v-card-text>
      <h2>{{ budget.description }}</h2>
      <p>
        <b>Categories:</b> {{ budget.categories.map(cat => cat.id).join(", ") }}.
      </p>
      <v-list density="compact">
        <h4>Owners:</h4>
        <v-list-item v-for="owner in budget.owners" :key="owner.id">
          <b>{{ owner.name }}</b> {{ owner.email }}
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>