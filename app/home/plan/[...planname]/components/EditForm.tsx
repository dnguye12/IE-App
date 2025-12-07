/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    planname: z.string().trim().min(1, "Plan name is required and be unique"),
    targetCalories: z.coerce.number(),
    protein: z.coerce.number(),
    carbs: z.coerce.number(),
    fats: z.coerce.number(),
    wantedFoods: z.array(
        z.object({
            foodNames: z.string().trim().min(1, "Food name is required"),
            foodQuantity: z.coerce.number().min(1, "Quantity is required")
        })
    ),
    notWantedFoods: z.array(
        z.object({
            name: z.string().trim().min(1, "Food name is required")
        })
    )
})

interface EditFormProps {
    planname: string;
    username: string
}

const EditForm = ({ planname, username }: EditFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            planname: "",
            targetCalories: 0,
            protein: 30,
            carbs: 50,
            fats: 20,
            wantedFoods: [],
            notWantedFoods: []
        }
    })

    const { control } = form
    const wantedField = useFieldArray({ control, name: "wantedFoods" })
    const notWantedField = useFieldArray({ control, name: "notWantedFoods" })
    const [user, setUser] = useState<User | null>(null)
    const [pending, setPending] = useState<boolean>(false)
    const [loadingUser, setLoadingUser] = useState<boolean>(true)
    const [plan, setPlan] = useState<any>(null)
    const [request, setRequest] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        if (loadingUser) {
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
                    setLoadingUser(false)
                }
            }

            fetchData()
        }
    }, [loadingUser, username, form])

    useEffect(() => {
        if (planname && username) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`/api/v2/get-plan?username=${username}&planname=${planname}`)
                    const data = await res.json()
                    
                    if (data) {
                        setPlan(data.result)
                        setRequest(data.dr)
                        form.reset({
                            planname,
                            targetCalories: data.dr.targetCalories,
                            protein: data.dr.macros.protein,
                            carbs: data.dr.macros.carbs,
                            fats: data.dr.macros.fats,
                            wantedFoods: (data.dr.foods ?? []).map((f: any) => ({
                                foodNames: f.foodNames,
                                foodQuantity: f.foodQuantity,
                            })),
                            notWantedFoods: (data.dr.notWantedFoods ?? []).map((n: string) => ({
                                name: n,
                            }))
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()
        }
    }, [planname, username, form])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setPending(true)

            const macros = {
                protein: data.protein,
                carbs: data.carbs,
                fats: data.fats
            }

            const request = {
                targetCalories: data.targetCalories,
                foods: data.wantedFoods,
                notWantedFoods: data.notWantedFoods.map((n) => n.name),
                macros,
                planname: data.planname
            }

            setRequest(request)
            const res = await fetch("/api/v2/generate-plan", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            })

            if (res) {
                const data = await res.json()
                setPlan(data)
            } else {
                toast.error("Service Unavailable")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPending(false)
        }
    }

    const onSave = async () => {
        if (!user) {
            return
        }
        try {
            const res = await fetch("/api/v2/save-plan", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    planname: form.getValues().planname,
                    dr: request,
                    result: plan
                })
            })

            const data = await res.json()
            if (data) {
                setUser({
                    plans: [...user.plans, request.planname],
                    personinfo: user.personinfo
                })
                toast.success("Plan Saved Successfully!")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPending(false)
        }
    }

    const handleBack = () => {
        router.push("/home")
    }

    return (
        <div className="flex-1 p-8 md:px-0">
            <Button onClick={handleBack} variant={"ghost"} className="mb-4 hover:text-white"><ArrowLeftIcon /> Back</Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="rounded-2xl bg-white border p-4 space-y-6">
                            <FormField
                                name="planname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                className="rounded-full"
                                                disabled={loadingUser}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                name="targetCalories"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Calories</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                className="rounded-full"
                                                disabled={loadingUser}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                        <div className="rounded-2xl bg-white border p-4 space-y-6">
                            <section>
                                <h5 className="font-semibold mb-4">1. Macros (%)</h5>
                                <div className="flex gap-x-2">
                                    <FormField
                                        name="protein"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Protein</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        className="rounded-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    ></FormField>
                                    <FormField
                                        name="carbs"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Carbs</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        className="rounded-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    ></FormField>
                                    <FormField
                                        name="fats"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fats</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        className="rounded-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    ></FormField>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h5 className="font-semibold mb-4">2. Wanted Foods & Eaten Foods</h5>
                                <div className="space-y-4">
                                    {
                                        wantedField.fields.map((field, idx) => (
                                            <div key={field.id} className="flex gap-x-2 items-center">
                                                <FormField
                                                    control={control}
                                                    name={`wantedFoods.${idx}.foodNames`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    {...field}
                                                                    className="rounded-full"
                                                                    placeholder="Food name"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={control}
                                                    name={`wantedFoods.${idx}.foodQuantity`}
                                                    render={({ field }) => (
                                                        <FormItem className="w-20">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    className="rounded-full"
                                                                    placeholder="Quantity (gr)"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="rounded-full"
                                                    onClick={() => wantedField.remove(idx)}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </div>
                                        ))
                                    }
                                    <Button
                                        type="button"
                                        size={"lg"}
                                        onClick={() => wantedField.append({ foodNames: "", foodQuantity: 100 })}
                                        className="rounded-full w-full"
                                    >
                                        Add food
                                    </Button>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h5 className="font-semibold mb-4">3. Unwanted Foods</h5>
                                <div className="space-y-4">
                                    {
                                        notWantedField.fields.map((field, idx) => (
                                            <div key={field.id} className="flex gap-x-2 items-center">
                                                <FormField
                                                    control={control}
                                                    name={`notWantedFoods.${idx}.name`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    {...field}
                                                                    className="rounded-full"
                                                                    placeholder="Food name"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="rounded-full"
                                                    onClick={() => notWantedField.remove(idx)}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </div>
                                        ))
                                    }
                                    <Button
                                        type="button"
                                        size={"lg"}
                                        onClick={() => notWantedField.append({ name: "" })}
                                        className="rounded-full w-full"
                                    >
                                        Add unwanted foods
                                    </Button>
                                </div>
                            </section>
                            <Separator />
                            <Button
                                type="submit"
                                variant={"green"}
                                size={"lg"}
                                className="rounded-full w-full"
                                disabled={pending || !form.formState.isValid}
                            >
                                Generate / Regenerate
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className="md:col-span-2 rounded-2xl bg-white border p-4 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-1">
                        <h5 className="font-semibold">Plan Result</h5>
                        {plan?.nutritionSummary && (
                            <div className="flex gap-x-2">
                                <div className="text-xs rounded-full bg-blue-200/50 text-blue-700 p-1">Calorie: {Math.floor(plan.nutritionSummary.totalCalories)}</div>
                                <div className="text-xs rounded-full bg-blue-200/50 text-blue-700 p-1">Protein: {Math.floor(plan.nutritionSummary.totalProtein)}</div>
                                <div className="text-xs rounded-full bg-blue-200/50 text-blue-700 p-1">Carbs: {Math.floor(plan.nutritionSummary.totalCarbs)}</div>
                                <div className="text-xs rounded-full bg-blue-200/50 text-blue-700 p-1">Fats: {Math.floor(plan.nutritionSummary.totalFat)}</div>
                            </div>
                        )}
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Food</TableHead>
                                <TableHead>Grams</TableHead>
                                <TableHead>Kcal</TableHead>
                                <TableHead>Protein</TableHead>
                                <TableHead>Carbs</TableHead>
                                <TableHead>Fats</TableHead>
                            </TableRow>
                        </TableHeader>
                        {plan && (
                            <TableBody>
                                {plan.plan.map((p: any, idx: number) => (
                                    <TableRow key={`plan-${idx}`} className="font-light">
                                        <TableCell>{p.name} {p.isAutoAdded && "(Auto)"}</TableCell>
                                        <TableCell>{Math.floor(p.grams)}</TableCell>
                                        <TableCell>{Math.floor(p.calories * p.grams / 100)}</TableCell>
                                        <TableCell>{Math.floor(p.protein * p.grams / 100)}</TableCell>
                                        <TableCell>{Math.floor(p.carbs * p.grams / 100)}</TableCell>
                                        <TableCell>{Math.floor(p.fats * p.grams / 100)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}

                    </Table>
                    {plan?.autoAddedItems && plan.autoAddedItems.length > 0 && (
                        <div className="text-accent">
                            <p>Auto-added:</p>
                            <ul className="list-disc list-inside">
                                {plan.autoAddedItems.map((item: any, idx: number) => (
                                    <li key={`item-${idx}`} className="text-sm font-light">{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button
                        type="button"
                        variant={"green"}
                        size={"lg"}
                        className="rounded-full w-full"
                        disabled={pending || !plan || !request}
                        onClick={onSave}
                    >Save Plan To Database</Button>
                </div>
            </div>
        </div>
    );
}

export default EditForm;