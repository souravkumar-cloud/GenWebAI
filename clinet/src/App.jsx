import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import { Loader2 } from 'lucide-react'
import WebEditor from './pages/WebEditor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'
export const serverUrl="http://localhost:3000"


const AppContent = () => {
  useGetCurrentUser() // ✅ now inside Router

  const { userData, loading } = useSelector(state => state.user)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={userData ? <Dashboard /> : <Navigate to="/" />} />
      <Route path='/generate' element={userData ? <Generate /> : <Navigate to="/" />} />
      <Route path='/editor/:id' element={userData ? <WebEditor/>: <Navigate to="/"/>}/>
      <Route path='/site/:id' element={<LiveSite/>} />
      <Route path='/pricing' element={<Pricing/>} />
    </Routes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent /> {/* ✅ moved here */}
    </BrowserRouter>
  )
}

export default App