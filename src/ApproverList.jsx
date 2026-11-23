import { useEffect, useState } from "react";

export default function ApproverList() {
    const [approvers, setApprovers] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    useEffect( () => {
        const controller = new AbortController()

        async function fetchApprovers() {
            try {
                setLoading(true)
                setError("")

                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users",
                    {signal : controller.signal}
                );

                if(!response.ok) {
                    throw new Error("Failed to fetch approvers")
                }

                const data = await response.json();
                console.log('Fetch Approver', data)

                if(!controller.signal.aborted) {
                    setApprovers(data)
                }

            } catch(err) {
                if(err.name !== "AbortError") {
                     console.error("API error:", err);
                    setError(err.message)
                } 

            } finally {
                    if(!controller.signal.aborted) {
                        setLoading(false)
                    }
                }

        }

        fetchApprovers();
        return () => {
            controller.abort()
        };

    }, []);

    console.log("Rendering", {
        loading,
        approversCount: approvers.length,
        error
    })

    if(loading) {
       return <p>Loading Approvers... </p>
    }

    if(error) {
        return <p style={ {color: 'red'}}>{error}</p>
    }

    return (
        <section>
        <h2>Approver Directory</h2>
        { approvers.map ( (approver) => (
            <div key={approver.id}>
            <strong>{approver.name}</strong>
            <p>{approver.email}</p>
            </div>
        ))


        }
        </section>
        
    )

}