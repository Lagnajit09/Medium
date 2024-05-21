import { Hono } from 'hono';
import {  verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from "@lagnajit09/medium-zod"

// Create the main Hono app
export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
	Variables : {
		userId: string
	}
}>();

blogRouter.use('/*', async (c, next) => {
	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id as string);
	await next()
})

blogRouter.post("/", async (c) => {
    try {
        const userId = c.get('userId');

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const body = await c.req.json();

        const { success } = createPostInput.safeParse(body);
        if (!success) {
            c.status(400);
            return c.json({ error: "invalid input" });
        }

        if(!body.title || !body.content) {
            c.status(410);
            return c.json({error: "Please provide a title and a content."})
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        })

        return c.json({blog})
    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }
    
})

blogRouter.put('/', async (c) => {
    try {

        const userId = c.get('userId');
	    const prisma = new PrismaClient({
		    datasourceUrl: c.env?.DATABASE_URL	,
	    }).$extends(withAccelerate());

	    const body = await c.req.json();

        const { success } = updatePostInput.safeParse(body);
        if (!success) {
            c.status(400);
            return c.json({ error: "invalid input" });
        }

        if(!body.title && !body.content) {
            c.status(410);
            return c.json({error: "Please provide title or content."})
        }

        if(body.userId !== userId) {
            c.status(400);
            return c.json({error: "unauthorized access!"})
        }

	    await prisma.post.update({
		    where: {
			    id: body.id,
			    authorId: userId
		    },
		    data: {
			    title: body.title,
			    content: body.content
		    }
	    });

	    return c.text('updated post');

    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }
})

blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: c.env.DATABASE_URL,
                },
            },
        });
        const posts = await prisma.post.findMany({});
        console.log(posts);
        return c.json({ posts });
    } catch (error: any) {
        console.error("Error accessing the database:", error);
        c.status(500);
        return c.json({ error: 'Internal server error', details: error.message });
    }
});

blogRouter.get('/:id', async (c) => {

    try {
        const id = c.req.param('id');
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });
    
        return c.json(post);
    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }	
})
