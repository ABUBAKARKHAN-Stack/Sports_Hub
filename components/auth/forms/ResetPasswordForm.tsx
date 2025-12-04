"use client"

import { resetPasswordSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Eye, EyeOff } from "lucide-react"
import AuthButton from "../AuthButton"
import { useAuth } from "@/context/AuthContext"

const ResetPasswordForm = ({ token }: { token: string }) => {

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const { resetPassword } = useAuth()

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    })

    const togglePassword = (field: "password" | "confirmPassword") => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        await resetPassword({
            token,
            newPassword: data.password,
            form
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FieldGroup>

                {/* Password */}
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">Password</FieldLabel>

                            <InputGroup className="h-10.5">
                                <InputGroupInput
                                    {...field}
                                    id="password"
                                    type={showPassword.password ? "text" : "password"}
                                    placeholder="Enter new password"
                                    aria-invalid={fieldState.invalid}
                                />

                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        onClick={() => togglePassword("password")}
                                        className="rounded-full group hover:!bg-foreground cursor-pointer"
                                        size={"icon-sm"}
                                        type="button"
                                    >
                                        {showPassword.password ? (
                                            <Eye className="text-muted group-hover:text-background size-4" />
                                        ) : (
                                            <EyeOff className="text-muted group-hover:text-background size-4" />
                                        )}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Confirm Password */}
                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>

                            <InputGroup className="h-10.5">
                                <InputGroupInput
                                    {...field}
                                    id="confirmPassword"
                                    type={showPassword.confirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    aria-invalid={fieldState.invalid}
                                />

                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        onClick={() => togglePassword("confirmPassword")}
                                        className="rounded-full group hover:!bg-foreground cursor-pointer"
                                        size={"icon-sm"}
                                        type="button"
                                    >
                                        {showPassword.confirmPassword ? (
                                            <Eye className="text-muted group-hover:text-background size-4" />
                                        ) : (
                                            <EyeOff className="text-muted group-hover:text-background size-4" />
                                        )}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            <AuthButton
                isSubmitting={form.formState.isSubmitting}
                btnText="Reset Password"
                loadingText="Updating..."
            />
        </form>
    )
}

export default ResetPasswordForm
