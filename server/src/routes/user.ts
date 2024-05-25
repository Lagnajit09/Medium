import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'
import { signinInput, signupInput } from "@lagnajit09/medium-zod"


// Create the main Hono app
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();


//roexport utes
userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    
    let body;

    try{
        body = await c.req.json();
    } catch(error) {
        c.status(401);
        return c.json({error: "Please provide valid credentials!"})
    }

    const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    const saltRounds = 10;
    
    try{
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)

        const userExists = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if(userExists) {
            c.status(405)
            return c.json({error: "User already exists!"})
        }

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name || ""
            }
        })
    
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
    
        return c.json({jwt})
    } catch(e) {
        c.status(403);
        return c.json({ error: "error while signing up" });
    } 
})
    
    
userRouter.post('/signin', async (c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        try{
            const body = await c.req.json();

            const { success } = signinInput.safeParse(body);
            if (!success) {
                c.status(400);
                return c.json({ error: "invalid input" });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: body.email
                }
            });
    
            if (!user) {
                c.status(403);
                return c.json({ error: "user not found" });
            }
    
            const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
            return c.json({ jwt  });
        } catch(error) {
            c.status(403);
            return c.json({ error: "error while signing in" });
        }
})

userRouter.post('/user-topics/:id', async (c) => {

    const userId = c.req.param('id')

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        const followedTopics = body.userTopics;

        // Find the user by userId
        // const user = await prisma.user.findUnique({
        //   where: { id: userId },
        //   include: { topics: true }, // Include the user's current followed topics
        // });
    
        // Update user's followed topics
        await prisma.user.update({
          where: { id: userId },
          data: {
            topics: {
              // Replace the user's current followed topics with the new ones
              set: followedTopics.map((topicId:String) => ({ id: topicId })),
            },
          },
        });
        
        return c.json({ message: 'Followed topics updated successfully' });
      } catch (error) {
        console.error('Error updating followed topics:', error);
        c.status(500)
        return c.json({ error: 'Failed to update followed topics' });
      }
})