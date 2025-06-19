import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  workspaces:defineTable({
    name:v.string(),
    user:v.id('users'),
    joinCode:v.string(),
    members:v.array(v.id('users'))
  }),
  members:defineTable({
    user:v.id('users'),
    workspace:v.id('workspaces'),
    role:v.union(v.literal('admin'),v.literal('member'))
  })
  .index('by_user',['user'])
  .index('by_workspace',['workspace'])
  .index('by_user_workspace',['user','workspace'])
});
 
export default schema;