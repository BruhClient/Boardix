import { schemas } from "@/data/schemas"
import { isValidEmail } from "./utils"
import { format, getDaysInMonth, subMonths } from "date-fns"

export const formatInputBody = (name : string,body : any) => {
  
    const selectedSchema = schemas.find((schema) => schema.name === name)?.fields
    if (!selectedSchema) return { status: "error", message : "Schema not found "}

    try { 
        let formattedBody = {}
        for (const key in body) {
            const field = selectedSchema.find((field) => field.name === key)
            if (field && body[key]) { 
                const {type} = field
                const valueBeforeFormatting = body[key]

                let value ;
                switch(type) { 
                    case "float" : { 
                        
                        value = parseFloat(valueBeforeFormatting)
                        break
                      
                    }
                    case "number" : { 
                        value = parseInt(valueBeforeFormatting)
                        break
                    }
                    case "email" : { 
                        if (isValidEmail(valueBeforeFormatting)) { 
                            value = valueBeforeFormatting
                        } else { 
                            throw Error("Error")
                        }
                        break
                    }
                    default : { 
                        value = valueBeforeFormatting
                        break 
                    }
                        

                }
                //@ts-ignore
                formattedBody[key] = value

                
                
            }
        }
        return {status : "success", data : formattedBody}
        
    } catch(error) { 
        console.log(error)
        return {status: "error", message : "Data type error"}
    }

    


}

export const formatMonthlyStatistics = (data : {createdAt : string}[],previous = false) => { 
    let days ; 
    if (!previous) { 
        days = getDaysInMonth(Date.now())
    } else{ 
        const lastMonth = subMonths(Date.now(), 1);
        days = getDaysInMonth(lastMonth)
    }

    const formattedData = createEmptyBuckets(days)



    for (const item of data) {
        const {createdAt} = item
        const day = parseInt(format(createdAt,"dd"))
        if (day) { 
            formattedData[`${day}`] += 1
        }
      }
    
      return formattedData
    

}

export const formatYearlyStatistics = (data : {createdAt : string}[],previous = false) => { 
    

    const formattedData = { 
        "Jan" : 0,
        "Feb" : 0,
        "Mar" : 0,
        "Apr" : 0,
        "May" : 0,
        "Jun" : 0,
        "Jul" : 0,
        "Aug" : 0,
        "Sep" : 0,
        "Oct" : 0,
        "Nov" : 0,
        "Dec" : 0,
    }



    for (const item of data) {
        const {createdAt} = item
        const month= format(createdAt,"MMM")
        if (month) { 
            //@ts-ignore
            formattedData[`${month}`] += 1
        }
      }
    
      return formattedData
    

}


export const formatMonthlyAmount = (data : {createdAt : string, total_amount : number}[],previous = false) => { 
    let days ; 
    if (!previous) { 
        days = getDaysInMonth(Date.now())
    } else{ 
        const lastMonth = subMonths(Date.now(), 1);
        days = getDaysInMonth(lastMonth)
    }

    const formattedData = createEmptyBuckets(days)



    for (const item of data) {
        const {createdAt} = item
        const day = parseInt(format(createdAt,"dd"))
        if (day) { 
            formattedData[`${day}`] += item.total_amount
        }
      }
    
      return formattedData
    

}
export const formatYearlyAmount = (data : {createdAt : string, total_amount : number}[],previous = false) => { 
    

    const formattedData = { 
        "Jan" : 0,
        "Feb" : 0,
        "Mar" : 0,
        "Apr" : 0,
        "May" : 0,
        "Jun" : 0,
        "Jul" : 0,
        "Aug" : 0,
        "Sep" : 0,
        "Oct" : 0,
        "Nov" : 0,
        "Dec" : 0,
    }



    for (const item of data) {
        const {createdAt} = item
        const month= format(createdAt,"MMM")
        if (month) { 
            //@ts-ignore
            formattedData[`${month}`] += item.total_amount
        }
      }
    
      return formattedData
    

}

function createEmptyBuckets(count: number): Record<string, number> {
    const result: Record<string, number> = {};
    for (let i = 1; i <= count; i++) {
      result[i.toString()] = 0;
    }
    return result;
 }
