import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const create = mutation({
  args: {
    name:v.string()
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }


    const joinCode = '444444'

    const CreatedWorkSpaceId =  await ctx.db.insert('workspaces',{
        name:args.name,
        joinCode,
        user:UserId
    })

    return CreatedWorkSpaceId
  },
});

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("workspaces").collect();
  },
});

export const getWorkspace = query({
  args:{workspaceId:v.id('workspaces')},
  handler:async (ctx,args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.get(args.workspaceId)
  }
})
