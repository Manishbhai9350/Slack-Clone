import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const UserId = await getAuthUserId(ctx);
    if (UserId === null) {
      return null;
    }
    return await ctx.db.get(UserId);
  },
});
