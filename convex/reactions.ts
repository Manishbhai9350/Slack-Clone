import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

type ReactionSummary = {
  value: string;
  count: number;
};

export const populateReactions = (
  reactions: Doc<"reactions">[] | []
): ReactionSummary[] => {
  // Map to track unique reactions: Map<`${memberId}_${value}`, true>
  const uniqueMap = new Map<string, boolean>();
  const countMap = new Map<string, number>();

  for (const reaction of reactions) {
    const key = `${reaction.member}_${reaction.value}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, true);
      countMap.set(reaction.value, (countMap.get(reaction.value) || 0) + 1);
    }
  }

  // Convert to array
  const result: ReactionSummary[] = Array.from(countMap.entries()).map(
    ([value, count]) => ({
      value,
      count,
    })
  );
  return result;
};

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("user", userId).eq("workspace", message.workspace)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    // ✅ Only check for same emoji by this user
    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message_member_value", (q) =>
        q.eq("message", args.messageId)
         .eq("member", member._id)
         .eq("value", args.value)
      )
      .unique();

    // ✅ If same emoji exists → remove it (toggle off)
    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return existingReaction._id;
    }

    // ✅ Otherwise, add new emoji reaction
    const newReaction = await ctx.db.insert("reactions", {
      member: member._id,
      message: message._id,
      workspace: message.workspace,
      value: args.value,
    });

    return newReaction;
  },
});


export const get = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return [];
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      return [];
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("user", UserId).eq("workspace", message.workspace)
      )
      .unique();

    if (!currentMember) {
      return [];
    }

    const Reactions = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("message", args.messageId))
      .collect();

    const PopulatedReactions = populateReactions(Reactions);

    return PopulatedReactions;
  },
});
