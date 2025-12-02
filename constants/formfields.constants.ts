import { EyeClosed, EyeOff, LucideIcon, Mail } from 'lucide-react';
import { UserRound } from 'lucide-react';

interface FormField {
    name: string;
    type: string;
    label: string;
    placeholder: string;
}

const signupFormFields: (FormField & { icon: LucideIcon })[] = [
    {
        name: "username",
        type: "text",
        label: 'User name',
        placeholder: 'Enter your username',
        icon: UserRound,
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        icon: Mail
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Create a password',
        icon: EyeOff

    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
        icon: EyeOff

    },
];


export {
    signupFormFields
}