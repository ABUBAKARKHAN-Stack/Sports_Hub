"use client"

import { signinSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import z from "zod"
import { useEffect, useState } from "react"
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
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import AuthButton from "../AuthButton"
import { UserRoles } from "@/types/main.types"
import { useRouter } from "next/navigation"

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
        user
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

    const router = useRouter()

    useEffect(() => {

        if (user) {
            const role = user.role;
            if (role === UserRoles.SUPER_ADMIN) {
                router.push("/super-admin/dashboard")
            } else if (role === UserRoles.ADMIN) {
                router.push("/admin/dashboard")
            } else {
                router.push("/")
            }
        }

    }, [user])

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
                                                    className="rounded-full group hover:bg-foreground! cursor-pointer"
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

                <Link href={"/forgot-password"} className="text-end w-full hover:underline text-xs font-medium text-destructive">Forgot Password</Link>

                <AuthButton
                    isSubmitting={form.formState.isSubmitting}
                    btnText="Sign In"
                    loadingText="Signing In"
                />
            </form>
        </>
    )
}

export default SigninForm


