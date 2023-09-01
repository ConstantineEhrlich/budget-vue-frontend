<script setup>
    import { useUserState } from "../User/userState";
    
    const user = useUserState();
    
    // Form submit status
    let loading=ref(false);

    // Form data
    const formdata =ref({
        categoryId: "",
        amount: 0,
        description: "",
        transactionType: 0,
        ownerId: "",
        date: null,
        year: null,
        period: null,
    });

    // Validation rules
    const rules = {
        // Required field
        required: value => !!value || 'Required field',

        // No longer than 60 characters
        descLength: value => value.length <= 60 || 'Up to 60 characters long',
    };

    


    
    
</script>

<template>

</template>