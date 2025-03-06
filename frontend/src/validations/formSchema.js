import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required.')
        .min(3, 'Name must be at least 3 characters.')
        .max(50, 'Name must not exceed 50 characters.')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces.'),

    email: Yup.string()
        .required('Email is required.')
        .email('Enter a valid email address.'),

    phoneNumber: Yup.string()
        .required('Number is required.')
        .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits.'),

    cv: Yup.mixed()
        .required("CV File is required.")
});
