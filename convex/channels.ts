import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";




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