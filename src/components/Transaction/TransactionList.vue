<script setup>
    import { useUserState } from "../User/userState";
    import {getTransactions} from "../Transaction/transactionController";
    import { ref } from "vue";

    let loadFinished = ref(false);

    const user = useUserState();

    console.log(user.profile.id);
    console.log(user.budgetId);

    let itemsPerPage = ref(10);

    const headers = [
        {title: 'Date', key: 'recordedAt', align: 'start', sortable: true},
        {title: 'Transaction type', key:'transactionType', align: 'start', sortable: true},
        {title: 'Category', key:'category', align:'start', sortable:true},
        {title: 'Owner', key:'owner', align: 'start', sortable:true},
        {title: 'Amount', key:'amount', align: 'end', sortable:false}
    ]

    let data = [];

    getTransactions(user.budgetId).then(response => {
        response.forEach(transaction => {
            data.push({
                recordedAt: transaction.recordedAt,
                transactionType: transaction.transactionType,
                category: transaction.categoryId,
                owner: transaction.ownerId,
                amount: transaction.amount,
            });
        });
        loadFinished.value = true;
    })
    .catch(e => console.error(e));






</script>

<template>
    <v-container v-if="loadFinished">
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="data"
            ></v-data-table>
    </v-container>
    <v-container v-else>
        <p>Data is loading...</p>
    </v-container>
</template>