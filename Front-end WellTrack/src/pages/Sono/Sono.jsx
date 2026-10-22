import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Moon, 
  PlusCircle, 
  Trash2,
  Calendar,
  Sun,
  FileText
} from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Sono.css'

function Sono() {
  const navigate = useNavigate()

  const [data, setData] = useState('')
  const [horaDormir, setHoraDormir] = useState('')
  const [horaAcordar, setHoraAcordar] = useState('')
  const [qualidade, setQualidade] = useState('')
  const [descricao, setDescricao] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [registrosSono, setRegistrosSono] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')

  const apiUrl = 'http://localhost:8088'

  useEffect(() => {
    carregarDadosUsuarioPerfil()
    carregarRegistrosSono()
  }, [])

  function obterDadosUsuario() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return null
    }

    return {
      token,
      usuarioId
    }
  }

  async function carregarDadosUsuarioPerfil() {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    try {
      const resposta = await fetch(`${apiUrl}/api/usuarios/${dadosUsuario.usuarioId}`, {
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

  async function carregarRegistrosSono() {
    const dadosUsuario = obterDadosUsuario()

    if (!dadosUsuario) {
      return
    }

    const { token, usuarioId } = dadosUsuario

    try {
      const resposta = await fetch(
        `${apiUrl}/api/sono/usuario/${usuarioId}?size=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error(
          'Não foi possível carregar os registros de sono.'
        )
      }

      const dados = await resposta.json()

      if (Array.isArray(dados)) {
        setRegistrosSono(dados)
      } else if (Array.isArray(dados.content)) {
        setRegistrosSono(dados.content)
      } else {
        setRegistrosSono([])
      }
    } catch (erro) {
      console.error(erro)
      setMensagem('Não foi possível carregar os registros de sono.')
    }
  }

  function calcularDuracao(horaInicio, horaFim) {
    if (!horaInicio || !horaFim) {
      return 'Não informado'
    }

    const [horaInicioNumero, minutoInicio] = horaInicio.split(':').map(Number)
    const [horaFimNumero, minutoFim] = horaFim.split(':').map(Number)

    let inicio = horaInicioNumero * 60 + minutoInicio
    let fim = horaFimNumero * 60 + minutoFim

    if (fim < inicio) {
      fim += 24 * 60
    }

    const totalMinutos = fim - inicio
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60

    if (minutos === 0) {
      return `${horas} horas`
    }

    return `${horas}h ${minutos}min`
  }

  function formatarData(dataSono) {
    if (!dataSono) return ''
    const partes = dataSono.split('-')
    if (partes.length !== 3) return dataSono
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  function formatarHorario(horario) {
    if (!horario) return 'Não informado'
    return horario.substring(0, 5)
  }

  function formatarQualidade(qualidadeSono) {
    const qualidades = {
      EXCELENTE: 'Excelente',
      BOM: 'Bom',
      REGULAR: 'Regular',
      RUIM: 'Ruim'
    }
    return qualidades[qualidadeSono] || qualidadeSono
  }

  async function adicionarSono(event) {
    event.preventDefault()

    if (data === '' || horaDormir === '' || horaAcordar === '' || qualidade === '') {
      setMensagem('Preencha todos os campos obrigatórios.')
      return
    }

    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token, usuarioId } = dadosUsuario

    const novoRegistro = {
      qualidadeSono: qualidade,
      horarioDormiu: horaDormir,
      horarioAcordou: horaAcordar,
      data: data,
      descricao: descricao
    }

    try {
      setCarregando(true)
      setMensagem('')

      const resposta = await fetch(
        `${apiUrl}/api/sono/usuario/${usuarioId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(novoRegistro)
        }
      )

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível registrar o sono.'
        try {
          const erro = await resposta.json()
          if (erro.message) mensagemErro = erro.message
          else if (erro.mensagem) mensagemErro = erro.mensagem
        } catch {
          // Mantém a padrão
        }
        throw new Error(mensagemErro)
      }

      setData('')
      setHoraDormir('')
      setHoraAcordar('')
      setQualidade('')
      setDescricao('')
      setMensagem('Registro de sono adicionado com sucesso.')

      await carregarRegistrosSono()
    } catch (erro) {
      console.error(erro)
      setMensagem(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  async function removerSono(id) {
    const dadosUsuario = obterDadosUsuario()
    if (!dadosUsuario) return

    const { token, usuarioId } = dadosUsuario

    try {
      const resposta = await fetch(
        `${apiUrl}/api/sono/${id}/usuario/${usuarioId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível remover o registro de sono.')
      }

      setMensagem('Registro de sono removido com sucesso.')
      await carregarRegistrosSono()
    } catch (erro) {
      console.error(erro)
      setMensagem(erro.message)
    }
  }

  return (
    <div className="well-container">
      
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nomeUsuario} paginaAtiva="sono" />

      {/* MAIN CONTENT */}
      <main className="well-main">
        
        {/* HERO TITLE SECTION */}
        <section className="well-hero-section">
          <div className="well-badge">
            <Moon className="well-badge-icon" /> Recuperação & Descanso
          </div>
          <h1 className="well-hero-title">
            CONTROLE DO <br /><span>SEU SONO</span>
          </h1>
          <p className="well-hero-description">
            O crescimento e a regeneração muscular acontecem durante o sono profundo. Acompanhe a qualidade do seu descanso para atingir o pico de performance.
          </p>
        </section>

        {/* GRID: FORMULÁRIO + MÉTRICA */}
        <div className="well-grid-layout">
          
          {/* FORMULÁRIO DE REGISTRO */}
          <div className="well-card">
            <h3>Registrar Novo Sono</h3>

            <form onSubmit={adicionarSono}>
              <div className="well-form-group">
                <label htmlFor="data-sono">Data do Descanso</label>
                <div className="well-input-wrapper">
                  <Calendar className="well-input-icon" />
                  <input
                    type="date"
                    id="data-sono"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
              </div>

              <div className="well-form-row">
                <div className="well-form-group">
                  <label htmlFor="hora-dormir">Horário que dormiu</label>
                  <div className="well-input-wrapper">
                    <Moon className="well-input-icon" />
                    <input
                      type="time"
                      id="hora-dormir"
                      value={horaDormir}
                      onChange={(e) => setHoraDormir(e.target.value)}
                    />
                  </div>
                </div>

                <div className="well-form-group">
                  <label htmlFor="hora-acordar">Horário que acordou</label>
                  <div className="well-input-wrapper">
                    <Sun className="well-input-icon" />
                    <input
                      type="time"
                      id="hora-acordar"
                      value={horaAcordar}
                      onChange={(e) => setHoraAcordar(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="well-form-group">
                <label htmlFor="qualidade-sono">Qualidade do sono</label>
                <select
                  id="qualidade-sono"
                  value={qualidade}
                  onChange={(e) => setQualidade(e.target.value)}
                >
                  <option value="">Selecione a qualidade do sono</option>
                  <option value="EXCELENTE">Excelente</option>
                  <option value="BOM">Bom</option>
                  <option value="REGULAR">Regular</option>
                  <option value="RUIM">Ruim</option>
                </select>
              </div>

              <div className="well-form-group">
                <label htmlFor="descricao-sono">Descrição / Observações</label>
                <div className="well-input-wrapper">
                  <FileText className="well-input-icon" />
                  <input
                    type="text"
                    id="descricao-sono"
                    placeholder="Ex.: Dormi bem durante a noite"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>

              {mensagem && (
                <p className="well-mensagem-feedback">{mensagem}</p>
              )}

              <button
                type="submit"
                className="well-btn-primary full-width"
                disabled={carregando}
              >
                {carregando ? 'Registrando...' : 'Salvar Registro de Sono'} <PlusCircle className="well-btn-icon" />
              </button>
            </form>
          </div>

          {/* PAINEL LATERAL / SCORE VISUAL */}
          <div className="well-score-card">
            <div className="well-score-glow"></div>
            <span className="well-score-title">Status de Recuperação</span>
            
            <div className="well-circular-progress">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="well-progress-bg" />
                <circle cx="50" cy="50" r="42" className="well-progress-bar" />
              </svg>
              <div className="well-score-inner">
                <span className="well-score-number">{registrosSono.length > 0 ? registrosSono.length : 0}</span>
                <span className="well-score-badge-text">REGISTROS</span>
              </div>
            </div>

            <p className="well-score-footer-text">
              Mantenha constância nos seus horários de descanso para maximizar seus ganhos de massa muscular e foco diário.
            </p>

            <div className="well-score-meta">
              <span>Total Cadastrado</span>
              <span className="highlight">{registrosSono.length} Dias</span>
            </div>
          </div>

        </div>

        {/* LISTAGEM DE REGISTROS */}
        <section className="well-stages-section">
          <div className="well-section-header">
            <div>
              <span className="well-section-subtitle">Histórico</span>
              <h2 className="well-section-title">REGISTROS DE SONO</h2>
            </div>
          </div>

          {registrosSono.length === 0 ? (
            <div className="well-card text-center py-12">
              <p className="text-muted">Você ainda não possui nenhum registro de sono cadastrado.</p>
            </div>
          ) : (
            <div className="well-stages-grid">
              {registrosSono.map((registro) => (
                <div className="well-stage-card" key={registro.id}>
                  <div className="well-stage-card-header">
                    <div className="well-stage-icon-box">
                      <Moon />
                    </div>
                    <span className="well-stage-percentage">{formatarData(registro.data)}</span>
                  </div>
                  
                  <h3>{formatarQualidade(registro.qualidadeSono)}</h3>
                  
                  <div className="well-registry-details space-y-1 my-3 text-xs text-muted">
                    <p><strong>Dormiu:</strong> {formatarHorario(registro.horarioDormiu)}</p>
                    <p><strong>Acordou:</strong> {formatarHorario(registro.horarioAcordou)}</p>
                    {registro.descricao && <p><strong>Obs:</strong> {registro.descricao}</p>}
                  </div>

                  <div className="well-stage-footer flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
                    <div>
                      <span className="text-[10px] text-muted block uppercase">Duração</span>
                      <span className="well-stage-value">{calcularDuracao(registro.horarioDormiu, registro.horarioAcordou)}</span>
                    </div>
                    <button
                      type="button"
                      className="well-btn-danger-icon"
                      onClick={() => removerSono(registro.id)}
                      title="Remover registro"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* FOOTER REUTILIZÁVEL */}
      <Footer />

    </div>
  )
}

export default Sono