import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";



export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces')
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const CreatedChannel = await ctx.db.insert('channels',{
        name:args.name,
        workspace:args.workspaceId
    })

    return CreatedChannel;
  },
});


export const get = query({
    args:{
        workspaceId:v.id('workspaces')
    },
    handler:async (ctx,args) => {
        const UserId = await getAuthUserId(ctx);
        if (!UserId) {
            return [];
        }

        const Channels = await ctx.db.query('channels').withIndex('by_workspace',q => q.eq('workspace',args.workspaceId)).collect();

        return Channels
    }
})