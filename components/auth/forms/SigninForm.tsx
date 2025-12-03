"use client"

import { signinSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { signInFields } from "@/constants/formfields.constants"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { CircleArrowRight, Eye, EyeOff } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"
import { useAuthErrors } from "@/hooks/useAuthErrors"

const SigninForm = () => {

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const {
        signIn,
    } = useAuth()


    const [showPassword, setShowPassword] = useState({
        password: false,
    })

    const togglePassword = (field: "password") => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    async function onSubmit(data: z.infer<typeof signinSchema>) {
        await signIn("credentials", {
            email: data.email,
            password: data.password
        })
    }

    return (

        <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldGroup>
                    {signInFields.map(({ label, name, type, placeholder, icon: Icon }) => (
                        <Controller
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                                    <InputGroup className="h-10.5">
                                        <InputGroupInput
                                            {...field}
                                            id={name}
                                            type={
                                                type === "password"
                                                    ? showPassword[name]
                                                        ? "text"
                                                        : "password"
                                                    : type
                                            }
                                            placeholder={placeholder}
                                            aria-invalid={fieldState.invalid}
                                        />

                                        <InputGroupAddon align={"inline-end"}>
                                            {type === "password" ? (
                                                <InputGroupButton
                                                    onClick={() => togglePassword(name)}
                                                    className="rounded-full group hover:!bg-foreground cursor-pointer"
                                                    size={"icon-sm"}
                                                    type="button"
                                                >
                                                    {showPassword[name] ? (
                                                        <Eye className="text-muted group-hover:text-background size-4" />
                                                    ) : (
                                                        <EyeOff className="text-muted group-hover:text-background size-4" />
                                                    )}
                                                </InputGroupButton>
                                            ) : (
                                                <Icon className="text-muted size-4" />
                                            )}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ))}
                </FieldGroup>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-foreground disabled:opacity-50 h-11 text-background hover:bg-[#131b2a]"
                    size={"lg"}
                >
                    {
                        form.formState.isSubmitting ? <>
                            <Spinner /> Signing In
                        </> : "Sign In"
                    }
                    <CircleArrowRight />
                </Button>
            </form>
        </>
    )
}

export default SigninForm


