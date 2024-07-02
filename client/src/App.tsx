import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/landing-page/landing'
import Footer from './components/Footer'
import Home from './pages/home'
import { useEffect, useState } from 'react'
import Loading from './components/Loading'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { authUserAtom } from './store/authAtom'
import { loadingAtom } from './store/loader'
import SelectTopic from './pages/get-started/selectTopic'
import NewBlog from './pages/newBlog'
import EditBlog from './pages/editBlog'
import { getUserById } from './handlers/authHandlers'
import PublishBlog from './pages/publishBlog'
import AllTopics from './pages/allTopics'
import TopicPosts from './pages/topicPosts'
import UpdateProfile from './pages/get-started/updateProfile'
import ReadBlog from './pages/readBlog'
import { ThemeProvider } from './ThemeContext';
import { fetchHomeBlogs } from './handlers/userHandlers'
import { BlogSkeleton } from './components/BlogSkeleton'
import { Skeleton } from '@mui/material'
import { blogsAtom } from './store/userAtom'

function App() {
  const  setAuthUser = useSetRecoilState(authUserAtom)
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const setBlogs = useSetRecoilState(blogsAtom);
  const location = useLocation();
  const navigate = useNavigate()

    // Define the routes where Navbar and Footer should not be displayed
    const noNavFooterRoutes = [
      '/new-story',
      '/story/publish',
      '/get-started/profile',
      '/get-started/topics',
      '/mobile-view',
      // Define regex patterns for dynamic routes
      /^\/blog\/\d+\/edit$/,
    ];
  
    // Check if the current path is in the noNavFooterRoutes list
    const hideNavFooter = location.pathname === '/' || noNavFooterRoutes.some(route => {
      if (typeof route === 'string') {
        return location.pathname.startsWith(route);
      } else if (route instanceof RegExp) {
        return route.test(location.pathname);
      }
      return false;
    });

  useEffect(() => {
    const isAuthenticated = async () => {

      setLoading(true);
      const userId = localStorage.getItem('medium-userId')
      try {
        if(userId) {
          const data = await getUserById(userId);
          console.log(data)
          setAuthUser({user:data});
          location.pathname==='/' && navigate('/home')
        }
      } catch (error) {
        console.error('Error while finding user!');
      } finally {
        setLoading(false);
      }
    };

    isAuthenticated();
  }, []);

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await fetchHomeBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false)
      } catch (error) {
        setLoading(true)
      }
    }

    if(localStorage.getItem('medium-userId'))
      fetchBlogs()
  }, []);

  if(loading) {
  return(       
  <div className=' w-[95%] md:w-[60%] mt-16 pl-6 md:pl-72 mb-10 bg-transparent'>
    <Skeleton variant='rectangular' className=' rounded-3xl w-full h-1' height={5} />
    <BlogSkeleton />
    <BlogSkeleton />
    <BlogSkeleton />
  </div>)
  }

  if (loading) {
    return <Loading /> // Display a loading indicator while checking authentication
  }

  return (
    <>
        {!loading && !hideNavFooter &&
          <Navbar />
        }
          {!loading && 
          <Routes>
             <Route path="/" 
              element={
                <Landing showSignIn={showSignIn} showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} /> 
              } />
              {<>
              <Route path="/home" element={<Home />} />
              <Route path="/get-started/profile" element={<UpdateProfile />} />
              <Route path="/get-started/topics" element={<SelectTopic />} />
              <Route path="/new-story" element={<NewBlog />} />
              <Route path="/blog/:id/edit" element={<EditBlog />} />
              <Route path="/blog/:id" element={<ReadBlog />} />
              <Route path="/story/publish" element={<PublishBlog />} />
              <Route path="/all-topics" element={<AllTopics />} />
              <Route path="/topic/:id" element={<TopicPosts />} />
              </>}
          </Routes>}
        {!loading && !hideNavFooter && <Footer />}
    </>
  );
}
export default () =>  <BrowserRouter><RecoilRoot><ThemeProvider><App/></ThemeProvider></RecoilRoot></BrowserRouter> 