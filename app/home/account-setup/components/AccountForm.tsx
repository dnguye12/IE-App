"use client"

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { caltdee } from "@/utils/utils";

interface AccountFormProps {
    username: string
}

const formSchema = z.object({
    age: z.string().trim().min(1, "Age is required"),
    gender: z.string(),
    weight: z.string().trim().min(1, "Weight is required"),
    height: z.string().trim().min(1, "Height is required"),
    activity: z.string().trim()
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
            height: "",
            activity: "1.375"
        }
    })

    useEffect(() => {
        if (isLoading) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`/api/v2/homepage?username=${username}`)

                    const data = await res.json()
                    if (!data) {
                        setUser({
                            plans: [],
                            personinfo: {
                                age: "",
                                gender: "",
                                weight: "",
                                height: "",
                                kcal: "",
                                activity: ""
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
            activity: user.personinfo.activity ?? "1.375"
        })
    }, [user, form])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const kcal = caltdee(parseFloat(data.weight), parseFloat(data.height), parseFloat(data.age), data.gender, parseFloat(data.activity))
            const res = await fetch("/api/v2/person", {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    age: data.age,
                    gender: data.gender,
                    weight: data.weight,
                    height: data.height,
                    kcal: kcal.tdee,
                    activity: data.activity
                })
            })

            if (res) {
                await res.json()
                toast.success("Info Updated Successfully!")

                setUser({
                    plans: user?.plans ?? [],
                    personinfo: {
                        age: data.age,
                        gender: data.gender,
                        weight: data.weight,
                        height: data.height,
                        kcal: "" + kcal.tdee,
                        activity: data.activity
                    }
                })
            } else {
                toast.error("Service Unavailable")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        router.push("/home")
    }

    return (
        <div className="p-8 md:px-0">
            <Button onClick={handleBack} variant={"ghost"} className="mb-4 hover:text-white"><ArrowLeftIcon /> Back</Button>
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
                                                type="number"
                                                placeholder="Age"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
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
                                                type="number"
                                                placeholder="Weight"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
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
                                                type="number"
                                                placeholder="Height"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <p className="my-input-label">Activity level</p>
                        <Controller
                            name="activity"
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
                                        <SelectItem value="1.2">Sedentary (Little or no exercise)</SelectItem>
                                        <SelectItem value="1.375">Lightly active (1-3 days/week)</SelectItem>
                                        <SelectItem value="1.55">Moderately active (3-5 days/week)</SelectItem>
                                        <SelectItem value="1.725">Very active (6-7 days/week)</SelectItem>
                                        <SelectItem value="1.9">Extremely active (Daily, professional)</SelectItem>

                                    </SelectContent>
                                </Select>
                            )}
                        ></Controller>
                        <Button type="submit" disabled={isLoading} size={"lg"} variant={"green"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Update Info</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default AccountForm;