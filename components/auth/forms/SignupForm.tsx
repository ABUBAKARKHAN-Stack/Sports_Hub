"use client"

import { signupSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import z from "zod"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { signUpFields, signupRoles } from "@/constants/formfields.constants"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { CircleArrowRight, Eye, EyeOff } from "lucide-react"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { IUser, UserRoles } from "@/types/main.types"
import {axiosInstance} from "@/lib/axios"
import { useToasts } from '@/hooks/toastNotifications'
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import AuthButton from "../AuthButton"

const SignupForm = () => {

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { successToast, errorToast } = useToasts()

    const [signupAs, setSignupAs] = useState(UserRoles.USER)
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    })

    const togglePassword = (field: "password" | "confirmPassword") => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    async function onSubmit(data: z.infer<typeof signupSchema>) {
        const payload: Omit<IUser, "avatar" | "isVerified" | "phone" | "provider"> = {
            username: data.username,
            email: data.email,
            password: data.password,
            role: signupAs,
        };

        try {
            const response = await axiosInstance.post("/auth/register", payload)

            if (response.status === 201) {
                successToast(response.data.message)
                form.reset()
                setSignupAs(UserRoles.USER)
                timeoutRef.current = setTimeout(() => {
                    router.push("/signin")
                }, 300);
            }
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Something went wrong while creating user"
            errorToast(errMsg)
        }

    }

    useEffect(() => {

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (

        <>
            <RadioGroup
                value={signupAs}
                onValueChange={(value: UserRoles) => setSignupAs(value)}
                className="flex gap-4 mb-4"
            >
                {signupRoles.map((role) => (
                    <button
                        key={role.id}
                        className={cn(
                            "p-4 border rounded-lg flex items-center gap-3 hover:cursor-pointer transition",
                            signupAs === role.id
                                ? "border-primary bg-primary/10"
                                : "border-muted"
                        )}
                        onClick={() => setSignupAs(role.id)}
                    >
                        <RadioGroupItem
                            className={cn(
                                signupAs === role.id
                                    ? "border-primary"
                                    : "border-input"
                            )}
                            value={role.id}
                            id={role.id}
                        />

                        <Label
                            htmlFor={role.id}
                            className={cn(
                                signupAs === role.id ? "text-primary" : "text-foreground"
                            )}
                        >
                            {role.label}
                        </Label>
                    </button>
                ))}
            </RadioGroup>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldGroup>
                    {signUpFields.map(({ label, name, type, placeholder, icon: Icon }) => (
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
                                                    ? showPassword[name as "password" | "confirmPassword"]
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
                                                    onClick={() => togglePassword(name as "password" | "confirmPassword")}
                                                    className="rounded-full group hover:!bg-foreground cursor-pointer"
                                                    size={"icon-sm"}
                                                    type="button"
                                                >
                                                    {showPassword[name as "password" | "confirmPassword"] ? (
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
                <AuthButton
                    isSubmitting={form.formState.isSubmitting}
                    btnText="Create Account"
                    loadingText="Creating Account"
                />
            </form>
        </>
    )
}

export default SignupForm