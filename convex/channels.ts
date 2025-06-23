import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (e) =>
        e.eq("user", UserId).eq("workspace", args.workspaceId)
      )
      .unique();

    if (!CurrentMember || CurrentMember.role !== "admin") {
      throw new Error("Unauthorized");
    } 

    const CreatedChannelId = await ctx.db.insert("channels", {
      name: args.name.replace(/\s+/g,'-').toLowerCase(),
      workspace: args.workspaceId,
    });

    return CreatedChannelId;
  },
});

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return [];
    }

    const Channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace", (q) => q.eq("workspace", args.workspaceId))
      .collect();

    return Channels;
  },
});
