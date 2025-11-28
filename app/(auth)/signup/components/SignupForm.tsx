"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowRightIcon, LockKeyholeIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
    username: z.string().trim().min(4, "Username is required and at least 4 characters long"),
    password: z.string().trim().min(6, "Password is required and at least 6 characters long"),
    sign: z.string().trim().min(1, "Password sign is required")
})

const SignupForm = () => {
    const [pending, setPending] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            sign: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setPending(true)
            const res = await fetch("/api/create-account", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    sign: data.sign
                }),
            })

            if(res) {
                const data = await res.json()
                if(data.code === 4) {
                    toast.success("Account created successfully! Please login.")
                    form.reset()
                }else {
                    toast.error(data.sign)
                }
            }else {
                toast.error("Service Unavailable")
            }

        } catch (error) {
            console.log(error)
        } finally {
            setPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="my-input-label">Username</FormLabel>
                            <FormControl>
                                <InputGroup className="my-input">
                                    <InputGroupInput
                                        type="text"
                                        {...field}
                                        placeholder="Enter your username..."
                                        disabled={pending}
                                    />
                                    <InputGroupAddon>
                                        <MailIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="my-input-label">Password</FormLabel>
                            <FormControl>
                                <InputGroup className="my-input">
                                    <InputGroupInput
                                        type="password"
                                        {...field}
                                        placeholder="Enter your password..."
                                        disabled={pending}
                                    />
                                    <InputGroupAddon>
                                        <LockKeyholeIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    name="sign"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="my-input-label">Sign (Password Hint)</FormLabel>
                            <FormControl>
                                <InputGroup className="my-input">
                                    <InputGroupInput
                                        type="text"
                                        {...field}
                                        placeholder="Sign (Password hint)"
                                        disabled={pending}
                                    />
                                    <InputGroupAddon>
                                        <LockKeyholeIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <Button type="submit" disabled={pending} size={"lg"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Signup <ArrowRightIcon /></Button>
            </form>
        </Form>
    );
}

export default SignupForm;