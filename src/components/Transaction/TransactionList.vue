<script setup>
    import {reactive, ref} from "vue";
    import { getBudget } from "../Budget/budgetController";
    import { getTransactions } from "../Transaction/transactionController";
    import { useUserState } from "../User/userState";
    import { SOCKET_URL} from "../api";

    const transTypes = new Map([
        [5, "Income"],
        [10, "Expense"],
        [15, "Forecast"]
    ]);


    let loadFinished = ref(false);

    const user = useUserState();

    let itemsPerPage = ref(10);

    const headers = [
        {title: 'Period', key: 'period', align:'start', sortable: true},
        {title: 'Date', key: 'recordedAt', align: 'start', sortable: false},
        {title: 'Type', key:'transactionType', align: 'start', sortable: true},
        {title: 'Category', key:'category', align:'start', sortable:true},
        {title: 'Owner', key:'owner', align: 'start', sortable:true},
        {title: 'Amount', key:'amount', align: 'end', sortable:false}
    ]

    const data = reactive({
      values: null
    });

    

    const dateRender = {
        month: 'short', 
        day: 'numeric'
    };

    const numRender = {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    async function getTableData(){
        try{
            data.values = [];
            const budget = await getBudget(user.budgetId);
            const transactions = await getTransactions(budget.id);
            transactions.forEach(t => {
                data.values.push({
                        period: `${t.year}-${t.period}`,
                        recordedAt: new Date(t.transactionDate).toLocaleDateString('en-US', dateRender),
                        transactionType: transTypes.get(t.transactionType),
                        category: budget.categories.filter(c => c.id === t.categoryId)[0].description,
                        owner: budget.owners.filter(o => o.id === t.ownerId)[0].name,
                        amount: t.amount.toLocaleString("en-US", numRender),
                    });
        })
        }
        catch(error){
            console.error(error);
        }
    }
    getTableData().then(() => loadFinished.value = true);

    const socket = new WebSocket(`${SOCKET_URL}${user.budgetId}/updates`);
    socket.addEventListener("message", async () => {
      await getTableData();
    });


</script>

<template>
    
    <div class="tableview" v-if="loadFinished" style="margin: 10px">
        <h2>{{ user.budget.description }}</h2>
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :height="500"
            :items="data.values"
            density="comfortable"
            fixed-footer
            fixed-header
        ></v-data-table>
    </div>
    <div v-else>
        <p>Data is loading...</p>
    </div>
</template>

<style>
</style>