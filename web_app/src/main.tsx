import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router'
import Projects from './Projects'
import AppLayout from './AppLayout'
import ProjectTasks from './ProjectTasks'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Projects />} />
          <Route path='/project/:id' element={<ProjectTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
