import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router'
import Projects from './Projects'
import AppLayout from './AppLayout'
import ProjectTasks from './ProjectTasks'
import TaskDetail from './TaskDetail'
import Login from './Login'
import Register from './Register'
import { AuthProvider } from './authContext'
import Newproject from './NewProject'
import NewTask from './NewTask'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Projects />} />
            <Route path='/project/:id' element={<ProjectTasks />} />
            <Route path='/task/:id' element={<TaskDetail />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/project/new' element={<Newproject />} />
            <Route path='/project/:id/new-task' element={<NewTask />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
