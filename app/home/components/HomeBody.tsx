"use client"

import { Button } from "@/components/ui/button";
import HomeBMI from "./HomeBMI";
import HomePlans from "./HomePlans";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";

interface HomeBodyProps {
    username: string
}

const HomeBody = ({ username }: HomeBodyProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

    return (
        <div className="flex-1 flex flex-col p-8 gap-12">
            <section>
                <h2 className="home-label mb-4">Generate New Plan</h2>
                <Button variant={"green"} size={"lg"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Generate</Button>
            </section>
            <HomePlans username={username} user={user}/>
            <HomeBMI user={user}/>
        </div>
    );
}

export default HomeBody;