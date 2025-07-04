/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator, } from "convex/server";

interface Threads {
  count: number;
  image: string | null;
  timestamp: number;
}

type ReactionSummary = {
  value: string;
  count: number;
};

export const populateReactions = async (
  messageId: Id<"messages">,
  ctx: QueryCtx
): Promise<ReactionSummary[]> => {
  const reactions = await ctx.db
    .query("reactions")
    .withIndex("by_message", (q) => q.eq("message", messageId))
    .collect();

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

    let _conversation = args.conversation;

    if (args.parent && !args.channel && !args.conversation) {
      const conversation = await ctx.db
        .query("messages")
        .withIndex("by_parent", (q) => q.eq("parent", args.parent))
        .unique();

      if (conversation) {
        _conversation = conversation.conversation;
      }
    }

    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_channel_parent_conversation", (q) =>
        q
          .eq("channel", args.channel)
          .eq("parent", args.parent)
          .eq("conversation", _conversation)
      )
      .order("desc")
      .paginate(args.paginationOpts); // 👈 Keep as-is

    const hydratedPage = await Promise.all(
      messagesPage.page.map(async (message) => {
        const reactions = await populateReactions(message._id, ctx);

        let user = null;
        const Member = await populateMember(message.member, ctx);
        if (Member) {
          user = await populateUser(Member.user, ctx);
        }

        let img = ''
        if(message.image) {
          const ImageUrl = await ctx.storage.getUrl(message.image)
          img = ImageUrl || ''
        }

        return {
          ...message,
          member:Member,
          img,
          reactions,
          user,
        };
      })
    );

    // ✅ Must return the pagination object
    return {
      ...messagesPage,
      page: hydratedPage, // Replace original page with hydrated data
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

    let _conversation = args.conversation;

    // Replying Case IN 1:1 Conversation
    if (!_conversation && args.parent && !args.channel) {
      const Message = await ctx.db.get(args.parent);

      if (!Message) {
        throw new Error("No Parent Found");
      }

      _conversation = Message.conversation;
    }

    const CreatedMessageId = await ctx.db.insert("messages", {
      message: args.message,
      member: CurrentMember._id,
      workspace: args.workspace,
      channel: args.channel,
      image: args.image,
      parent: args.parent,
      conversation: _conversation,
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
  args:{
    message:v.id('messages'),
    value:v.string()
  },
  handler:async (ctx,args) => {
    const UserId = await getAuthUserId(ctx);
    if(!UserId) {
      throw new Error('Unauthorized')
    }

    const Message = await ctx.db.get(args.message)

    if(!Message) {
      throw new Error('Message Not Found')
    }
    
    const CurrentMember = await ctx.db.query('members').withIndex('by_user',q => q.eq('user',UserId)).unique()

    if(!CurrentMember) {
      throw new Error('Member Not Found')
    }

    if(Message.member !== CurrentMember._id){
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.message,{
      message:args.value,
      updated:Date.now()
    });

    return args.message;
  }
})



export const remove =  mutation({
  args:{
    message:v.id('messages')
  },
  handler:async (ctx,args) => {
    const UserId = await getAuthUserId(ctx);
    if(!UserId) {
      throw new Error('Unauthorized')
    }

    const Message = await ctx.db.get(args.message)

    if(!Message) {
      throw new Error('Message Not Found')
    }
    
    const CurrentMember = await ctx.db.query('members').withIndex('by_user',q => q.eq('user',UserId)).unique()

    if(!CurrentMember) {
      throw new Error('Member Not Found')
    }

    if(Message.member !== CurrentMember._id){
      throw new Error('Unauthorized')
    }

    // Removing Associated Image
    if(Message.image){
      await ctx.storage.delete(Message.image)
    }


    // Deleting The Message
    await ctx.db.delete(Message._id);

    return args.message;
  }
})
