

import BentoGrid from "@/components/BentoGrid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PricingPlans from "@/components/PricingPlans";


export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center px-4">
      
      <Header />
      <div className="flex flex-col gap-2 items-center text-center">
        
        <div className="text-4xl font-bold max-w-[500px]">
          Have <span className="text-primary">realtime analytics</span> in a matter of seconds
        </div>
        <div className="text-muted-foreground">
          All it takes is 3 easy steps !
        </div>
      </div>

      <BentoGrid />


      <div className="flex flex-col gap-2 items-center text-center">
        
        <div className="text-4xl font-bold">
          Pricing
        </div>
        <div className="text-muted-foreground">
          No hidden fees , no extra costs .
        </div>
      </div>
      <PricingPlans />

      
      <Footer />

     
      
      
    </div>
  );
}
