import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";



export const getById = query({
    args:{
        id:v.id('conversations')
    },
    handler: async (ctx,args) => {
        const UserId = await getAuthUserId(ctx)
        
        if(!UserId) {
            return null;
        }

        const conversation = await ctx.db.get(args.id);

        if(!conversation){
            return null
        }

        const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',q => q.
            eq('user',UserId)
            .eq('workspace',conversation.workspace)
        ).unique()

        if(!CurrentMember){
            return null;
        }

        return conversation;
    }
})


export const get = mutation({
    args:{
        otherMember:v.id('members'),
        workspace:v.id('workspaces')
    },
    handler: async (ctx,args) => {
        const UserId = await getAuthUserId(ctx)

        if(!UserId) {
            throw new Error('Unauthorized')
        }

        const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',q => q.
            eq('user',UserId)
            .eq('workspace',args.workspace)
        ).unique()

        if(!CurrentMember) {
            throw new Error('Member Not Found')
        }
        
        const OtherMember = await ctx.db.get(args.otherMember)
        
        if(!OtherMember) {
            throw new Error('Member Not Found')
        }

        const ExistingConversation = await ctx.db.query('conversations').filter(q => q.
            or(
                q.and(
                    q.eq(q.field('member_one'),CurrentMember._id),
                    q.eq(q.field('member_two'),OtherMember._id),
                ),
                q.and(
                    q.eq(q.field('member_one'),OtherMember._id),
                    q.eq(q.field('member_two'),CurrentMember._id),
                ),
            )
        ).unique()


        if(ExistingConversation) {
            return ExistingConversation
        }

        const CreatedConversation = await ctx.db.insert('conversations',{
            member_one:CurrentMember._id,
            member_two:OtherMember._id,
            workspace:args.workspace
        })

        return await ctx.db.get(CreatedConversation);
    }
})