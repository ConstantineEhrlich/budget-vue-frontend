<script setup>
import {ref} from "vue";
import {useUserState} from "../User/userState";
import {typesTrans} from "../Transaction/transactionController";
import {changeCatStatus} from "./categoryController";
import {useRouter} from "vue-router";
import CategoryDialog from "@/components/Category/CategoryDialog.vue";

const loadFinished = ref(false);
const router = useRouter();


const user = useUserState();
// await user.fetchProfile();
// if (!user.authenticated) {
//   console.log("User is not auth");
//   router.push("/");
// }

user.fetchBudget().then(() => {
  loadFinished.value = true;
});

async function updateStatus(cat) {
  loadFinished.value = false;
  try {
    await changeCatStatus(cat.budgetFileId, cat.id);
    await user.fetchBudget();
    loadFinished.value = true;
  } catch (e) {
    loadFinished.value = true;
    console.error(e);
  }
}

async function refreshCategories() {
  loadFinished.value = false;
  dialogVisible.value = false;
  await user.fetchBudget();
  loadFinished.value = true;
}


// Dialog management
const dialogVisible = ref(false);
let dialogModeEdit = true;
let dialogCat;

async function addCat() {
  dialogVisible.value = true;
  dialogModeEdit = false;
  dialogCat = null;
}

async function editCat(category) {
  dialogVisible.value = true;
  dialogModeEdit = true;
  dialogCat = category;
}

</script>

<template>
  <v-dialog v-model="dialogVisible"  max-width="400px">
    <CategoryDialog
        :category="dialogCat"
        :is-edit-mode="dialogModeEdit"
        @dialog-finished="refreshCategories"
        @dialog-cancelled="dialogVisible=false"
    ></CategoryDialog>
  </v-dialog>


  <div v-if="loadFinished" style="margin: 10px;">
    <h1>Categories</h1>
    <div class="button-container">
      <v-btn @click="addCat">Add category</v-btn>
    </div>
    <div>
      <v-table density="compact" fixed-header height="90%" hover>
        <thead>
        <tr>
          <th class="text-left">
            ID
          </th>
          <th class="text-left">
            Description
          </th>
          <th class="text-left">
            Type
          </th>
          <th>
            Active
          </th>
          <th>
            Edit
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="cat in user.budget.categories" :key="cat.id">
          <td class="monospace">{{ cat.id }}</td>
          <td>{{ cat.description }}</td>
          <td>{{ typesTrans.get(cat.defaultType) }}</td>
          <td>
            <v-checkbox
                v-model="cat.isActive"
                class="isactive-checkbox"
                @click="updateStatus(cat)"
            ></v-checkbox>
          </td>
          <td>
            <v-icon @click="editCat(cat)">mdi-pencil</v-icon>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<style>
th {
  font-weight: bold !important;
}

.isactive-checkbox {
  margin-bottom: -25px;
  margin-top: -5px
}

.button-container {
  margin: 5px;
}

.monospace {
  font-family: monospace;
}
</style>