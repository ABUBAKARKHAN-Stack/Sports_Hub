import { UserRoles } from '@/types/main.types';
import { EyeOff, Mail } from 'lucide-react';
import { UserRound } from 'lucide-react';



const signUpFields = [
    {
        name: "username",
        type: "text",
        label: 'Username',
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
] as const;

const signupRoles = [
    {
        id: UserRoles.USER,
        label: "I am a Customer",
    },
    {
        id: UserRoles.ADMIN,
        label: "I am a Manager",
    },
] as const;


export {
    signUpFields,
    signupRoles
}