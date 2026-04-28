import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router'
import Projects from './project/Projects'
import AppLayout from './AppLayout'
import ProjectTasks from './project/ProjectTasks'
import TaskDetail from './task/TaskDetail'
import Login from './auth/Login'
import Register from './auth/Register'
import { AuthProvider } from './auth/authContext'
import Newproject from './project/NewProject'
import NewTask from './task/NewTask'
import EditProject from './project/EditProject'
import EditTask from './task/EditTask'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter basename='/task-manager'>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Projects />} />
            <Route path='/project/:id' element={<ProjectTasks />} />
            <Route path='/task/:id' element={<TaskDetail />} />
            <Route path='/task/:id/edit' element={<EditTask />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/project/new' element={<Newproject />} />
            <Route path='/project/:id/new-task' element={<NewTask />} />
            <Route path='/project/:id/edit' element={<EditProject />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
