import { schemaNames, schemas } from "@/data/schemas"
import { auth } from "@/lib/auth"

export const getSchemaNames =async  () => { 
    const session = await auth()

    if (!session) return []
    const plan = session.user.plan

    if (plan === "pro") { 
        return schemaNames
    }
    return schemas.filter(({planType}) => { return planType === "Free" }).map((data) =>data.name )
}