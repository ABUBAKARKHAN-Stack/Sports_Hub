"use client"

import { forgotPasswordSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Mail } from "lucide-react"
import AuthButton from "../AuthButton"
import { useAuth } from "@/context/AuthContext"

const ForgotPasswordForm = () => {
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const { forgotPassword } = useAuth()

    async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
        await forgotPassword(data.email,form)
    }

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>

                                <InputGroup className="h-10.5">
                                    <InputGroupInput
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    <InputGroupAddon align="inline-end">
                                        <Mail className="text-muted size-4" />
                                    </InputGroupAddon>
                                </InputGroup>

                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <AuthButton
                    isSubmitting={form.formState.isSubmitting}
                    btnText="Send Reset Email"
                    loadingText="Sending..."
                />
            </form>
        </>
    )
}

export default ForgotPasswordForm
