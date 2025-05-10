import { relations, sql } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  numeric
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"
import {nanoid} from "nanoid"
import { encrypt } from "@/lib/encrypt";




export const userRoleEnum = pgEnum("user_role", ["admin", "user", "editor"]);
export const userPlanEnum = pgEnum("user_plan", ["free","pro"]);
export const subscriptionTypeEnum = pgEnum("subscription_type", ["yearly","monthly"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  plan : userPlanEnum("plan").notNull().default("free"),
  role: userRoleEnum("role").notNull().default("user").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  hashedPassword : text("hashedPassword"), 
  isOauth : boolean("isOauth"),
  monthlyUsage : integer("monthlyUsage").notNull().default(0),
  image: text("image"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()).notNull(),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    email : text('email').unique().notNull(), 
    emailReplaced : text("emailReplaced"), 


    token: text("token").notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  },
  
)

export const passwordTokens = pgTable(
    "passwordToken",
    {
      id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
      code : text('code').notNull(), 
      expiresAt: timestamp("expires_at", { mode: "date" }).notNull(), // expiration date
      email : text('email').unique().notNull(), 
     
    },
    
)

export const projects = pgTable(
  "projects",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    apiKey : text("apiKey").notNull().$defaultFn(() => encrypt(nanoid(10))),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    name : text('name').notNull(), 
    icon : text("icon").notNull(), 
    starred : boolean("starred").notNull().default(false),
    userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
   
  },
  
)

export const endpoints = pgTable(
  "endpoints",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    name : text('name').notNull(), 
    schema : text("schema").notNull(), 
    enabled : boolean("enabled").notNull().default(true), 
    userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    projectId: text("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
    
  

  

   
  },
  
)
export const userSchema = pgTable(
  "userSchema",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
    .notNull(), 
    name : text("name"), 
    tier : text("tier"),
    role : text("role"),  
    region : text("region"),
    email : text("email"), 
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    authProvider : text("authProvider"),
    authorId : text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
   
    endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
   
  },
  
)

export const paymentSchema = pgTable(
  "paymentSchema",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    userId : text("userId").notNull(),
    amount : numeric('amount', { precision: 10, scale: 2 }).notNull(), 
    email : text("email"), 
    name : text("name"), 
    region : text("region"),
    productName : text("productName"), 
    paymentType : text("paymentType"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    authorId : text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
   
  },
  
)
export const eventSchema = pgTable(
  "eventSchema",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    eventType : text("eventType").notNull(),
    userId : text("userId"),
    region : text("region"),
    email : text("email"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    authorId : text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
   
  },
  
)

export const subscriptionSchema = pgTable(
  "subscriptionSchema",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    amount : numeric('amount', { precision: 10, scale: 2 }).notNull(), 
    userId : text("userId"),
    region : text("region"),
    email : text("email"),
    type : subscriptionTypeEnum("type").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    authorId : text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
   
  },
  
)




 
