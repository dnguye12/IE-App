"use client"

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccountFormProps {
    username: string
}

const formSchema = z.object({
    age: z.string().trim().min(1, "Age is required"),
    gender: z.string(),
    weight: z.string().trim().min(1, "Weight is required"),
    height: z.string().trim().min(1, "Height is required"),
})

const AccountForm = ({ username }: AccountFormProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: "",
            gender: "",
            weight: "",
            height: ""
        }
    })

    useEffect(() => {
        if (isLoading) {
            const fetchData = async () => {
                try {
                    const res = await fetch("/api/homepage", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username
                        }),
                    })

                    const data = await res.json()
                    if (!data) {
                        setUser({
                            plans: [],
                            personinfo: {
                                age: "",
                                gender: "",
                                weight: "",
                                height: ""
                            }
                        })
                    } else {
                        setUser(data)
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchData()
        }
    }, [isLoading, username])

    useEffect(() => {
        if (!user || !user.personinfo) {
            return
        }

        form.reset({
            age: user.personinfo.age ?? "",
            gender: user.personinfo.gender ?? "",
            weight: user.personinfo.weight ?? "",
            height: user.personinfo.height ?? "",
        })
    }, [user, form])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/person", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    age: data.age,
                    gender: data.gender,
                    weight: data.weight,
                    height: data.height
                })
            })

            if(res) {
                await res.json()
                toast.success("Info Updated Successfully!")
            }else {
                toast.error("Service Unavailable")
            }
        }catch(error) {
            console.log(error)
        }finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        router.push("/home")
    }

    return (
        <div className="p-8">
            <Button onClick={handleBack} variant={"ghost"} className="mb-4"><ArrowLeftIcon/> Back</Button>
            <div className="p-4 bg-white border rounded-2xl">
                <h1 className="text-lg font-semibold">Personal Information</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="age"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="my-input-label">Age</FormLabel>
                                    <FormControl>
                                        <InputGroup className="my-input bg-background! border-border!">
                                            <InputGroupInput
                                                type="text"
                                                placeholder="Age"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>
                        <p className="my-input-label">Gender</p>
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        className="my-input bg-background! w-full text-muted-foreground!"
                                    >
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        ></Controller>
                        <FormField
                            name="weight"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="my-input-label">Weight (kg)</FormLabel>
                                    <FormControl>
                                        <InputGroup className="my-input bg-background! border-border!">
                                            <InputGroupInput
                                                type="text"
                                                placeholder="Weight"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            name="height"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="my-input-label">Height (cm)</FormLabel>
                                    <FormControl>
                                        <InputGroup className="my-input bg-background! border-border!">
                                            <InputGroupInput
                                                type="text"
                                                placeholder="Height"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button type="submit" disabled={isLoading || !form.formState.isValid} size={"lg"} variant={"green"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Update Info</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default AccountForm;