"use client"

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

    return (
        <div className="flex-1 flex flex-col p-8 md:px-0 gap-12">
            <HomePlans username={username} user={user} />
            <HomeBMI user={user} />
        </div>
    );
}

export default HomeBody;