import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInputs, updateBlogInputs } from "@rajnishthewolf/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<
{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
    },
    Variables : {
        userId: string;
    }

}>();

blogRouter.use('/*',async (c,next) =>{
    const authHeader = c.req.header("Authorization");
    try {
        const user = await verify(authHeader || "" ,c.env.JWT_SECRET) as {id: string} | null;
        if (user && user.id) {
            c.set("userId", user.id);
            await next();
        }else{
            c.status(500);
            return c.json({
                message: " You are not logged in"
            })
        }
    }catch(e) {
        c.status(403);
        return c.json({ message: "You are not logged in" });
    }
    

})


blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInputs.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const authorId = c.get("userId")
	const prisma = new PrismaClient({
		datasources: { db: { url: c.env.DATABASE_URL } }
	}).$extends(withAccelerate());
    try{
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(authorId)
            }
        })
        return c.json({
            id: blog.id
        });
    }catch(e) {
        c.status(411);
        return c.json({
            message: "Error while Posting the blog"
        })
    }
    
});

blogRouter.put('/',async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInputs.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
	const prisma = new PrismaClient({
		datasources: { db: { url: c.env.DATABASE_URL } }
	}).$extends(withAccelerate());
    try{
        const blog = await prisma.blog.update({
            where:{
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })
        return c.json({
            id: blog.id
        });
    }catch(e) {
        c.status(411);
        return c.json({
            message: "Error while updating the blog"
        })
    }
    
});

//  TODO ADD PAGINATION
blogRouter.get('/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasources: { db: { url: c.env.DATABASE_URL } }
	}).$extends(withAccelerate());
    const page = Number(c.req.query('page') || 1);
    const limit = Number(c.req.query('limit') || 10);
    const skip = (page - 1) * limit;

    try {
        const blogs = await prisma.blog.findMany({
            skip,
            take: limit
        });
        return c.json({ blogs });
    } catch (error) {
        c.status(500);
        return c.json({ message: "Error while fetching blog posts" });
    }
});

blogRouter.get('/:id',async (c) => {
    const id = c.req.param("id");
	const prisma = new PrismaClient({
		datasources: { db: { url: c.env.DATABASE_URL } }
	}).$extends(withAccelerate());
    try{
        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            }
        })
        return c.json({
            blog
        });
    }catch(e){
        c.status(500);
        return c.json({
            message: "Error while fetching blog post"
        });
    }
    
	
});



