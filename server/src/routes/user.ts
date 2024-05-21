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
    const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    try{
        body = await c.req.json();
    } catch(error) {
        c.status(401);
        return c.json({error: "Please provide valid credentials!"})
    }

    const saltRounds = 10;
    
    try{
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword
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