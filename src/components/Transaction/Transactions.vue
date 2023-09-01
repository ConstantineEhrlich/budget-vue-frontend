<script setup>
    import {ref} from "vue";
    import {getTransactions} from "./transactionController";
    import { useUserState } from "../User/userState";
    import { useRouter } from "vue-router";
    import TransactionList from "./TransactionList.vue";

    const router = useRouter();
    const user = useUserState();

    

</script>

<template>
    <TransactionList></TransactionList>

</template>