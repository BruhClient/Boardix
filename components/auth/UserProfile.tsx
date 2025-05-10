"use client"

import useSessionUser from "@/hooks/use-session-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Settings, Sparkles, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProfileForm from "../forms/profile";
import ProfileImageUploader from "../ProfileImageUploader";
import { capitalizeFirstLetter } from "@/lib/utils";
import EmbeddedCheckoutComponent from "../EmbeddedCheckoutComponent";

function UserProfile() {
    const user = useSessionUser()
    
    if (!user) { 
        return <Skeleton className="w-10 aspect-square rounded-full" />
    }


    
    return ( <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3">
            <div className="bg-primary text-xs px-2 py-1 rounded-sm font-semibold text-black flex items-center gap-1">{user.plan === "pro" && <Sparkles size={12} className="animate-pulse"/>}{capitalizeFirstLetter(user.plan)}</div>
            <Avatar className="w-10 h-10" >
                <AvatarImage src={user.image} alt="Profile" className="object-cover" ></AvatarImage>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">

            <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={user.image ?? undefined} alt="Profile" className="object-cover" ></AvatarImage>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <div>
                    <div>{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                
                
            </div>
            <DropdownMenuSeparator />
            {
                user.plan === "free" && <>
                <EmbeddedCheckoutComponent />
                <DropdownMenuSeparator />
                </>
            }
            
            
            

                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Settings /> Account settings</DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex gap-2 items-center"><Settings /> Account settings</DialogTitle>
                            <DialogDescription>Make changes to your account here</DialogDescription>
                        </DialogHeader>
                        <ProfileImageUploader initialImage={user.image}/>
                        <EditProfileForm/>
                    </DialogContent>
                </Dialog>
                
           
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({
                callbackUrl : "/signin"
            })}>
                <LogOut />Sign out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu> );
}

export default UserProfile;