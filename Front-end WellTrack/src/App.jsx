import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Dashboard from './pages/Dashboard/Dashboard'
import Perfil from './pages/Perfil/Perfil'
import Metas from './pages/Metas/Metas'
import Treinos from './pages/Treinos/Treinos'
import Alimentacao from './pages/Alimentacao/Alimentacao'
import Sono from './pages/Sono/Sono'
import Progresso from './pages/Progresso/Progresso'

function RotaProtegida({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />

        <Route
          path="/metas"
          element={
            <RotaProtegida>
              <Metas />
            </RotaProtegida>
          }
        />

        <Route
          path="/treinos"
          element={
            <RotaProtegida>
              <Treinos />
            </RotaProtegida>
          }
        />

        <Route
          path="/alimentacao"
          element={
            <RotaProtegida>
              <Alimentacao />
            </RotaProtegida>
          }
        />

        <Route
          path="/sono"
          element={
            <RotaProtegida>
              <Sono />
            </RotaProtegida>
          }
        />

        <Route
          path="/progresso"
          element={
            <RotaProtegida>
              <Progresso />
            </RotaProtegida>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App