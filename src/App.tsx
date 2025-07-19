import './index.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Player from './pages/Player'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import ElementNavBar from './components/ElementNavBar'
import Header from './components/Header'
import Matches from './pages/Matches'
import Team from './pages/Team'
import AdminPartido from './pages/AdminPartido'
import PartidoEventosPage from './pages/PartidoEventosPage'

function App() {
  return (
    <>
      <div className="min-h-screen min-w-screen bg-gris-claro flex flex-col">

        <nav className="w-full bg-azul-noche shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

            <div className="flex items-center gap-4">
              <Header></Header>
            </div>

            <div className="flex gap-4 text-lg">
              <ElementNavBar to="/">Home</ElementNavBar>
              <ElementNavBar to="/partidos">Partidos</ElementNavBar>
              <ElementNavBar to="/admin">Admin</ElementNavBar>


            </div>

          </div>
        </nav>

        <main className="flex-1 w-full flex flex-col items-center justify-start">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/player/:name" element={<Player />} />
            <Route path="/team/:id" element={<Team />} />
            <Route path="/admin/partido/:id" element={<AdminPartido />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/partidos" element={<Matches />} />
            <Route path="/partido/:id" element={<PartidoEventosPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/adminlogin" element={<AdminLogin />} />
          </Routes>
        </main>
        <footer className="py-8 mt-10 bg-gray-800 text-white text-center">
          <p>© 2025 Campeonato Intercursos. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  )
}

export default App