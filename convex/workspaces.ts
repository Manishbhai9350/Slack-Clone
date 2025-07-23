import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GenerateJoinCode } from "./lib/index";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const joinCode = GenerateJoinCode();

    const CreatedWorkSpaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      joinCode,
      user: UserId
    });

    await ctx.db.insert("members", {
      user: UserId,
      workspace: CreatedWorkSpaceId,
      role: "admin",
    });

    await ctx.db.insert("channels",{
      name:'general',
      workspace:CreatedWorkSpaceId
    })

    return CreatedWorkSpaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return [];
    }

    const Members = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("user", UserId))
      .collect();

    if (!Members || Members.length == 0) return;

    const WorkspacesIds = Members.map((M) => M.workspace);

    if (!WorkspacesIds || WorkspacesIds.length == 0) return [];

    const Workspaces = [];

    for (const WorkspaceId of WorkspacesIds) {
      const WorkSpace = await ctx.db.get(WorkspaceId);
      if (WorkSpace) {
        Workspaces.push(WorkSpace);
      }
    }

    return Workspaces;
  },
});

export const getInfo = query({
  args: {
    workspaceId:v.id('workspaces')
  },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      return null;
    }

    const Workspace = await ctx.db.get(args.workspaceId)
    const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',e => e.eq('user',UserId).eq('workspace',args.workspaceId)).unique()

    if(!Workspace) return null;

    return {
      name:Workspace.name,
      isMember:!!CurrentMember
    };
  },
});

export const getWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

    const Member = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (I) =>
        I.eq("user", UserId).eq("workspace", args.workspaceId)
      )
      .unique();

    if (!Member) return null;

    const WorkSpace = await ctx.db.get(Member.workspace);

    return WorkSpace;
  },
});

export const update = mutation({
  args: { id: v.id("workspaces"), name: v.string() },
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }
    
    const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',e => e.eq('user',UserId).eq('workspace',args.id)).unique()
    
    if(!CurrentMember || CurrentMember.role !== 'admin') {
      throw new Error("Unauthorized");
    };

    await ctx.db.patch(args.id,{name:args.name})

    return args.id
  },
});

export const remove = mutation({
  args: { id: v.id("workspaces")},
  handler: async (ctx, args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

      
    const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',e => e.eq('user',UserId).eq('workspace',args.id)).unique()
    
    if(!CurrentMember || CurrentMember.role !== 'admin') {
      throw new Error("Unauthorized");
    };

    const [Members] = await Promise.all([
      ctx.db.query('members').withIndex('by_workspace',e => e.eq('workspace',args.id)).collect()
    ])

    for(const Member of Members) {
      await ctx.db.delete(Member._id)
    }
    
    await ctx.db.delete(args.id);

    return true;
  },
});


export const regenerateJoinCode = mutation({
  args:{
    workspaceId:v.id('workspaces')
  },
  handler:async (ctx,args) => {
    const UserId = await getAuthUserId(ctx);
    if (!UserId) {
      throw new Error("Unauthorized");
    }

      
    const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',e => e.eq('user',UserId).eq('workspace',args.workspaceId)).unique()
    
    if(!CurrentMember || CurrentMember.role !== 'admin') {
      throw new Error("Unauthorized");
    }

    const newCode = GenerateJoinCode(6)

    await ctx.db.patch(args.workspaceId,{
      joinCode:newCode
    })

    return args.workspaceId;
  }
})




export const join = mutation({
  args:{
    workspaceId:v.id('workspaces'),
    joinCode:v.string()
  },
  handler: async (ctx,args) => {
    const UserId = await getAuthUserId(ctx);

    if (!UserId) {
      throw new Error("Unauthorized");
    }

      
    const CurrentMember = await ctx.db.query('members').withIndex('by_user_workspace',e => e.eq('user',UserId).eq('workspace',args.workspaceId)).unique()

    if(CurrentMember) {
      throw new Error('Already A Member');
    }

    const Workspace = await ctx.db.get(args.workspaceId)

    if(!Workspace) {
      throw new Error("Workspace Not Found")
    }
    
    if(Workspace.joinCode.toLowerCase() !== args.joinCode.toLowerCase()){
      throw new Error("Unable To Join Workspace")
    }

    await ctx.db.insert('members',{
      user:UserId,
      workspace:Workspace._id,
      role:'member'
    })

    return Workspace._id;
  }
})