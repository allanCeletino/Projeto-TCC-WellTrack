import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

function Header({ nomeUsuario = 'Usuário', paginaAtiva = '' }) {
  const navigate = useNavigate()

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuarioId')
    navigate('/')
  }

  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <img
          src="/src/assets/logo.jpeg"
          alt="WellTrack Logo"
          className="welltrack-logo-img"
        />
      </div>

      <nav className="dashboard-nav">
        <Link to="/dashboard" className={`nav-item ${paginaAtiva === 'dashboard' ? 'active' : ''}`}>DASHBOARD</Link>
        <Link to="/alimentacao" className={`nav-item ${paginaAtiva === 'alimentacao' ? 'active' : ''}`}>ALIMENTAÇÃO</Link>
        <Link to="/metas" className={`nav-item ${paginaAtiva === 'metas' ? 'active' : ''}`}>METAS</Link>
        <Link to="/perfil" className={`nav-item ${paginaAtiva === 'perfil' ? 'active' : ''}`}>PERFIL</Link>
        <Link to="/progresso" className={`nav-item ${paginaAtiva === 'progresso' ? 'active' : ''}`}>PROGRESSO</Link>
        <Link to="/sono" className={`nav-item ${paginaAtiva === 'sono' ? 'active' : ''}`}>SONO</Link>
        <Link to="/treinos" className={`nav-item ${paginaAtiva === 'treinos' ? 'active' : ''}`}>TREINO</Link>
      </nav>

      <div className="header-user-action">
        <span className="user-greeting">Olá, {nomeUsuario}</span>
        <button className="botao-sair" onClick={sair}>
          SAIR
        </button>
      </div>
    </header>
  )
}

export default Header