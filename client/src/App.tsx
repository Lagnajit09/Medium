import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import  Blog  from './pages/Blog'
import Navbar from './components/Navbar'
import Landing from './pages/landing'
import Footer from './components/Footer'
import Home from './pages/home'
import { useEffect, useState } from 'react'
import { fetchUserSession, handleLogin } from './appwrite'
import Loading from './components/Loading'
import { logInUser } from './authHandlers'
import { RecoilRoot, useRecoilState } from 'recoil'
import { authUserAtom } from './store/authAtom'
import { loadingAtom } from './store/loader'

function App() {
  const [authUser, setAuthUser] = useRecoilState(authUserAtom)
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);

  useEffect(() => {
    const isAuthenticated = async () => {

      setLoading(true);
      const sessionId = localStorage.getItem('sessionId')
      try {
        if (sessionId) {
          const { userSession, user } = await fetchUserSession(sessionId);
          setAuthenticated(true);
          if (user) {
            setAuthUser(user);
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error while fetching user session!');
        setAuthenticated(false);
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
        {!loading && <Navbar setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} authenticated={authenticated} setAuthenticated={setAuthenticated} />}
          {!loading && <Routes>
             <Route path="/" 
            element={
              !authenticated ?
              <Landing showSignIn={showSignIn} showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} setAuthenticated={setAuthenticated} /> 
              : 
              <Home />
            } />
            {authenticated && <Route path="/home" element={<Home />} />}
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>}
        {!loading && <Footer />}
    </>
  );
}
export default () =>  <BrowserRouter><RecoilRoot><App/></RecoilRoot></BrowserRouter> 