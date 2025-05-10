

export type Schema = {
    name : string , 
    description : string ,
    planType : "Free" | "Pro" 
    keyNotes : string ,
    fields : SchemaField[]
    
}
export type SchemaField = {
    name : string , 
    type :  string  , 
    required? : boolean  ,
    unique? : boolean, 
    enumTypes? : any[]
   
    
}