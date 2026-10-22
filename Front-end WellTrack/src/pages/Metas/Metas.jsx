import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Metas.css'

const COLUNAS = [
  {
    status: 'ANDAMENTO',
    titulo: 'Em Andamento',
    rotulo: 'Em andamento',
    classe: 'andamento',
    vazio: 'Nenhuma meta em andamento.',
    dica: 'Adicione uma meta acima para começar.'
  },
  {
    status: 'CONCLUIDA',
    titulo: 'Concluídas',
    rotulo: 'Concluída',
    classe: 'concluida',
    vazio: 'Nenhuma meta concluída.',
    dica: 'Suas conquistas vão aparecer aqui.'
  },
  {
    status: 'CANCELADA',
    titulo: 'Canceladas',
    rotulo: 'Cancelada',
    classe: 'cancelada',
    vazio: 'Nenhuma meta cancelada.',
    dica: 'Metas canceladas ficam guardadas aqui.'
  }
]

function Metas() {
  const navigate = useNavigate()

  const [descricao, setDescricao] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [status, setStatus] = useState('ANDAMENTO')

  const [mensagem, setMensagem] = useState('')
  const [metas, setMetas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')

  useEffect(() => {
    carregarDadosUsuario()
    carregarMetas()
  }, [])

  async function carregarDadosUsuario() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) return

    try {
      const resposta = await fetch(`http://localhost:8088/api/usuarios/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (resposta.ok) {
        const dados = await resposta.json()
        if (dados && dados.nome) {
          setNomeUsuario(dados.nome)
        }
      }
    } catch (e) {
      console.error('Erro ao carregar usuário:', e)
    }
  }

  async function carregarMetas() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        `http://localhost:8088/api/metas/usuario/${usuarioId}?page=0&size=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as metas.')
      }

      const dados = await resposta.json()

      if (Array.isArray(dados)) {
        setMetas(dados)
      } else if (Array.isArray(dados.content)) {
        setMetas(dados.content)
      } else {
        setMetas([])
      }
    } catch (erro) {
      console.error('Erro ao carregar metas:', erro)
      setMensagem('Não foi possível carregar as metas.')
    } finally {
      setCarregando(false)
    }
  }

  async function adicionarMeta(event) {
    event.preventDefault()

    if (
      descricao === '' ||
      objetivo === '' ||
      dataInicio === '' ||
      dataFim === '' ||
      status === ''
    ) {
      setMensagem('Preencha todos os campos.')
      return
    }

    if (dataFim < dataInicio) {
      setMensagem('A data de fim não pode ser anterior à data de início.')
      return
    }

    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    const novaMeta = {
      descricao: descricao,
      objetivo: objetivo,
      dataInicio: dataInicio,
      dataFim: dataFim,
      status: status
    }

    try {
      setSalvando(true)
      setMensagem('Salvando meta...')

      const resposta = await fetch(
        `http://localhost:8088/api/metas/usuario/${usuarioId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(novaMeta)
        }
      )

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível adicionar a meta.'
        try {
          const erro = await resposta.json()
          if (erro.message) {
            mensagemErro = erro.message
          } else if (erro.mensagem) {
            mensagemErro = erro.mensagem
          }
        } catch {
          // Mantém a mensagem padrão.
        }
        throw new Error(mensagemErro)
      }

      setDescricao('')
      setObjetivo('')
      setDataInicio('')
      setDataFim('')
      setStatus('ANDAMENTO')
      setMensagem('Meta adicionada com sucesso.')

      await carregarMetas()
    } catch (erro) {
      console.error('Erro ao adicionar meta:', erro)
      setMensagem(erro.message)
    } finally {
      setSalvando(false)
    }
  }

  async function alterarStatus(metaId, novoStatus) {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setMensagem('Atualizando status...')

      const resposta = await fetch(
        `http://localhost:8088/api/metas/${metaId}/usuario/${usuarioId}/status?novoStatus=${novoStatus}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível atualizar o status da meta.')
      }

      setMensagem('Status atualizado com sucesso.')
      await carregarMetas()
    } catch (erro) {
      console.error('Erro ao atualizar status:', erro)
      setMensagem(erro.message)
    }
  }

  async function removerMeta(id) {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setMensagem('Removendo meta...')

      const resposta = await fetch(
        `http://localhost:8088/api/metas/${id}/usuario/${usuarioId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível remover a meta.')
      }

      setMensagem('Meta removida com sucesso.')
      await carregarMetas()
    } catch (erro) {
      console.error('Erro ao remover meta:', erro)
      setMensagem(erro.message)
    }
  }

  function formatarData(data) {
    if (!data) return ''
    const partes = data.split('-')
    if (partes.length !== 3) return data
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  return (
    <div className="wt-page">
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nomeUsuario} paginaAtiva="metas" />

      {/* MAIN CONTENT */}
      <main className="wt-container wt-main">
        {/* HEADER DA SEÇÃO */}
        <section className="wt-section-header">
          <span className="wt-eyebrow">OBJETIVOS & CONQUISTAS</span>
          <h1 className="wt-title">MINHAS METAS</h1>
          <p className="wt-subtitle">
            Defina objetivos para melhorar seus hábitos, desempenho e sua saúde.
          </p>
        </section>

        {/* FORMULÁRIO DE ADICIONAR META */}
        <section className="wt-card wt-form-section">
          <h3>
            <span className="wt-dot"></span> Adicionar Nova Meta
          </h3>

          <form onSubmit={adicionarMeta} className="wt-form">
            <div className="wt-grid-2">
              <div className="wt-input-group">
                <label htmlFor="descricao-meta">Descrição</label>
                <input
                  type="text"
                  id="descricao-meta"
                  placeholder="Ex.: Beber mais água"
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                />
              </div>

              <div className="wt-input-group">
                <label htmlFor="objetivo-meta">Objetivo</label>
                <input
                  type="text"
                  id="objetivo-meta"
                  placeholder="Ex.: Beber 3.5 litros por dia"
                  value={objetivo}
                  onChange={(event) => setObjetivo(event.target.value)}
                />
              </div>

              <div className="wt-input-group">
                <label htmlFor="data-inicio-meta">Data de início</label>
                <input
                  type="date"
                  id="data-inicio-meta"
                  value={dataInicio}
                  onChange={(event) => setDataInicio(event.target.value)}
                />
              </div>

              <div className="wt-input-group">
                <label htmlFor="data-fim-meta">Data de fim</label>
                <input
                  type="date"
                  id="data-fim-meta"
                  value={dataFim}
                  onChange={(event) => setDataFim(event.target.value)}
                />
              </div>
            </div>

            <div className="wt-input-group wt-small-select">
              <label htmlFor="status-meta">Status Inicial</label>
              <select
                id="status-meta"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            {mensagem && <div className="wt-mensagem">{mensagem}</div>}

            <button
              type="submit"
              className="wt-btn-primary"
              disabled={salvando}
            >
              <Plus size={18} strokeWidth={3} />
              {salvando ? 'Adicionando...' : 'Adicionar meta'}
            </button>
          </form>
        </section>

        {/* 3 COLUNAS LADO A LADO */}
        {carregando ? (
          <div className="wt-empty-state">Carregando metas...</div>
        ) : (
          <div className="wt-kanban-board">
            {COLUNAS.map((coluna) => {
              const metasDaColuna = metas.filter(
                (meta) => meta.status === coluna.status
              )

              return (
                <div
                  className={`wt-status-column wt-col-${coluna.classe}`}
                  key={coluna.status}
                >
                  <div className="wt-column-header">
                    <span className={`wt-dot-status dot-${coluna.classe}`}></span>
                    <h3>
                      {coluna.titulo} ({metasDaColuna.length})
                    </h3>
                  </div>

                  <div className="wt-column-content">
                    {metasDaColuna.length === 0 ? (
                      <div className="wt-meta-card wt-meta-card-vazio">
                        <div>
                          <div className="wt-meta-card-top">
                            <span className={`wt-badge badge-${coluna.classe}`}>
                              {coluna.rotulo}
                            </span>
                          </div>
                          <h4 className="wt-meta-title">{coluna.vazio}</h4>
                          <p className="wt-meta-obj">{coluna.dica}</p>
                        </div>
                      </div>
                    ) : (
                      metasDaColuna.map((meta) => (
                        <div className="wt-meta-card" key={meta.id}>
                          <div>
                            <div className="wt-meta-card-top">
                              <span className={`wt-badge badge-${coluna.classe}`}>
                                {coluna.rotulo}
                              </span>
                              <button
                                type="button"
                                onClick={() => removerMeta(meta.id)}
                                className="wt-btn-remover"
                              >
                                Remover
                              </button>
                            </div>

                            <h4 className="wt-meta-title">{meta.descricao}</h4>
                            <p className="wt-meta-obj">
                              <strong>Objetivo:</strong> {meta.objetivo}
                            </p>

                            <div className="wt-meta-dates">
                              <div>
                                <span>Início</span>
                                <strong>{formatarData(meta.dataInicio)}</strong>
                              </div>
                              <div>
                                <span>Fim</span>
                                <strong>{formatarData(meta.dataFim)}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="wt-meta-footer">
                            <label htmlFor={`status-${meta.id}`}>
                              Alterar status
                            </label>
                            <select
                              id={`status-${meta.id}`}
                              value={meta.status}
                              onChange={(e) =>
                                alterarStatus(meta.id, e.target.value)
                              }
                            >
                              <option value="ANDAMENTO">Em andamento</option>
                              <option value="CONCLUIDA">Concluída</option>
                              <option value="CANCELADA">Cancelada</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* FOOTER REUTILIZÁVEL */}
      <Footer />
    </div>
  )
}

export default Metas