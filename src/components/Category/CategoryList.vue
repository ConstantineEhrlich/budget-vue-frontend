<script setup>
    import { ref, reactive } from "vue";
    import { useUserState } from "../User/userState";
    import { typesTrans } from "../Transaction/transactionController";
    import { changeCatStatus } from "./categoryController";
    import AddCategory from "./AddCategory.vue";

    const loadFinished = ref(false);

    const addCatDialog = ref(false);

    const user = useUserState();

    user.fetchBudget().then(() => loadFinished.value = true);

    async function updateStatus(cat){
        console.log(cat);
        loadFinished.value = false;
        try{
            await changeCatStatus(cat.budgetFileId, cat.id);
            await user.fetchBudget();
            loadFinished.value = true;
        }
        catch(e){
            loadFinished.value = true;
            console.error(e);
        }
    }
</script>

<template>
    <v-dialog v-model="addCatDialog" max-width="400px"><AddCategory></AddCategory></v-dialog>
    <div style="margin: 10px;" v-if="loadFinished">
        <h1>Categories</h1>
        <div class="button-container"><v-btn @click="addCatDialog = true">Add category</v-btn></div>
        <div>
        <v-table height="90%" fixed-header density="compact">
            <thead>
                <tr>
                    <th class="text-left">
                        Id
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="cat in user.budget.categories" :key="cat.id">
                    <td>{{ cat.id }}</td>
                    <td>{{ cat.description }}</td>
                    <td>{{ typesTrans.get(cat.defaultType) }}</td>
                    <td>
                        <v-checkbox
                            v-model="cat.isActive"
                            @click="updateStatus(cat)"
                            class="isactive-checkbox"
                        ></v-checkbox>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
    </div>
</template>

<style>
    th{
        font-weight: bold !important;
    }
    .isactive-checkbox{
        margin-bottom: -25px;
        margin-top:-5px
    }
    .button-container{
        margin: 5px;
    }
</style>