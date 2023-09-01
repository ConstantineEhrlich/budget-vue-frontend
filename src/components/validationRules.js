// Validation rules to be used in form input validation

export const rules = {
    // Required field
    required: value => !!value || 'Required field',

    // Is number
    isNumber: value => {
        const numberRegex = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;
        return numberRegex.test(value) || "Please enter a valid amount";
    },

    // Login regexp - allow only a-z, A-Z, 0-9
    loginLiterals: value => /^[a-zA-Z0-9]*$/.test(value) || 'Only latin letters and digits, no special characters',

    // No longer than 16 characters
    loginLength: value => value.length <= 16 || 'Up to 16 characters long',

    // No longer than 60 characters
    descLength: value => value.length <= 60 || 'Up to 60 characters long',

    // Email regexp
    email: value => /.+@.+\..+/.test(value) || 'Invalid email',

};