import { Hono } from 'hono';
import {  verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from "@lagnajit09/medium-zod"
import { bodyLimit } from 'hono/body-limit';

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


//middleware to authenticate jwt
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


//Add a new blog
blogRouter.post("/post", async (c) => {
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

        if(!body.title || !body.content || !body.topic) {
            c.status(410);
            return c.json({error: "Insufficient data"})
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
                topicId: Number(body.topic)
            }
        })

        return c.json(blog)
    } catch(error) {
        console.error(error)
        c.status(500);
        return c.json({error : 'Internal server error'})
    }
    
})


//update a blog
blogRouter.put('/post', async (c) => {
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

        if(!body.title && !body.content && !body.topic) {
            c.status(410);
            return c.json({error: "Insufficient data"})
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
			    content: body.content,
                topicId: Number(body.topic)
		    }
	    });

	    return c.text('updated post');

    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }
})


//get all blogs
blogRouter.get('/post/bulk', async (c) => {
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


//get user blogs
blogRouter.get('/post/user-posts', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: c.env.DATABASE_URL,
                },
            },
        });

        const body = await c.req.json();

        const posts = await prisma.post.findMany({
            where: {
                authorId: body.userId
            }
        });
        console.log(posts);
        return c.json({ posts });
    } catch (error: any) {
        console.error("Error accessing the database:", error);
        c.status(500);
        return c.json({ error: 'Internal server error', details: error.message });
    }
});


//get blogs of user-followed topics
blogRouter.get('/post/followed-posts', async (c) => {

    const userId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        // Find the user by userId and include their followed topics
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { topics: { include: { posts: true } } },
        });
    
        // Extract posts from user's followed topics
        let posts = Array()
        if(user) {
            posts = user.topics.reduce((allPosts, topic:any) => allPosts.concat(topic.posts), []);
        }
    
        return c.json(posts);
      } catch (error) {
        console.error('Error fetching posts for followed topics:', error);
        c.status(500)
        return c.json({ error: 'Failed to fetch posts for followed topics' });
      }
})


//get a particular blog
blogRouter.get('/post/:id', async (c) => {

    try {
        const id = c.req.param('id');
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
    
        return c.json(post);
    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }	
})


//delete a blog
blogRouter.delete("/post/:id", async (c) => {
    const id = c.req.param('id')
    const userId = c.get('userId')

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const body = await c.req.json();

        if(body.userId !== userId) {
            c.status(400)
            return c.json({'error' : 'unauthorised access!'})
        }

        const post = await prisma.post.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({'message': 'Deleted successfully!'})

    } catch (error) {
        c.status(500);
        console.log(error)
        return c.json({error : 'Internal server error'})
    }
})


//Add a comment on a post
blogRouter.post('/comment', async (c) => {
    try {
        const userId = c.get('userId');

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const body = await c.req.json();

        if(!body.postId || !body.comment) {
            c.status(410);
            return c.json({error: "Insuffiecient data"})
        }

        const comment = await prisma.comment.create({
            data: {
                comment: body.comment,
                userId: userId,
                postId: Number(body.postId)
            }
        })

        return c.json(comment)
    } catch(error) {
        c.status(500);
        return c.json({error : 'Internal server error'})
    }
})


//show comments of a post
blogRouter.get('/comment/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const id = c.req.param('id')

    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: Number(id)
            }
        })
        return c.json(comments)
    } catch (error) {
        c.status(500);
        return c.json("Error while fetching comments.")
    }
})


//Delete a comment
blogRouter.delete("/comment/:id", async (c) => {
    const id = c.req.param('id')
    const userId = c.get('userId')

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const body = await c.req.json();

        if(body.userId !== userId) {
            c.status(400)
            return c.json({'error' : 'unauthorised access!'})
        }

        const comment = await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({'message': 'Deleted successfully!'})

    } catch (error) {
        c.status(500);
        console.log(error)
        return c.json({error : 'Internal server error'})
    }
})


//show all bookmarked posts
blogRouter.get('/bookmarks', async (c) => {
    const userId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId
            },
            include: {
                post: true // Include details of the associated post
            }
        })

        return c.json(bookmarks)
    } catch (error) {
        c.status(500);
        return c.json("Error while fetching bookmarks.")
    }
})


//Save a post
blogRouter.post('/bookmark/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: userId,
                postId: Number(id)
            }
        })

        return c.json(bookmark)
    } catch(error) {
        c.status(500);
        return c.json({error : 'Error while saving the blog.'})
    }
})


//Unsave a post
blogRouter.delete("/bookmark/:id", async (c) => {
    const id = c.req.param('id')
    const userId = c.get('userId')

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const bookmark = await prisma.bookmark.delete({
            where: {
                id: Number(id),
                userId: userId
            }
        });

        return c.json({'message': 'Deleted successfully!'})

    } catch (error) {
        c.status(500);
        console.log(error)
        return c.json({error : 'Error while unsaving thhe blog.'})
    }
})


//View all topics and their subtopics
blogRouter.get('/topics', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const mainTopics = await prisma.mainTopic.findMany({
            include: {
              topics: true // Include subtopics
            }
        });

        // Structure the topics in a better way
        const structuredTopics = mainTopics.map(mainTopic => {
        return {
          mainTopic: mainTopic.name,
          subtopics: mainTopic.topics.map(topic => topic.name)
        };
        });
  
        return c.json(structuredTopics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        c.status(500)
        return c.json({ error: 'Failed to fetch topics' });
    }
})


//show all subtopics to the new user to follow
blogRouter.get('/alltopics', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const subtopics = await prisma.topic.findMany({});
        let topics = subtopics.map((i) => i.name);

        return c.json(topics)
    } catch (error) {
        c.status(404);
        return c.json("No topics available")
    }
})


//Search by Topic and return the posts
blogRouter.get('/topics/:id', async (c) => {
    const id = c.req.param('id')

    try {
        let posts = Array();
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());

        const mainTopic = await prisma.mainTopic.findUnique({
            where: { id: Number(id) },
            include: { topics: { include: { posts: true } } }
          });

        if(mainTopic) {
            mainTopic.topics.forEach(topic => {
                posts = posts.concat(topic.posts);
              });
        } else {
            const topic = await prisma.topic.findUnique({
                where: { id: Number(id) },
                include: { posts: true }
            });
        
            if(topic) {
                posts = topic.posts;
            }
        }

        return c.json(posts);

    } catch (error) {
        console.error(error)
        c.status(500);
        return c.json({error: "Error while fetching topic posts."})
    }
})


blogRouter.post('/addmaintopic', async (c) => {
//     const topic = await c.req.json()

//     try {

//         const prisma = new PrismaClient({
//             datasourceUrl: c.env?.DATABASE_URL	,
//         }).$extends(withAccelerate());

//         await prisma.mainTopic.create({
//             data: {
//                 name: topic.name
//             }
//         })

//         return c.json("Created")

        
//     } catch (error) {
//         c.status(500)
//         return c.json("error")
//     }
})



//user follow topic
//firebase storage integration for image
