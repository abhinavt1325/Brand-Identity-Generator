import { pgTable, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { JobStatus, StageStatus, GenerateInput, GenerateResult } from "../types";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobsTable = pgTable("jobs", {
  jobId: varchar("job_id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => usersTable.id),
  status: varchar("status", { length: 50 }).$type<JobStatus>().notNull(),
  input: jsonb("input").$type<GenerateInput>().notNull(),
  result: jsonb("result").$type<Partial<GenerateResult>>(),
  stages: jsonb("stages").$type<{
    research: StageStatus;
    strategy: StageStatus;
    design: StageStatus;
    copy: StageStatus;
    coherence: StageStatus;
  }>().notNull(),
  progress: integer("progress").notNull().default(0),
  error: jsonb("error").$type<{ message: string }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
