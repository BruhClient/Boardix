"use client"

import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Clipboard, Check, RefreshCcw } from "lucide-react";
import { refreshApiKey } from "@/server/db/projects";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export function ApiKeyField({ apiKey , id }: { apiKey: string , id : string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [isPending,startTransition] = useTransition()
  const refreshKey = () => { 
    startTransition(() => {
      refreshApiKey(id).then((data) => {
        if (!data) { 
          toast.error("Something went wrong")
        } 
      })
    })
  }

  

  return (
    <div className="space-y-2 max-w-md w-full">
      <Label htmlFor="api-key">API Key</Label>
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Input
            id="api-key"
            type={isVisible ? "text" : "password"}
            value={apiKey}
            readOnly
            className="pr-20 font-mono"
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible((prev) => !prev)}
              className="text-muted-foreground"
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="sr-only">Toggle API key visibility</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className={`text-muted-foreground transition ${copied ? "text-green-500" : ""}`}
            >
              {copied ? <Check size={18} /> : <Clipboard size={18} />}
              <span className="sr-only">Copy API key</span>
            </Button>
          </div>
        </div>
        <Button size={"icon"} disabled={isPending} onClick={() => refreshKey()} variant={"outline"}>{isPending ? <ClipLoader size={15} color="primary"/> : <RefreshCcw />}</Button>
      </div>
      
    </div>
  );
}
