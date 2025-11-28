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
import { useRouter } from "next/navigation";
import { login } from "@/app/(actions)/auth";

const formSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().trim().min(1, "Password is required")
})

const LoginForm = () => {
    const [pending, setPending] = useState<boolean>(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setPending(true)
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            })

            if (res) {
                const resJson = await res.json()
                if (resJson.code === 1) {
                    toast.success("Login successfully")
                    const loginRes = await login(data.username)
                    if (loginRes?.ok) {
                        form.reset()
                        router.push("/home")
                    }
                } else {
                    toast.error(resJson.sign)
                }
            } else {
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
                <Button type="submit" disabled={pending || !form.formState.isValid} size={"lg"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Login <ArrowRightIcon /></Button>
            </form>
        </Form>
    );
}

export default LoginForm;