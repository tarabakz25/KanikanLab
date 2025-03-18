import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { client } from "../lib/cosmic";

export const getLike = defineAction({
    input: z.object({
        blogId: z.string()
    }),
    handler: async ({ blogId }) => {
        const BlogResponse = await client.objects.findOne({ _id: blogId })
        const LikeCount = BlogResponse.like_count || 0
        return { LikeCount }
    }
})

export const addLike = defineAction({
    input: z.object({
        blogId: z.string()
    }),
    handler: async ({ blogId }) => {
        try {
            if (blogId === "0") {
                throw new Error("Invalid blogId");
            }
            const BlogResponse = await client.objects.findOne({ _id: blogId })
            const LikeCount = BlogResponse.like_count || 0
            const NewLikeCount = LikeCount + 1
            await client.objects.updateOne(blogId, { metadata: {
                ...BlogResponse.metadata,
                like_count: NewLikeCount
            } })
            return { NewLikeCount }
        } catch (error) {
            console.error(error)
            throw new Error("Failed to add like");
        }
    }
})