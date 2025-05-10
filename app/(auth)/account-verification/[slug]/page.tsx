

import { getUserByEmail, updateUserByEmail } from "@/server/db/users";
import { deleteVerificationTokenById, getVerificationTokenByToken } from "@/server/db/auth/verification-token";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import LinkButton from "../_components/linkButton";
import Link from "next/link";




async function AccountVerificationPage({params} : {params : Promise<{slug : string}>}) {

    const param = await params
    const token = param.slug

    const verificationToken = await getVerificationTokenByToken(token)



    let status = true
    let isExpired = false

    
    if (verificationToken) { 
        const currentTime = new Date();
        const expiry_date = new Date(verificationToken.expiresAt);

        
        if ( expiry_date <= currentTime) { 
            status = false
            isExpired = true
            


        } else {
            let existingUser;  
            if (verificationToken.emailReplaced) { 
                 existingUser = await getUserByEmail(verificationToken.emailReplaced)
            } else { 
                existingUser = await getUserByEmail(verificationToken.email)
            }
            
            
            if (existingUser) { 
                await updateUserByEmail(existingUser.email,{ 
                    emailVerified : currentTime, 
                    email : verificationToken.email
                })
            }
            
            // Delete Verification Token 
            await deleteVerificationTokenById(verificationToken.id)
        }
        
        
    } else { 
        status = false
    }

    



    return <main className="min-h-screen flex items-center justify-center bg-background px-4">
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Account Verification</CardTitle>
      </CardHeader>
      <CardContent>
        

        {status && (
          <div className="flex flex-col items-center space-y-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-base font-semibold">Your account is now verified!</p>
            <Button className="w-full"  variant="default" asChild><Link href={"/signin"}>Sign in</Link></Button>
          </div>
        )}

        {!status && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <XCircle className="h-8 w-8 text-destructive" />
              <p className="text-base font-semibold text-destructive">Verification failed</p>
              <p className="text-sm text-muted-foreground">
                {isExpired ? "This link is expired. Please request a new verification email." : "This link is invalid. Please check that you are using the right verification link"}
                
              </p>
              {isExpired && <LinkButton email={verificationToken?.email!}/>}

              <Button className="w-full"  variant="link" asChild><Link href={"/"}>Back to dashboard</Link></Button>
              
            </div>
          )}
      </CardContent>
    </Card>
  </main>
}

export default AccountVerificationPage;