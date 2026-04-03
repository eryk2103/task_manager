import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router'
import Projects from './Projects'
import AppLayout from './AppLayout'
import ProjectTasks from './ProjectTasks'
import TaskDetail from './TaskDetail'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Projects />} />
          <Route path='/project/:id' element={<ProjectTasks />} />
          <Route path='/task/:id' element={<TaskDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
