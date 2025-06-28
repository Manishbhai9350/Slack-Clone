import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";


export const GenerateUploadUrl = mutation({
    args:{},
    handler: async (ctx, args) => {
        const UserId = await getAuthUserId(ctx);
        if (!UserId) {
          throw new Error("Unauthorized");
        }

        const Url = await ctx.storage.generateUploadUrl()

        return Url;
    }
})