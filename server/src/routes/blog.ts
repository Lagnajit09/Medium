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


//Add a new blog (publish)
blogRouter.post("/post/publish", async (c) => {
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

        // Create a new post
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
                published: true,
                topicId: Number(body.topic)
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                topic: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return c.json(blog)
    } catch(error) {
        console.error(error)
        c.status(500);
        return c.json({error : 'Error while publishing post!'})
    }
    
})


//Add a new blog (save)
blogRouter.post("/post/save", async (c) => {
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

        if(!body.title && !body.content) {
            c.status(410);
            return c.json({error: "No data to save."})
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
                topicId: 70000
            }, include: {
                topic: true
            }
        })

        blog.content = JSON.parse(blog.content)

        return c.json(blog)
    } catch(error) {
        console.error(error)
        c.status(500);
        return c.json({error : 'Error while saving post!'})
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

	    const post = await prisma.post.update({
		    where: {
			    id: body.id,
			    authorId: userId
		    },
		    data: {
			    title: body.title,
			    content: body.content,
                topicId: Number(body.topic)
		    }, include: {
                topic: true
            }
	    });

	    return c.json(post);

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
            },
            include: {
                topic: true
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
        // Find the user by userId and include their followed topics and posts with author and topic details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: {
                    where: { published: true },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        author: {
                            select: {
                                name: true,
                                email: true,
                                image: true
                            }
                        },
                        topic: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                topics: {
                    include: {
                        posts: {
                            where: { published: true },
                            include: {
                                author: {
                                    select: {
                                        name: true,
                                        email: true,
                                        image: true
                                    }
                                },
                                topic: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Define the type for the posts array
        type PostWithDetails = {
            id: number;
            title: string;
            content: string;
            published: boolean;
            createdAt: Date;
            authorId: string;
            topicId: number;
            author: {
                name: string | null;
                email: string;
            };
            topic: {
                id: number;
                name: string;
            };
        };

        // Extract posts from user's own posts and followed topics' posts
        let posts: PostWithDetails[] = user ? [...user.posts] : [];

        if (user) {
            user.topics.forEach(topic => {
                topic.posts.forEach(post => {
                    if (!posts.some(existingPost => existingPost.id === post.id)) {
                        posts.push({
                            ...post,
                            topic: {
                                id: topic.id,
                                name: topic.name
                            }
                        });
                    }
                });
            });
        }

        return c.json(posts);
    } catch (error) {
        console.error('Error fetching posts for followed topics:', error);
        c.status(500);
        return c.json({ error: 'Failed to fetch posts for followed topics' });
    } finally {
        await prisma.$disconnect(); // Ensure the Prisma client is properly disconnected
    }
});


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
            }, include : {
                topic: true,
                author: true
            }
        });

        if(!post) {
            c.status(404);
            return c.json({message: "No post found!"})
        }

        post.content = JSON.parse(post.content)
    
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
          mainTopic: {id:mainTopic.id, name:mainTopic.name},
          subtopics: mainTopic.topics.map(topic => {return {id: topic.id, name:topic.name}})
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
        // let topics = subtopics.map((i) => i.name);

        return c.json(subtopics)
    } catch (error) {
        c.status(404);
        return c.json("No topics available")
    }
})


//Search by Topic and return the posts
blogRouter.get('/topics/:id', async (c) => {
    const id = c.req.param('id')

    try {
        let topicsWithPosts = [];

        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const mainTopic = await prisma.mainTopic.findUnique({
            where: { id: Number(id) },
            include: {
                topics: {
                    include: {
                        posts: {
                            include: {
                                author: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                        users: true
                    }
                }
            }
        });

        if (mainTopic) {
            mainTopic.topics.forEach(topic => {
                topicsWithPosts.push({
                    topic: {
                        id: topic.id,
                        name: topic.name,
                        mainTopicId: topic.mainTopicId,
                    },
                    posts: topic.posts,
                    userCount: topic.users.length,
                    users: topic.users
                });
            });
        } else {
            const topic = await prisma.topic.findUnique({
                where: { id: Number(id) },
                include: {
                    posts: {
                        include: {
                            author: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    users: true
                }
            });

            if (topic) {
                topicsWithPosts.push({
                    topic: {
                        id: topic.id,
                        name: topic.name,
                        mainTopicId: topic.mainTopicId
                    },
                    posts: topic.posts,
                    userCount: topic.users.length,
                    users: topic.users
                });
            }
        }

        return c.json(topicsWithPosts);

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


// Route to check and update recommended topics for a user
blogRouter.get('/:userId/recommended-topics', async (c) => {
    const  userId  = c.req.param('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
  
    try {
        // Step 1: Find user's followed topics
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                topics: true
            }
        });

        if (!user) {
            c.status(404);
            return c.json({ error: 'User not found' });
        }

        const followedTopicIds = user.topics.map(topic => topic.id);
        const followedMainTopicIds = user.topics.map(topic => topic.mainTopicId);

        // Step 2: Find user's current recommended topics from the recommendation table
        const currentRecommendations = await prisma.recommendedTopic.findMany({
            where: { userId },
            include: { topic: true }
        });

        // Step 3: Find the respective mainTopics of user followed topics
        const mainTopics = await prisma.mainTopic.findMany({
            where: { id: { in: followedMainTopicIds } },
            include: { topics: true }
        });

        // Step 4: Check which sub-topics of main topics are not followed by the user
        let newRecommendedTopics = Array()
        for (const mainTopic of mainTopics) {
            const notFollowedTopics = mainTopic.topics.filter(topic => !followedTopicIds.includes(topic.id));
            if (notFollowedTopics.length > 0) {
                // Get one or two topics from each main topic
                const selectedTopics = notFollowedTopics.slice(0, 2);
                newRecommendedTopics = newRecommendedTopics.concat(selectedTopics);
            }
        }

        // Step 5: If we have fewer than 7 topics, fill with random topics
        if (newRecommendedTopics.length < 7) {
            const allTopics = await prisma.topic.findMany({
                where: {
                    id: { notIn: followedTopicIds }
                }
            });
            const remainingTopics = allTopics.sort(() => 0.5 - Math.random()).slice(0, 7 - newRecommendedTopics.length);
            newRecommendedTopics = newRecommendedTopics.concat(remainingTopics);
        } else {
            // Shuffle and take the first 7 if we have more than 7 topics
            newRecommendedTopics = newRecommendedTopics.sort(() => 0.5 - Math.random()).slice(0, 7);
        }

        // Step 6: Delete current recommended topics
        await prisma.recommendedTopic.deleteMany({
            where: { userId }
        });

        // Step 7: Store new recommended topics in the table
        const recommendationsToCreate = newRecommendedTopics.map(topic => ({
            userId,
            topicId: topic.id
        }));

        await prisma.recommendedTopic.createMany({
            data: recommendationsToCreate
        });

        return c.json(newRecommendedTopics);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        c.status(500);
        return c.json({ error: 'Failed to generate recommendations' });
    }
  });
