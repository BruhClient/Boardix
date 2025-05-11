"use server"

import { auth } from "@/lib/auth"
import { sendVerificationEmail } from "@/server/db/auth/mail"
import { getUserByEmail, updateUserByEmail } from "@/server/db/users"
import { generateVerificationToken } from "@/server/db/auth/verification-token"
import { EditProfilePayload, EditProfileSchema } from "@/schema/edit-profile"

export const editProfile = async (values : EditProfilePayload) => { 
    try { 
        const {email , name} = EditProfileSchema.parse(values)
        const formattedEmail = email.toLowerCase()
     
        
        
        
        const session = await auth()


        if (!session) { 
            return { 
                error : "Unauthorized"
            }
        }

        if (session.user.name !== name) { 
            await updateUserByEmail(formattedEmail,{ 
                name 
            })
        }

        if (session.user.email !== formattedEmail) { 
            const emailExists = await getUserByEmail(formattedEmail)

            if (emailExists) { 
                return {
                    error : "Email already in use"
                } 
            }

            const token = await  generateVerificationToken(formattedEmail,session.user.email!)

            await sendVerificationEmail(token.email,token.token)

            return { 
                success : `Verification Email sent to ${email}`
            }
        }
        
        



        
        
        return { 
            success : "Changed Successfully !"
        }
    } catch { 
        return { 
            error : "Something went wrong"
        }
    }
}