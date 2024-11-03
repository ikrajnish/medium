import z from "zod";
export const signupInputs = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export const signinInputs = z.object({
    username: z.string().email(),
    password: z.string().min(6)
})

export const createBlogInputs = z.object({
    title: z.string(),
    content: z.string()
})


export const updateBlogInputs = z.object({
    title: z.string(),
    content: z.string(),
    id:z.number()
})
export type signupInputs = z.infer<typeof signupInputs>
export type signinInputs = z.infer<typeof signinInputs>
export type createBlogInputs = z.infer<typeof createBlogInputs>
export type updateBlogInputs = z.infer<typeof updateBlogInputs>
