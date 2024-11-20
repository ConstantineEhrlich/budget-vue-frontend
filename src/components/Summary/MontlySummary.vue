<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});



</script>

<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped>

</style>