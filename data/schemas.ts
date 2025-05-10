import { Schema } from "@/types/schema";

const fields = ['string', 'email', 'boolean',"number","float","Enum"] as const;

const FieldEnum = fields.reduce((acc, field) => {
    acc[field] = field;
    return acc;
  }, {} as Record<string, string>);



export const schemas = [ 
    {
        name : "User" , 
        description : "This schema is useful for tracking user statistics ", 
        planType : "Free",
        keyNotes : "If API call contains a userId that already exists , the user will be updated accordingly.",
        fields : [
            { 
                name : "userId", 
                type : FieldEnum.string, 
                required : true,
                unique : true,  
            
            },  
            { 
                name : "name", 
                type : FieldEnum.string, 
                
           
            },
            { 
                name : "email", 
                type : FieldEnum.email, 
                
           
            },
            { 
                name : "tier", 
                type : FieldEnum.string, 
                
           
            },
            { 
                name : "role", 
                type : FieldEnum.string, 
                
           
            },
            
            { 
                name : "region", 
                type : FieldEnum.string,
                
                
       
            },
            { 
                name : "authProvider", 
                type : FieldEnum.string,
                
                
       
            },
            
            
        ]
    },
    {
        name : "Payment" , 
        description : "This schema is useful for one-time payments. ", 
        planType : "Free",
        fields : [
            { 
                name : "amount", 
                type : FieldEnum.float, 
                required : true, 
       
            },
           
            { 
                name : "userId", 
                type : FieldEnum.string, 
                required : true,
             
        
            },
            {
                name : "productName", 
                type : FieldEnum.string, 
               
            },
            { 
                name : "email", 
                type : FieldEnum.email, 
                
           
            },
            { 
                name : "paymentType", 
                type : FieldEnum.string, 
                
       
            },
            { 
                name : "region", 
                type : FieldEnum.string, 
               
       
            },
            
          
        ]
    },
    {
        name : "Event" , 
        description : "This schema is useful for events such as Log ins and Checkouts", 
        planType : "Free",
        fields : [
            { 
                name : "eventType", 
                type : FieldEnum.string, 
                required : true, 

       
            },
            { 
                name : "userId", 
                type : FieldEnum.string, 
         
             
        
            },
            
            { 
                name : "email", 
                type : FieldEnum.email, 
         
             
        
            },
            { 
                name : "region", 
                type : FieldEnum.string, 
               
       
            },
            
          
        ]
    },
    {
        name : "Subscription" , 
        description : "This schema is useful for tracking yearly or month recurring payments ", 
        planType : "Pro",
        keyNotes : "If API call contains a userId that already exists , the user will be updated accordingly.",
        fields : [
            
            { 
                name : "userId", 
                type : FieldEnum.string, 
                required : true , 
                unique : true
         
             
        
            },
            { 
                name : "type", 
                type : `${FieldEnum.Enum} ( Yearly , Monthly ) `, 
                required : true ,
               
       
            },
            { 
                name : "amount", 
                type : FieldEnum.number, 
                required : true ,
               
       
            },
            
            { 
                name : "email", 
                type : FieldEnum.email, 
         
             
        
            },
            { 
                name : "region", 
                type : FieldEnum.string, 
               
       
            },
            
            
            
          
        ]
    }
] as Schema[]

export const schemaNames = schemas.map((schema) => schema.name)

export type SchemaName = typeof schemaNames[number]