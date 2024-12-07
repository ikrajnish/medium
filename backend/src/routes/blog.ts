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

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});


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

blogRouter.get('/bulk', async (c) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        c.status(403);
        return c.json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        console.log('Decoded JWT payload:', payload);

        const prisma = new PrismaClient({
            datasources: { db: { url: c.env.DATABASE_URL } }
        }).$extends(withAccelerate());

        const blogs = await prisma.blog.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({ blogs });

    } catch (error) {
        console.error('Token verification failed:', error);
        c.status(403);
        return c.json({ message: 'Invalid or expired token' });
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



