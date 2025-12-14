"use client";

import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountVerificationSchema } from "@/schemas/auth.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import AuthButton from "../AuthButton";
import { useAuth } from "@/context/AuthContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function AccountVerificationModal() {
    const { sendVerificationEmail, verifyAccount } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const [codeSent, setCodeSent] = useState(false);
    const [resending, setResending] = useState(false);

    const form = useForm<z.infer<typeof accountVerificationSchema>>({
        resolver: zodResolver(accountVerificationSchema),
        defaultValues: { code: "" },
    });

    const submit = async (data: z.infer<typeof accountVerificationSchema>) => {
        try {
            await verifyAccount({ code: data.code, form, setIsOpen });

        } catch (error) {
            console.error("Verification failed:", error);
        }
    };

    const handleSendCode = async () => {
        setResending(true);
        try {
            await sendVerificationEmail(setCodeSent);

        } catch (error) {
            console.error("Error sending verification code:", error);
        } finally {
            setResending(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await sendVerificationEmail(setCodeSent);
        } finally {
            setResending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }} >
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-muted text-white p-2">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                Verify your account
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm text-muted-foreground">
                                {codeSent
                                    ? "Enter the 6‑digit code sent to your email."
                                    : "Click the button below to send a verification code."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(submit)} className="mt-5 grid gap-4">
                    {!codeSent ? (
                        <Button
                            type="button"
                            onClick={handleSendCode}
                            disabled={resending}
                        >
                            {resending ? "Sending..." : "Send Verification Code"}
                        </Button>
                    ) : (
                        <>
                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="code"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                                         
                                            <InputOTP
                                                {...field}
                                                id="code"
                                                aria-invalid={fieldState.invalid}
                                                maxLength={6}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-sm h-10 hover:!bg-secondary/10 cursor-pointer"
                                    onClick={handleResend}
                                    disabled={resending}
                                >
                                    {resending ? "Resending..." : "Resend code"}
                                </Button>

                                <DialogFooter className="flex items-center gap-2">
                                    <AuthButton
                                        className="h-10"
                                        btnText="Verify account"
                                        loadingText="Verifying..."
                                        isSubmitting={form.formState.isSubmitting}
                                    />
                                </DialogFooter>
                            </div>
                        </>
                    )}

                    {codeSent && (
                        <div className="text-xs text-muted-foreground pt-1">
                            Didn’t receive an email? Check your spam folder.
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
