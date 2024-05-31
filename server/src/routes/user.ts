import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'
import { signinInput, signupInput } from "@lagnajit09/medium-zod"
import { load } from "cheerio";
import axios from "axios";

// Create the main Hono app
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
	Variables : {
		userId: string
	}
}>();


//export routes

//SIGNUP
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
            }, include: {
                posts: true,
                topics: true
            }
        })
    
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    
        return c.json({jwt, user: user})
    } catch(e) {
        c.status(500);
        return c.json({ error: "error while signing up" });
    } 
})
    
    
//SIGNIN
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
                }, include: {
                  posts: true,
                  topics: true
                }
            });
    
            if (!user) {
                c.status(405);
                return c.json({ error: "user not found" });
            }
    
            const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
            return c.json({ jwt, user: user  });
        } catch(error) {
            c.status(500);
            return c.json({ error: "error while signing in" });
        }
})


//GET USER BY ID
userRouter.get('/:id', async (c) => {

  const id = c.req.param('id')

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if(!user) {
      return c.text('User not found!', 404)
    }

    return c.json(user)
  } catch (error) {
    return c.text('Error while fetching user details!', 500)
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


// Route to fetch topics followed by a specific user
userRouter.get('/:userId/topics', async (c) => {
    const userId  = c.req.param('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const userWithTopics = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          topics: true,
        },
      });
  
      if (!userWithTopics) {
        c.status(404);
        return c.json({ message: 'User not found' });
      }
  
      return c.json(userWithTopics.topics);
    } catch (error) {
      console.error(error);
      c.status(500)
      c.json({ message: 'Internal server error' });
    }
  });


  //api route to handle requests
userRouter.get("/fetchurl", async (c) => {
    try {
      //get url to generate preview, the url will be based as a query param.
      const url = c.req.query('url');
      console.log(c)

      if(!url) {
        c.status(404);
        return c.json("URL not found!")
      }

      /*request url html document*/
      const { data } = await axios.get(url);
      //load html document in cheerio
      const $ = load(data);
  
      /*function to get needed values from meta tags to generate preview*/
      const getMetaTag = (name: any) => {
        return (
          $(`meta[name=${name}]`).attr("content") ||
          $(`meta[propety="twitter${name}"]`).attr("content") ||
          $(`meta[property="og:${name}"]`).attr("content")
        );
      };
  
      /*Fetch values into an object */
      const preview = {
        success: 1,
        link: url,
        meta:{
            title: $("title").first().text(),
            description: getMetaTag("description"),
            image: getMetaTag("image"),
            author: getMetaTag("author"),
            url,
        },
      };
  
      //Send object as response
      return c.json(preview);
    } catch (error) {
        c.status(500);
        c.json(
          "Something went wrong, please check your internet connection and also the url you provided"
        );
    }
  });