// data/login.factory.ts
// All your test data scenarios in one place

export const loginData = {

    validUser: {
        email: process.env.VALID_EMAIL || 'harshad3@yopmail.com',
        password: process.env.VALID_PASSWORD || 'Nimap@123',
    },

    invalidPassword: {
        email: process.env.VALID_EMAIL || 'harshad3@yopmail.com',
        password: 'WrongPassword@999',
    },

    invalidEmail: {
        email: 'doesnotexist@yopmail.com',
        password: 'Nimap@123',
    },

    blankEmail: {
        email: '',
        password: 'Nimap@123',
    },

    blankPassword: {
        email: process.env.VALID_EMAIL || 'harshad3@yopmail.com',
        password: '',
    },

    blankBoth: {
        email: '',
        password: '',
    },

    invalidEmailFormat: {
        email: 'notanemail',
        password: 'Nimap@123',
    },

};