import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";



export const get = query({
  args:{workspaceId:v.id("workspaces")},
  handler:async (ctx, args) => {
    const UserId = await getAuthUserId(ctx)
    if (!UserId) {
      return null;
    }

    const MembersDocuments = await ctx.db.query('members').withIndex('by_workspace',q => q.eq('workspace',args.workspaceId)).collect();

    const Members = [];

    for(const MemberDocument of MembersDocuments){
      const User = await ctx.db.get(MemberDocument.user);
      Members.push({
        ...MemberDocument,
        User
      })
    }


    return Members;
  },
})


export const current = query({
  args: { workspace: v.id("workspaces") },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return null;
    }

    if(!args.workspace) return null;
    const Member = await ctx.db.query('members').withIndex('by_user_workspace',Q => Q.eq('user',UserId).eq('workspace',args.workspace)).unique()

    if(!Member) return null;
    return Member
  },
});


export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return null;
    }

    if(!args.id) return null;
    const currentMember = await ctx.db.query('members').withIndex('by_user',q => q.eq('user',UserId)).unique()
    if(!currentMember) return null;
    
    const Member = await ctx.db.get(args.id)
    if(!Member) return null;

    const MemberUser = await ctx.db.get(Member.user)

    if(!MemberUser) {
      return null;
    }


    return {
      ...Member,
      user:MemberUser
    }
  },
});


export const update = mutation({
  args:{
    member:v.id('members'),
    role:v.union(v.literal('admin'),v.literal('member'))
  },
  handler: async (ctx,args) => {
    const UserId = await getAuthUserId(ctx)
    if(!UserId) {
      return null;
    }

    const member = await ctx.db.get(args.member);

    if(!member) {
      return null;
    }

    const currentMember = await ctx.db.query('members').withIndex('by_user_workspace',q => q
      .eq('user',UserId)
      .eq('workspace',member.workspace)
    ).unique()
    if(!currentMember) return null;


    if(currentMember.role !== 'admin') {
      throw new Error('Unauthorized')
    }
    
    if(currentMember._id == member._id) {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.member,{
      role:args.role
    })

    return args.member;
  }
})



export const remove = mutation({
  args:{
    member:v.id('members')
  },
  handler: async (ctx,args) => {
    const UserId = await getAuthUserId(ctx)

    if(!UserId) {
      throw new Error('Unauthorized')
    }
    
    const currentMember = await ctx.db.query('members').withIndex('by_user',q => q.eq('user',UserId)).unique()
    
    if(!currentMember) {
      throw new Error('Unauthorized')
    };

    const Member = await ctx.db.get(args.member);

    if(!Member) {
      throw new Error('Member not found')
    }
    
    if(currentMember.role !== 'admin') {
      throw new Error('Unauthorized')
    }
    if(Member.role == 'admin') {
      throw new Error('Unauthorized')
    }

    const [
      messages,
      reactions,
      conversations
    ] = await Promise.all([
      ctx.db.query('messages').withIndex('by_member',q => q.eq('member',Member._id)).collect(),      
      ctx.db.query('reactions').withIndex('by_member',q => q.eq('member',Member._id)).collect(),      
      ctx.db.query('conversations').filter(q => q.or(
        q.eq(q.field('member_one'),Member._id),
        q.eq(q.field('member_two'),Member._id),
      )).collect()
    ])

    for(const message of messages) {
      await ctx.db.delete(message._id)
    }
    for(const reaction of reactions) {
      await ctx.db.delete(reaction._id)
    }
    for(const conversation of conversations) {
      await ctx.db.delete(conversation._id)
    }

    await ctx.db.delete(Member._id)

    return args.member;
  }
})

