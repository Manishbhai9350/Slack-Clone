import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  // Default Schema
  ...authTables,

  // Workspaces Schema
  workspaces:defineTable({
    name:v.string(),
    user:v.id('users'),
    joinCode:v.string()
  }),

  // Members Schema
  members:defineTable({
    user:v.id('users'),
    workspace:v.id('workspaces'),
    role:v.union(v.literal('admin'),v.literal('member'))
  })
  .index('by_user',['user'])
  .index('by_workspace',['workspace'])
  .index('by_user_workspace',['user','workspace']),

  // Channels Schema
  channels:defineTable({
    name:v.string(),
    workspace:v.id('workspaces'),
  })
  .index('by_workspace',['workspace']),

  // Messages Schema
  messages:defineTable({
    message:v.string(),
    member:v.id('members'),
    workspace:v.id('workspaces'),
    updated:v.optional(v.number()),
    channel:v.optional(v.string()),
    image:v.optional(v.id('_storage')),
    parent:v.optional(v.id('messages')),
    conversation:v.optional(v.id('conversations'))
  })
  .index('by_workspace',['workspace'])
  .index('by_member',['member'])
  .index('by_parent',['parent'])
  .index('by_channel',['channel'])
  .index('by_conversation',['conversation'])
  .index('by_channel_parent_conversation',['channel','parent','conversation']),


  // Converstions Schema
  conversations:defineTable({
    workspace:v.id('workspaces'),
    member_one:v.id('members'),
    member_two:v.id('members')
  })
  .index('by_workspace',['workspace'])
  .index('by_member_one',['member_one'])
  .index('by_member_two',['member_two']),

  // Reactions Schema 

  reactions:defineTable({
    workspace:v.id('workspaces'),
    member:v.id('members'),
    message:v.id('messages'),
    value:v.string()
  })
  .index('by_workspace',['workspace'])
  .index('by_message',['message'])
  .index('by_member',['member'])


});
 
export default schema;