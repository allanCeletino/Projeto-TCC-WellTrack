import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Treinos.css'

function Treinos() {
  const navigate = useNavigate()

  const [tiposTreino, setTiposTreino] = useState([])
  const [tipoTreinoId, setTipoTreinoId] = useState('')
  const [observacao, setObservacao] = useState('')
  const [duracao, setDuracao] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [treinos, setTreinos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')

  useEffect(() => {
    carregarDadosUsuarioPerfil()
    carregarTiposTreino()
    carregarTreinos()
  }, [])

  function obterDadosUsuario() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return null
    }

    return { token, usuarioId }
  }

  async function carregarDadosUsuarioPerfil() {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    try {
      const resposta = await fetch(`http://localhost:8088/api/usuarios/${dadosUsuario.usuarioId}`, {
        headers: { Authorization: `Bearer ${dadosUsuario.token}` }
      })
      if (resposta.ok) {
        const dados = await resposta.json()
        if (dados && dados.nome) {
          setNomeUsuario(dados.nome)
        }
      }
    } catch (e) {
      console.error('Erro ao carregar perfil:', e)
    }
  }

  async function carregarTiposTreino() {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token } = dadosUsuario

    try {
      const resposta = await fetch('http://localhost:8088/api/tipos-treino', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!resposta.ok) {
        setMensagem('Não foi possível carregar os tipos de treino.')
        return
      }

      const dados = await resposta.json()
      setTiposTreino(dados)
    } catch (erro) {
      console.error('Erro ao carregar tipos de treino:', erro)
      setMensagem('Não foi possível conectar ao servidor para carregar os tipos de treino.')
    }
  }

  async function carregarTreinos() {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token, usuarioId } = dadosUsuario

    try {
      const resposta = await fetch(
        `http://localhost:8088/api/treinos/usuario/${usuarioId}?page=0&size=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        setMensagem('Não foi possível carregar os treinos.')
        return
      }

      const dados = await resposta.json()

      if (Array.isArray(dados)) {
        setTreinos(dados)
      } else if (Array.isArray(dados.content)) {
        setTreinos(dados.content)
      } else {
        setTreinos([])
      }
    } catch (erro) {
      console.error('Erro ao carregar treinos:', erro)
      setMensagem('Não foi possível conectar ao servidor para carregar os treinos.')
    }
  }

  async function adicionarTreino(event) {
    event.preventDefault()

    if (tipoTreinoId === '' || duracao === '' || dataHora === '') {
      setMensagem('Preencha os campos obrigatórios.')
      return
    }

    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token, usuarioId } = dadosUsuario

    const novoTreino = {
      tipoTreinoId: Number(tipoTreinoId),
      duracao: Number(duracao),
      dataHora: dataHora,
      observacao: observacao
    }

    try {
      setCarregando(true)
      setMensagem('')

      const resposta = await fetch(
        `http://localhost:8088/api/treinos/usuario/${usuarioId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(novoTreino)
        }
      )

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível cadastrar o treino.'
        try {
          const erro = await resposta.json()
          if (erro.message) mensagemErro = erro.message
          else if (erro.mensagem) mensagemErro = erro.mensagem
        } catch {
          // Mantém padrão
        }
        setMensagem(mensagemErro)
        return
      }

      setTipoTreinoId('')
      setObservacao('')
      setDuracao('')
      setDataHora('')
      setMensagem('Treino adicionado com sucesso.')

      await carregarTreinos()
    } catch (erro) {
      console.error('Erro ao cadastrar treino:', erro)
      setMensagem('Não foi possível conectar ao servidor. Verifique se o Back-End está ligado.')
    } finally {
      setCarregando(false)
    }
  }

  async function removerTreino(id) {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token, usuarioId } = dadosUsuario

    try {
      const resposta = await fetch(
        `http://localhost:8088/api/treinos/${id}/usuario/${usuarioId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        setMensagem('Não foi possível remover o treino.')
        return
      }

      setMensagem('Treino removido com sucesso.')
      await carregarTreinos()
    } catch (erro) {
      console.error('Erro ao remover treino:', erro)
      setMensagem('Não foi possível conectar ao servidor para remover o treino.')
    }
  }

  function formatarDataHora(dataHoraTreino) {
    if (!dataHoraTreino) return ''
    const data = new Date(dataHoraTreino)
    if (Number.isNaN(data.getTime())) return dataHoraTreino

    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="well-container">
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nomeUsuario} paginaAtiva="treinos" />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="well-main">
        {/* HERO SECTION DE TREINOS */}
        <section className="ironcore-hero">
          <div className="hero-content">
            <span className="hero-eyebrow">GERENCIAMENTO DE PERFORMANCE</span>
            <h1 className="hero-title">SUPERE OS<br />SEUS LIMITES</h1>
            <p className="hero-description">
              Registre seus treinos diários, controle o tempo de dedicação e acompanhe sua evolução física com alta performance.
            </p>
            
            <div className="hero-features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏋️‍♂️</div>
                <h4>FORÇA & FOCO</h4>
                <p>Evolução contínua</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <h4>HISTÓRICO</h4>
                <p>100% Organizado</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔥</div>
                <h4>GASTO CALÓRICO</h4>
                <p>Métricas precisas</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <h4>RESULTADOS</h4>
                <p>Alcance suas metas</p>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80" 
              alt="Atleta focado treinando" 
            />
            <div className="members-badge">
              <div className="members-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="Membro" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="Membro" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="Membro" />
              </div>
              <div className="members-info">
                <strong>{treinos.length}+</strong>
                <span>TREINOS REGISTRADOS</span>
              </div>
              <p className="members-subtext">Continue evoluindo hoje!</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO INTERATIVA DE CADASTRO E LISTAGEM */}
        <section className="ironcore-programs" id="registrar-treinos">
          <div className="programs-header" style={{ marginBottom: '40px', display: 'block' }}>
            <span className="section-eyebrow">ÁREA DE REGISTRO</span>
            <h2 className="section-title">CONTROLE DE ATIVIDADES</h2>
            <p className="programs-desc">Adicione novas sessões de treino e visualize todas as suas atividades anteriores.</p>
          </div>

          <div className="treinos-grid-layout">
            {/* FORMULÁRIO DE CADASTRO */}
            <div className="treinos-card">
              <h3>Registrar novo treino</h3>

              <form onSubmit={adicionarTreino}>
                <div className="campo-treinos">
                  <label htmlFor="tipo-treino">Tipo de treino</label>
                  <select
                    id="tipo-treino"
                    value={tipoTreinoId}
                    onChange={(event) => setTipoTreinoId(event.target.value)}
                  >
                    <option value="">Selecione o tipo de treino</option>
                    {tiposTreino.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-treinos">
                  <label htmlFor="observacao-treino">Observação</label>
                  <input
                    type="text"
                    id="observacao-treino"
                    placeholder="Ex.: Treino de pernas com foco em carga"
                    value={observacao}
                    onChange={(event) => setObservacao(event.target.value)}
                  />
                </div>

                <div className="treinos-linha">
                  <div className="campo-treinos">
                    <label htmlFor="duracao-treino">Duração (minutos)</label>
                    <input
                      type="number"
                      id="duracao-treino"
                      placeholder="Ex.: 60"
                      min="1"
                      step="1"
                      value={duracao}
                      onChange={(event) => setDuracao(event.target.value)}
                    />
                  </div>

                  <div className="campo-treinos">
                    <label htmlFor="data-hora-treino">Data e hora</label>
                    <input
                      type="datetime-local"
                      id="data-hora-treino"
                      value={dataHora}
                      onChange={(event) => setDataHora(event.target.value)}
                    />
                  </div>
                </div>

                {mensagem && <p className="mensagem-treinos">{mensagem}</p>}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '16px', cursor: 'pointer' }}
                  disabled={carregando}
                >
                  {carregando ? 'ADICIONANDO...' : 'ADICIONAR TREINO →'}
                </button>
              </form>
            </div>

            {/* LISTA DE TREINOS CADASTRADOS */}
            <div className="lista-treinos-wrapper">
              <h3>Treinos cadastrados</h3>

              {treinos.length === 0 ? (
                <div className="nenhum-treino">
                  <p>Você ainda não possui nenhum treino cadastrado.</p>
                </div>
              ) : (
                <div className="treinos-lista-grid">
                  {treinos.map((treino) => (
                    <div className="treino-item" key={treino.id}>
                      <div className="treino-informacoes">
                        <h4>{treino.tipoTreinoNome}</h4>
                        <p><strong>Duração:</strong> {treino.duracao} minutos</p>
                        <p><strong>Data e hora:</strong> {formatarDataHora(treino.dataHora)}</p>
                        <p><strong>Calorias gastas:</strong> {treino.caloriasGastas} kcal</p>
                        {treino.observacao && (
                          <p><strong>Observação:</strong> {treino.observacao}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="botao-remover-treino"
                        onClick={() => removerTreino(treino.id)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER REUTILIZÁVEL */}
      <Footer />
    </div>
  )
}

export default Treinos