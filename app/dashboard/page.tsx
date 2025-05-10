
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ChartColumnIncreasing, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ApiUsageCard from "./_component/ApiMeter";
import subscriptionPlans from "@/data/subscriptionPlans";
import ApiOverview from "./_component/ApiOverview";

async function Dashboard() {
    const session = await auth()
    
    if (!session) { 
        redirect("/")
    }



    const limit = subscriptionPlans.find((plan) => plan.name.toLowerCase() === session.user.plan)?.monthlyQuota

    if (!limit) { 
        redirect("/")
    }
    
    return ( <div className='lg:px-10 px-5 py-3 flex flex-col gap-3 pb-6'>
        <div className='flex flex-col gap-1'>
            <div className='text-4xl font-bold'>
                Hello , {session.user.name}
            </div>
            <div className='text-muted-foreground font-serif'>
                What is on your mind today ?
            </div>
            
              
        </div>

        <div className="flex gap-2">
            <Button variant={"outline"} asChild><Link href={"/projects"} className="flex"><ChartColumnIncreasing /> Projects</Link></Button>
            <Button variant={"outline"} asChild><Link href={"/schemas"} className="flex"><Network /> Schemas</Link></Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <ApiUsageCard used={session.user.monthlyUsage} limit={limit}/>
            <ApiOverview userId={session.user.id}/>
          
        </div>
        
      
    </div> );
}

export default Dashboard;