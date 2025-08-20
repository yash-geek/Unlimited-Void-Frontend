import React, { Suspense, useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LayoutLoader from './components/layouts/LayoutLoader'
import { Toaster } from 'react-hot-toast'
import ProtectRoute from './components/auth/ProtectRoute'
import AppLayout from './components/layouts/AppLayout'
import Login from './pages/Login'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { server } from './constants/config'
import { userExists, userNotExists } from './redux/reducers/auth'
import Home from './pages/Home'
import MyDrive from './pages/MyDrive'
import Shared from './pages/Shared'
import Trash from './pages/Trash'
const App = () => {
  const {user,loader} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    axios.get(`${server}/api/user/getuser`,{withCredentials:true})
    .then(({data})=>dispatch(userExists(data.user)))
    .catch((err)=>dispatch(userNotExists()))
  },[dispatch])
  return (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={
            <ProtectRoute user={user} />
          }>
            <Route path='/home' element={<AppLayout Component={Home}/>} />
            <Route path='/my-drive' element={<AppLayout Component={MyDrive}/>} />
            <Route path='/shared' element={<AppLayout Component={Shared}/>} />
            <Route path='/trash' element={<AppLayout Component={Trash}/>} />

          </Route>
          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/home'>
              <Login/>
            </ProtectRoute>
          } />
        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </Router>
  )
}

export default App