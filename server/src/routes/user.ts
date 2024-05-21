import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'

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
        c.status(400);
        return c.json({error: "Please provide valid credentials!"})
    }

    const saltRounds = 10;
    
    try{
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password
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
    
        const body = await c.req.json();
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
    })