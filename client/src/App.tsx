import { BrowserRouter, Route, Routes } from 'react-router-dom'
import  Signup  from './pages/Signup'
import  Signin  from './pages/Signin'
import  Blog  from './pages/Blog'
import Navbar from './components/Navbar'
import Landing from './pages/landing'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        <Footer />
    </BrowserRouter>
  );
}
export default App