<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  budget: {
    type: Object,
    required: true,
  }
});

</script>

<template>
  <div>Budget:<br><pre>{{ budget }}</pre></div>
  <div>Data:<br><pre>{{ data }}</pre></div>
</template>

<style scoped>

</style>