import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/landing'
import Footer from './components/Footer'
import Home from './pages/home'
import { useEffect, useState } from 'react'
import { fetchUserSession } from './appwrite'
import Loading from './components/Loading'
import { RecoilRoot, useRecoilState } from 'recoil'
import { authUserAtom } from './store/authAtom'
import { loadingAtom } from './store/loader'
import SelectTopic from './pages/selectTopic'
import NewBlog from './pages/newBlog'
import EditBlog from './pages/editBlog'
import { getUserById } from './handlers/authHandlers'

function App() {
  const [authUser, setAuthUser] = useRecoilState(authUserAtom)
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = async () => {

      setLoading(true);
      const userId = localStorage.getItem('medium-userId')
      try {
        if(userId) {
          const data = await getUserById(userId);
          console.log(data)
          setAuthUser(data);
        }
      } catch (error) {
        console.error('Error while finding user!');
      } finally {
        setLoading(false);
      }
    };

    isAuthenticated();
  }, []);

  if (loading) {
    return <Loading /> // Display a loading indicator while checking authentication
  }


  return (
    <>
        {!loading && 
        <Navbar setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} />
        }
          {!loading && 
          <Routes>
             <Route path="/" element={
              <Landing showSignIn={showSignIn} showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} setAuthenticated={setAuthenticated} /> 
              } />
              <Route path="/home" element={<Home />} />
              <Route path="/get-started/topics" element={<SelectTopic />} />
              <Route path="/new-story" element={<NewBlog />} />
              <Route path="/blog/:id/edit" element={<EditBlog />} />
          </Routes>}
        {!loading && <Footer />}
    </>
  );
}
export default () =>  <BrowserRouter><RecoilRoot><App/></RecoilRoot></BrowserRouter> 