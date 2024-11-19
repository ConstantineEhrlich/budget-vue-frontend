<script setup>
import {ref, defineProps, defineEmits, watch, reactive} from 'vue';
import {updateBudget} from "@/components/Budget/budgetController";

const props = defineProps({
  budget: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'select-budget']);

const editedDescription = ref('');
const isPrivate = ref(false);

if(props.budget){
  editedDescription.value = props.budget.description;
  isPrivate.value = props.budget.isPrivate;
}

async function saveChanges() {
  await updateBudget(props.budget.id, {
    description: editedDescription.value,
    isPrivate: isPrivate.value,
  });
  emit('close');
}



</script>

<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Edit Budget</span>
    </v-card-title>

    <v-card-text>
      <v-text-field
          label="Description"
          v-model="editedDescription"
          :rules="[v => !!v || 'Description is required']"
          clearable
      />
      <v-checkbox
          v-model="isPrivate"
          label="Private"
      />
    </v-card-text>

    <v-card-actions>
      <v-container>
        <v-row>
          <v-col>
            <v-btn @click="saveChanges">Update</v-btn>
          </v-col>
          <v-col>
            <v-btn @click="emit('select-budget', budget)">Select</v-btn>
          </v-col>
          <v-col>
            <v-btn @click="emit('close')">Close</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>
