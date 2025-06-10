import { query } from "./_generated/server";
import { auth } from "./auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
        const UserId = await auth.getUserId(ctx);
        if (UserId === null) {
            return null;
        }
        return await ctx.db.get(UserId);
  },
});
