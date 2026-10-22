import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [nomeUsuario, setNomeUsuario] = useState('Usuário')
  const [quantidadeMetas, setQuantidadeMetas] = useState(0)
  const [quantidadeProgressos, setQuantidadeProgressos] = useState(0)
  const [quantidadeTreinos, setQuantidadeTreinos] = useState(0)
  const [quantidadeRefeicoes, setQuantidadeRefeicoes] = useState(0)
  const [quantidadeSono, setQuantidadeSono] = useState(0)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const apiUrl = 'http://localhost:8088'

  useEffect(() => {
    carregarDashboard()
  }, [])

  function obterQuantidade(dados) {
    if (Array.isArray(dados)) return dados.length
    if (dados && Array.isArray(dados.content)) return dados.content.length
    if (dados && dados.totalElements !== undefined && dados.totalElements !== null) {
      return Number(dados.totalElements)
    }
    return 0
  }

  async function buscarDados(url, token) {
    const resposta = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!resposta.ok) {
      throw new Error(`Erro ao consultar: ${url}`)
    }

    return await resposta.json()
  }

  async function carregarDashboard() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      const [
        usuario,
        metas,
        progressos,
        treinos,
        refeicoes,
        sono
      ] = await Promise.all([
        buscarDados(`${apiUrl}/api/usuarios/${usuarioId}`, token),
        buscarDados(`${apiUrl}/api/metas/usuario/${usuarioId}?page=0&size=100`, token),
        buscarDados(`${apiUrl}/api/progresso/usuario/${usuarioId}?page=0&size=100`, token),
        buscarDados(`${apiUrl}/api/treinos/usuario/${usuarioId}?page=0&size=100`, token),
        buscarDados(`${apiUrl}/api/refeicoes/usuario/${usuarioId}?size=100`, token),
        buscarDados(`${apiUrl}/api/sono/usuario/${usuarioId}?size=100`, token)
      ])

      if (usuario && usuario.nome) {
        setNomeUsuario(usuario.nome)
      }

      setQuantidadeMetas(obterQuantidade(metas))
      setQuantidadeProgressos(obterQuantidade(progressos))
      setQuantidadeTreinos(obterQuantidade(treinos))
      setQuantidadeRefeicoes(obterQuantidade(refeicoes))
      setQuantidadeSono(obterQuantidade(sono))
    } catch (erro) {
      console.error('Erro ao carregar dashboard:', erro)
      setErro('Não foi possível carregar todos os dados do Dashboard.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="dashboard-container">
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nomeUsuario} paginaAtiva="dashboard" />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-conteudo">
        <section className="boas-vindas">
          <div className="boas-vindas-texto">
            <span className="eyebrow">ACOMPANHAMENTO DIÁRIO</span>
            <h2>OLÁ, {nomeUsuario.toUpperCase()}!</h2>
            <p>
              Consulte os seus hábitos, atinja os seus objetivos e cuide da sua saúde todos os dias.
            </p>
          </div>
        </section>

        {carregando && (
          <div className="dashboard-status">
            <p>A carregar os seus dados do servidor...</p>
          </div>
        )}

        {erro && (
          <div className="dashboard-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* GRID DE CARDS */}
        <section className="dashboard-cards">
          <Link to="/perfil" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">👤</span>
              <span className="card-badge">CONTA</span>
            </div>
            <div className="card-body">
              <h3>Perfil</h3>
              <p>Consulte e atualize os seus dados pessoais e de acesso.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">{nomeUsuario}</span>
              <span className="card-arrow">→</span>
            </div>
          </Link>

          <Link to="/metas" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">🎯</span>
              <span className="card-badge">OBJETIVOS</span>
            </div>
            <div className="card-body">
              <h3>Metas</h3>
              <p>Defina e acompanhe as suas metas de curto e longo prazo.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">
                {carregando ? 'A carregar...' : `${quantidadeMetas} ${quantidadeMetas === 1 ? 'meta cadastrada' : 'metas cadastradas'}`}
              </span>
              <span className="card-arrow">→</span>
            </div>
          </Link>

          <Link to="/progresso" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">📈</span>
              <span className="card-badge">EVOLUÇÃO</span>
            </div>
            <div className="card-body">
              <h3>Progresso</h3>
              <p>Acompanhe a sua evolução física e o histórico de dados.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">
                {carregando ? 'A carregar...' : `${quantidadeProgressos} ${quantidadeProgressos === 1 ? 'registro' : 'registros'}`}
              </span>
              <span className="card-arrow">→</span>
            </div>
          </Link>

          <Link to="/treinos" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">🏃</span>
              <span className="card-badge">ATIVIDADE</span>
            </div>
            <div className="card-body">
              <h3>Treinos</h3>
              <p>Organize as suas rotinas de exercício e atividades diárias.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">
                {carregando ? 'A carregar...' : `${quantidadeTreinos} ${quantidadeTreinos === 1 ? 'treino cadastrado' : 'treinos cadastrados'}`}
              </span>
              <span className="card-arrow">→</span>
            </div>
          </Link>

          <Link to="/alimentacao" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">🥗</span>
              <span className="card-badge">NUTRIÇÃO</span>
            </div>
            <div className="card-body">
              <h3>Alimentação</h3>
              <p>Registe e monitorize as suas refeições diárias e calorias.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">
                {carregando ? 'A carregar...' : `${quantidadeRefeicoes} ${quantidadeRefeicoes === 1 ? 'refeição registrada' : 'refeições registradas'}`}
              </span>
              <span className="card-arrow">→</span>
            </div>
          </Link>

          <Link to="/sono" className="dashboard-card">
            <div className="card-header">
              <span className="card-icone">🌙</span>
              <span className="card-badge">DESCANSO</span>
            </div>
            <div className="card-body">
              <h3>Sono</h3>
              <p>Registe os seus horários e monitorize a qualidade do descanso.</p>
            </div>
            <div className="card-footer">
              <span className="card-resumo">
                {carregando ? 'A carregar...' : `${quantidadeSono} ${quantidadeSono === 1 ? 'registro de sono' : 'registros de sono'}`}
              </span>
              <span className="card-arrow">→</span>
            </div>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default Dashboard