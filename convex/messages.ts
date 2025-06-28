import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    message: v.string(),
    workspace: v.id("workspaces"),
    channel: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    parent: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (e) =>
        e.eq("user", UserId).eq("workspace", args.workspace)
      )
      .unique();


    const CreatedMessageId = await ctx.db.insert('messages',{
      message:args.message,
      user:UserId,
      workspace:args.workspace,
      channel:args.channel,
      image:args.image,
      parent:args.parent
    })

    return CreatedMessageId
  },
});
