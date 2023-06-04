import './App.css'
import Home from './pages/Home/Home'
import Busca from './pages/Busca/Busca'
import Resultado from './pages/Resultado/Resultado'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar';
import { AuthProvider} from "./contexts/AuthContext.jsx";

function App() {

  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/Busca" element={<ProSidebarProvider><Busca/></ProSidebarProvider>} />
                <Route path="/Resultado/:id" element={<Resultado/>} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
