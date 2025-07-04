import { v } from "convex/values";
import { query } from "./_generated/server";
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
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return null;
    }

    if(!args.workspaceId) return null;
    const Member = await ctx.db.query('members').withIndex('by_user_workspace',Q => Q.eq('user',UserId).eq('workspace',args.workspaceId)).unique()

    if(!Member) return null;
    return Member
  },
});
