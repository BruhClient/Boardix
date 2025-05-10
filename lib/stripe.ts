import { env } from "@/data/env/server";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY,{
    apiVersion : "2025-04-30.basil",
    typescript: true
});