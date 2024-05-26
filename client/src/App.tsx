import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import  Blog  from './pages/Blog'
import Navbar from './components/Navbar'
import Landing from './pages/landing'
import Footer from './components/Footer'
import Home from './pages/home'
import { useEffect, useState } from 'react'
import { fetchUserSession } from './appwrite'
import Loading from './components/Loading'
import { logInUser } from './authHandlers'
import { RecoilRoot, useRecoilState } from 'recoil'
import { authUserAtom } from './store/authAtom'

function App() {
  const [authUser, setAuthUser] = useRecoilState(authUserAtom)
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = async () => {
      const token = localStorage.getItem('medium-userId')
      try {
        const {userSession, user} = await fetchUserSession()

      if(userSession) setSessionId(userSession.$id)

      if(userSession || token) {
        setAuthenticated(true)
        navigate('/home')
        logInUser(user, setAuthUser)
      } else {
        setAuthenticated(false)
      }
      } catch (error) {
        console.error('Error while fetching user session!')
      } finally {
        setLoading(false)
      }
      
    }
    isAuthenticated()
  }, [authUser])


  return (
    <>
        {!loading && <Navbar setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} authenticated={authenticated} setAuthenticated={setAuthenticated} session={sessionId} />}
        {loading && <Loading />}
          {!loading && <Routes>
             <Route path="/" 
            element={
              !authenticated ?
              <Landing showSignIn={showSignIn} showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} /> 
              : 
              <Home />
            } />
            <Route path="/home" element={<Home />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>}
        {!loading && <Footer />}
    </>
  );
}
export default () =>  <BrowserRouter><RecoilRoot><App/></RecoilRoot></BrowserRouter> 