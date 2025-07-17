/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

interface Threads {
  count: number;
  image: string | null;
  timestamp: number;
}

const populateThread = async (
  id: Id<"messages">,
  ctx: QueryCtx
): Promise<Threads> => {
  const Messages = await ctx.db
    .query("messages")
    .withIndex("by_parent", (q) => q.eq("parent", id))
    .collect();

  if (!Messages || Messages.length == 0) {
    return {
      count: 0,
      image: null,
      timestamp: 0,
    };
  }

  const ThreadData: Threads = {
    count: 0,
    image: null,
    timestamp: 0,
  };

  const LastMessage = Messages[Messages.length - 1];

  const LastMember = await populateMember(LastMessage.member, ctx);
  if (!LastMember) {
    return ThreadData;
  }

  const LastUser = await populateUser(LastMember.user, ctx);
  if (!LastUser) {
    return ThreadData;
  }

  ThreadData.count = Messages.length;
  ThreadData.image = LastUser.image || null;
  ThreadData.timestamp = LastMessage._creationTime;

  return ThreadData;
};

const populateReactions = async ({
  message,
  ctx,
}: {
  message: Id<"messages">;
  ctx: QueryCtx;
}) => {
  const reactions = await ctx.db
    .query("reactions")
    .withIndex("by_message", (q) => q.eq("message", message))
    .collect();
  return reactions;
};

const populateUser = (
  id: Id<"users">,
  ctx: QueryCtx
): Promise<Doc<"users"> | null> => {
  return ctx.db.get(id);
};

const populateMember = (
  id: Id<"members">,
  ctx: QueryCtx
): Promise<Doc<"members"> | null> => {
  return ctx.db.get(id);
};

const populateMessage = (
  id: Id<"messages">,
  ctx: QueryCtx
): Promise<Doc<"messages"> | null> => {
  return ctx.db.get(id);
};

const getMember = (
  userId: Id<"users">,
  workspace: Id<"workspaces">,
  ctx: QueryCtx
): Promise<Doc<"members"> | null> => {
  return ctx.db
    .query("members")
    .withIndex("by_user_workspace", (e) =>
      e.eq("user", userId).eq("workspace", workspace)
    )
    .unique();
};

const deduptReactions = (reactions: Doc<"reactions">[]) => {
  const EachReactionsWithCount = reactions.map((reaction) => {
    return {
      ...reaction,
      count: reactions.filter((r) => r.value === reaction.value).length,
    };
  });

  const FilteredReactions = EachReactionsWithCount.reduce(
    (acc, reaction) => {
      const ExistingReaction = acc.find((r) => r.value == reaction.value);

      if (ExistingReaction) {
        ExistingReaction.memberIds = Array.from(
          new Set([...ExistingReaction.memberIds, reaction.member])
        );
      } else {
        acc.push({ ...reaction, memberIds: [reaction.member] });
      }

      return acc;
    },
    [] as (Doc<"reactions"> & {
      count: number;
      memberIds: Id<"members">[];
    })[]
  );

  return FilteredReactions.map(({ member, ...rest }) => rest);
};

export const getById = query({
  args: {
    id: v.id("messages"),
    parent: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return null;
    }

    const message = await populateMessage(args.id, ctx);

    if (!message) {
      return null;
    }

    const member = await populateMember(message.member, ctx);
    const user = member ? await populateUser(member.user, ctx) : null;

    if (!member) {
      return null;
    }

    const reactions = await populateReactions({ ctx, message: message._id });
    const thread = await populateThread(message._id, ctx);

    let image;

    if (message.image) {
      image = await ctx.storage.getUrl(message.image);
    }


    return {
      ...message,
      reactions: deduptReactions(reactions),
      thread,
      image,
      user,
      member,
    };
  },
});

export const get = query({
  args: {
    channel: v.optional(v.string()),
    parent: v.optional(v.id("messages")),
    conversation: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }


    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_parent_conversation", (q) =>
        q
          .eq("channel", args.channel)
          .eq("parent", args.parent)
          .eq("conversation", args.conversation)
      )
      .order("desc")
      .paginate(args.paginationOpts); // 👈 Keep as-is

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(message.member, ctx);
            const user = member ? await populateUser(member.user, ctx) : null;

            if (!member || !user) {
              return null;
            }

            const reactions = await populateReactions({
              ctx,
              message: message._id,
            });
            const thread = await populateThread(message._id, ctx);

            let image;

            if (message.image) {
              image = await ctx.storage.getUrl(message.image);
            }

            const EachReactionsWithCount = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            const FilteredReactions = EachReactionsWithCount.reduce(
              (acc, reaction) => {
                const ExistingReaction = acc.find(
                  (r) => r.value == reaction.value
                );

                if (ExistingReaction) {
                  ExistingReaction.memberIds = Array.from(
                    new Set([...ExistingReaction.memberIds, reaction.member])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.member] });
                }

                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const ReactionsWithoutMembers = FilteredReactions.map(
              ({ member, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              user,
              reactions: ReactionsWithoutMembers,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timestamp,
            };
          })
        )
      ).filter((message) => message !== null),
    };
  },
});

export const create = mutation({
  args: {
    message: v.string(),
    workspace: v.id("workspaces"),
    channel: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    parent: v.optional(v.id("messages")),
    conversation: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const CurrentMember = await getMember(UserId, args.workspace, ctx);

    if (!CurrentMember) {
      throw new Error("Unauthorized");
    }


    const CreatedMessageId = await ctx.db.insert("messages", {
      message: args.message,
      member: CurrentMember._id,
      workspace: args.workspace,
      channel: args.channel,
      image: args.image,
      parent: args.parent,
      conversation: args.conversation,
    });

    return CreatedMessageId;
  },
});

export const getByChannel = query({
  args: {
    channel: v.id("channels"),
    workspace: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return [];
    }

    const CurrentMember = await getMember(UserId, args.workspace, ctx);

    if (!CurrentMember) {
      return [];
    }

    const Messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
      .collect();

    if (!Messages || Messages.length == 0) {
      return [];
    }

    // const Reactions = await ctx.db.query('reactions')
  },
});

export const update = mutation({
  args: {
    message: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const Message = await ctx.db.get(args.message);

    if (!Message) {
      throw new Error("Message Not Found");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("user", UserId))
      .unique();

    if (!CurrentMember) {
      throw new Error("Member Not Found");
    }

    if (Message.member !== CurrentMember._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.message, {
      message: args.value,
      updated: Date.now(),
    });

    return args.message;
  },
});

export const remove = mutation({
  args: {
    message: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const Message = await ctx.db.get(args.message);

    if (!Message) {
      throw new Error("Message Not Found");
    }

    const CurrentMember = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("user", UserId))
      .unique();

    if (!CurrentMember) {
      throw new Error("Member Not Found");
    }

    if (Message.member !== CurrentMember._id) {
      throw new Error("Unauthorized");
    }

    // Removing Associated Image
    if (Message.image) {
      await ctx.storage.delete(Message.image);
    }

    // Deleting The Message
    await ctx.db.delete(Message._id);

    return args.message;
  },
});
