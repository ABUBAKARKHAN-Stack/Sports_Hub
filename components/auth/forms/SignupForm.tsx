"use client"

import { signupSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupFormFields } from "@/constants/formfields.constants"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"



const SignupForm = () => {
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof signupSchema>) {
        console.log(data);

    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* {
                    signupFormFields.map(({
                        label,
                        name,
                        type,
                        placeholder,
                        icon: Icon
                    }) => (
                        <FormField
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput
                                                type={type}
                                                placeholder={placeholder}
                                                {...field}
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                {
                                                    type === "password" ? <InputGroupButton
                                                   
                                                    >
                                                        <Icon className="text-muted size-4" />
                                                    </InputGroupButton> : <Icon className="text-muted size-4" />
                                                }

                                            </InputGroupAddon>


                                        </InputGroup>
                                    
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))
                } */}
            </form>
        </Form>
    )
}

export default SignupForm