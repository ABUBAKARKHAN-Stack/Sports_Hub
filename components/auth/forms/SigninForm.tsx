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
import { useToasts } from '@/hooks/toastNotifications'
import { Spinner } from "@/components/ui/spinner"

const SigninForm = () => {

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { successToast, errorToast } = useToasts()


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


        // try {
        //     const response = await axiosInstance.post("/auth/register", payload)

        //     if (response.status === 201) {
        //         successToast(response.data.message)
        //         form.reset()
        //         setSignupAs(UserRoles.USER)
        //     }
        // } catch (error: any) {
        //     const errMsg = error?.response?.data?.message || "Something went wrong while creating user"
        //     errorToast(errMsg)
        // }

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


