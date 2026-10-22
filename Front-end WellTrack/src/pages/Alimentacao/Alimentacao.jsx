import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, ArrowRight, Trash2 } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Alimentacao.css'

const API_URL = 'http://localhost:8088'

const TIPOS_REFEICAO = [
  { value: 'CAFE_MANHA', label: 'Café da manhã' },
  { value: 'LANCHE_MANHA', label: 'Lanche da manhã' },
  { value: 'ALMOCO', label: 'Almoço' },
  { value: 'LANCHE_TARDE', label: 'Lanche da tarde' },
  { value: 'JANTAR', label: 'Jantar' },
  { value: 'LANCHE_NOITE', label: 'Lanche da noite' }
]

const CATEGORIAS_ALIMENTO = [
  { value: 'PROTEINAS', label: 'Proteínas' },
  { value: 'CARBOIDRATOS', label: 'Carboidratos' },
  { value: 'GORDURA_BOA', label: 'Gordura boa' },
  { value: 'FRUTAS', label: 'Frutas' },
  { value: 'VERDURAS_E_LEGUMES', label: 'Verduras e legumes' },
  { value: 'LACTINICIOS', label: 'Laticínios' },
  { value: 'GRAOS_E_CEREAIS', label: 'Grãos e cereais' },
  { value: 'BEBIDAS', label: 'Bebidas' },
  { value: 'SUPLEMENTOS', label: 'Suplementos' },
  { value: 'DOCES_E_SOBREMESAS', label: 'Doces e sobremesas' },
  { value: 'PROCESSADOS', label: 'Processados' },
  { value: 'OUTROS', label: 'Outros' }
]

function dataLocal() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function horaLocal() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Alimentacao() {
  const navigate = useNavigate()

  const [tipoRefeicao, setTipoRefeicao] = useState('')
  const [alimentoId, setAlimentoId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [dataRefeicao, setDataRefeicao] = useState(dataLocal)
  const [horaRefeicao, setHoraRefeicao] = useState(horaLocal)
  const [observacaoAdicional, setObservacaoAdicional] = useState('')

  const [refeicoes, setRefeicoes] = useState([])
  const [alimentos, setAlimentos] = useState([])
  const [usuario, setUsuario] = useState(null)

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [salvandoAlimento, setSalvandoAlimento] = useState(false)

  const [nomeAlimento, setNomeAlimento] = useState('')
  const [categoriaAlimento, setCategoriaAlimento] = useState('')
  const [calorias100g, setCalorias100g] = useState('')
  const [proteinas100g, setProteinas100g] = useState('')
  const [carboidratos100g, setCarboidratos100g] = useState('')
  const [gorduras100g, setGorduras100g] = useState('')
  const [fibras100g, setFibras100g] = useState('0')

  useEffect(() => {
    carregarDadosUsuarioPerfil()
    carregarAlimentos()
    carregarRefeicoes()
  }, [])

  function mostrarMensagem(texto, ehErro = false) {
    setMensagem(texto)
    setErro(ehErro)
  }

  function obterDadosAutenticacao() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/login')
      return null
    }

    return { token, usuarioId }
  }

  function verificarAutorizacao(resposta) {
    if (resposta.status === 401 || resposta.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuarioId')
      navigate('/login')
      return true
    }
    return false
  }

  async function carregarDadosUsuarioPerfil() {
    const auth = obterDadosAutenticacao()
    if (!auth) return

    try {
      const resposta = await fetch(`${API_URL}/api/usuarios/${auth.usuarioId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      if (verificarAutorizacao(resposta)) return
      if (resposta.ok) {
        setUsuario(await resposta.json())
      }
    } catch (e) {
      console.error('Erro ao carregar perfil:', e)
    }
  }

  async function carregarAlimentos() {
    const auth = obterDadosAutenticacao()
    if (!auth) return

    try {
      const resposta = await fetch(`${API_URL}/api/alimentos`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      if (verificarAutorizacao(resposta)) return
      if (!resposta.ok) throw new Error('Não foi possível carregar os alimentos.')

      const dados = await resposta.json()
      setAlimentos(Array.isArray(dados) ? dados : Array.isArray(dados?.content) ? dados.content : [])
    } catch (e) {
      console.error('Erro ao carregar alimentos:', e)
      mostrarMensagem(e.message || 'Erro ao carregar alimentos.', true)
    }
  }

  async function carregarRefeicoes() {
    const auth = obterDadosAutenticacao()
    if (!auth) return

    setCarregandoDados(true)
    try {
      const resposta = await fetch(`${API_URL}/api/refeicoes/usuario/${auth.usuarioId}?size=100`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      if (verificarAutorizacao(resposta)) return
      if (!resposta.ok) throw new Error('Não foi possível carregar as refeições.')

      const dados = await resposta.json()
      setRefeicoes(Array.isArray(dados) ? dados : Array.isArray(dados?.content) ? dados.content : [])
    } catch (e) {
      console.error('Erro ao carregar refeições:', e)
      mostrarMensagem(e.message || 'Não foi possível carregar as refeições.', true)
    } finally {
      setCarregandoDados(false)
    }
  }

  async function cadastrarAlimento(event) {
    event.preventDefault()
    mostrarMensagem('')

    if (!nomeAlimento.trim() || !categoriaAlimento || calorias100g === '' || proteinas100g === '' || carboidratos100g === '' || gorduras100g === '') {
      mostrarMensagem('Preencha o nome, a categoria e todos os nutrientes obrigatórios.', true)
      return
    }

    const auth = obterDadosAutenticacao()
    if (!auth) return

    const novoAlimento = {
      nome: nomeAlimento.trim(),
      categoria: categoriaAlimento,
      calorias100g: Number(calorias100g),
      proteinas100g: Number(proteinas100g),
      carboidratos100g: Number(carboidratos100g),
      gorduras100g: Number(gorduras100g),
      fibras100g: Number(fibras100g === '' ? 0 : fibras100g)
    }

    setSalvandoAlimento(true)
    try {
      const resposta = await fetch(`${API_URL}/api/alimentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(novoAlimento)
      })

      if (verificarAutorizacao(resposta)) return
      if (!resposta.ok) throw new Error('Não foi possível cadastrar o alimento.')

      const alimentoCriado = await resposta.json()
      await carregarAlimentos()

      if (alimentoCriado.id != null) {
        setAlimentoId(String(alimentoCriado.id))
      }

      setNomeAlimento('')
      setCategoriaAlimento('')
      setCalorias100g('')
      setProteinas100g('')
      setCarboidratos100g('')
      setGorduras100g('')
      setFibras100g('0')

      mostrarMensagem(`Alimento "${alimentoCriado.nome || novoAlimento.nome}" cadastrado com sucesso!`)
    } catch (e) {
      console.error('Erro ao cadastrar alimento:', e)
      mostrarMensagem(e.message || 'Erro ao conectar ao servidor.', true)
    } finally {
      setSalvandoAlimento(false)
    }
  }

  async function adicionarRefeicao(event) {
    event.preventDefault()
    mostrarMensagem('')

    if (!tipoRefeicao || !alimentoId || !quantidade || !dataRefeicao || !horaRefeicao) {
      mostrarMensagem('Preencha Tipo, Alimento, Quantidade, Data e Hora.', true)
      return
    }

    const auth = obterDadosAutenticacao()
    if (!auth) return

    const novaRefeicao = {
      tipoRefeicao,
      dataAlimentacao: `${dataRefeicao}T${horaRefeicao}:00`,
      observacao: observacaoAdicional.trim(),
      itens: [{ alimentoId: Number(alimentoId), quantidade: Number(quantidade) }]
    }

    setCarregando(true)
    try {
      const resposta = await fetch(`${API_URL}/api/refeicoes/usuario/${auth.usuarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(novaRefeicao)
      })

      if (verificarAutorizacao(resposta)) return
      if (!resposta.ok) throw new Error('Não foi possível registrar a refeição.')

      mostrarMensagem('Refeição registrada com sucesso!')
      setTipoRefeicao('')
      setAlimentoId('')
      setQuantidade('')
      setObservacaoAdicional('')
      setDataRefeicao(dataLocal())
      setHoraRefeicao(horaLocal())

      await carregarRefeicoes()
    } catch (e) {
      console.error('Erro ao registrar refeição:', e)
      mostrarMensagem(e.message || 'Erro ao conectar ao servidor.', true)
    } finally {
      setCarregando(false)
    }
  }

  async function removerRefeicao(id) {
    if (!window.confirm('Deseja realmente remover esta refeição?')) return

    const auth = obterDadosAutenticacao()
    if (!auth) return

    try {
      const resposta = await fetch(`${API_URL}/api/refeicoes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      if (verificarAutorizacao(resposta)) return
      if (!resposta.ok) throw new Error('Não foi possível remover a refeição.')

      mostrarMensagem('Refeição removida com sucesso!')
      await carregarRefeicoes()
    } catch (e) {
      console.error('Erro ao remover refeição:', e)
      mostrarMensagem(e.message || 'Erro ao remover refeição.', true)
    }
  }

  function formatarTipoRefeicao(tipo) {
    return TIPOS_REFEICAO.find(t => t.value === tipo)?.label || tipo || 'Refeição'
  }

  function formatarDataHora(valor) {
    if (!valor) return 'Data não informada'
    const data = new Date(valor)
    return Number.isNaN(data.getTime()) ? valor : data.toLocaleString('pt-BR')
  }

  function buscarNomeAlimento(id) {
    const alimento = alimentos.find(a => String(a.id) === String(id))
    return alimento?.nome || alimento?.nomeAlimento || `Alimento #${id}`
  }

  function exibirItens(refeicao) {
    if (!Array.isArray(refeicao.itens)) return null
    return refeicao.itens.map((item, i) => {
      const id = item.alimentoId ?? item.alimento?.id
      const nome = item.nomeAlimento || item.alimento?.nome || (id != null ? buscarNomeAlimento(id) : 'Alimento')
      return (
        <p key={`${id ?? nome}-${i}`} style={{ fontSize: '.875rem', color: '#fff' }}>
          {nome}{item.quantidade != null ? ` — ${item.quantidade} g` : ''}
        </p>
      )
    })
  }

  const nomeUsuario = usuario?.nome || 'Usuário'

  return (
    <div className="wt-page">
      <Header nomeUsuario={nomeUsuario} paginaAtiva="alimentacao" />

      <main className="wt-container wt-main-content">
        <section className="wt-hero">
          <div className="wt-hero-bg">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1600"
              alt="Mesa com alimentos variados"
            />
            <div className="wt-hero-overlay" />
          </div>

          <div className="wt-hero-grid">
            <div className="wt-hero-text">
              <span className="wt-eyebrow">CONTROLE NUTRICIONAL</span>
              <h1 className="wt-heading-lg">
                ALIMENTE-SE COM FOCO, <br />
                <span className="text-brand">ATINJA SUAS METAS.</span>
              </h1>
              <p className="wt-hero-desc">
                Registre suas refeições e acompanhe seu histórico alimentar no WellTrack.
              </p>
            </div>

            <div className="wt-hero-stats-wrapper">
              <div className="wt-card-brand">
                <div className="wt-card-brand-header">
                  <div className="wt-card-brand-icon">
                    <Flame size={32} strokeWidth={2.5} />
                  </div>
                  <span className="wt-badge-black">REGISTRO RÁPIDO</span>
                </div>
                <div>
                  <div className="wt-card-brand-number">{refeicoes.length} REFEIÇÕES</div>
                  <div className="wt-card-brand-label">CADASTRADAS NO SISTEMA</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {mensagem && (
          <div role={erro ? 'alert' : 'status'} style={{ margin: '1rem 0', padding: '.875rem 1rem', borderRadius: '8px', color: '#fff', background: erro ? '#5a2020' : '#234321' }}>
            {mensagem}
          </div>
        )}

        {/* CADASTRO DE ALIMENTOS */}
        <section className="wt-meals-section">
          <div className="wt-card-brand" style={{ background: 'var(--wt-surface)', color: '#fff', border: '1px solid var(--wt-border)', maxWidth: '100%', padding: '2rem' }}>
            <h2 className="wt-heading-md" style={{ fontSize: '2rem', marginBottom: '.5rem' }}>Cadastro de Alimentos</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Cadastre alimentos com seus valores nutricionais por 100 g para utilizá-los nas suas refeições.</p>

            <form onSubmit={cadastrarAlimento} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={estiloGrupo}>
                <label htmlFor="nome-alimento" className="wt-eyebrow">Nome do alimento</label>
                <input id="nome-alimento" type="text" value={nomeAlimento} onChange={e => setNomeAlimento(e.target.value)} placeholder="Ex.: Arroz branco cozido" maxLength={150} required style={estiloCampo} />
              </div>

              <div style={estiloGrupo}>
                <label htmlFor="categoria-alimento" className="wt-eyebrow">Categoria</label>
                <select id="categoria-alimento" value={categoriaAlimento} onChange={e => setCategoriaAlimento(e.target.value)} required style={estiloCampo}>
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIAS_ALIMENTO.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <p className="wt-eyebrow">VALORES NUTRICIONAIS POR 100 G</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'calorias-100g', label: 'Calorias (kcal)', value: calorias100g, setter: setCalorias100g },
                  { id: 'proteinas-100g', label: 'Proteínas (g)', value: proteinas100g, setter: setProteinas100g },
                  { id: 'carboidratos-100g', label: 'Carboidratos (g)', value: carboidratos100g, setter: setCarboidratos100g },
                  { id: 'gorduras-100g', label: 'Gorduras (g)', value: gorduras100g, setter: setGorduras100g },
                  { id: 'fibras-100g', label: 'Fibras (g)', value: fibras100g, setter: setFibras100g }
                ].map(campo => (
                  <div style={estiloGrupo} key={campo.id}>
                    <label htmlFor={campo.id} className="wt-eyebrow">{campo.label}</label>
                    <input id={campo.id} type="number" min="0" step="0.01" value={campo.value} onChange={e => campo.setter(e.target.value)} required={campo.id !== 'fibras-100g'} style={estiloCampo} />
                  </div>
                ))}
              </div>

              <button type="submit" className="wt-btn wt-btn-primary" disabled={salvandoAlimento} style={{ width: 'fit-content', marginTop: '.5rem' }}>
                <span>{salvandoAlimento ? 'Cadastrando...' : 'Cadastrar Alimento'}</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </form>
          </div>
        </section>

        {/* REGISTRO DE REFEIÇÕES */}
        <section className="wt-meals-section">
          <div className="wt-card-brand" style={{ background: 'var(--wt-surface)', color: '#fff', border: '1px solid var(--wt-border)', maxWidth: '100%', padding: '2rem' }}>
            <h3 className="wt-heading-md" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Registrar Nova Refeição</h3>

            <form onSubmit={adicionarRefeicao} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={estiloGrupo}>
                  <label htmlFor="tipo-refeicao" className="wt-eyebrow">Tipo da Refeição</label>
                  <select id="tipo-refeicao" value={tipoRefeicao} onChange={e => setTipoRefeicao(e.target.value)} required style={estiloCampo}>
                    <option value="">Selecione o tipo</option>
                    {TIPOS_REFEICAO.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div style={estiloGrupo}>
                  <label htmlFor="alimento-id" className="wt-eyebrow">Alimento / Prato</label>
                  <select id="alimento-id" value={alimentoId} onChange={e => setAlimentoId(e.target.value)} required style={estiloCampo}>
                    <option value="">Selecione um alimento</option>
                    {alimentos.map(a => (
                      <option key={a.id} value={a.id}>{a.nome || a.nomeAlimento || `Alimento #${a.id}`}</option>
                    ))}
                  </select>
                </div>

                <div style={estiloGrupo}>
                  <label htmlFor="quantidade" className="wt-eyebrow">Quantidade (g ou unidade)</label>
                  <input type="number" id="quantidade" min="0.01" step="0.01" placeholder="Ex.: 150" value={quantidade} onChange={e => setQuantidade(e.target.value)} required style={estiloCampo} />
                </div>

                <div style={estiloGrupo}>
                  <label htmlFor="data-refeicao" className="wt-eyebrow">Data</label>
                  <input type="date" id="data-refeicao" value={dataRefeicao} onChange={e => setDataRefeicao(e.target.value)} required style={estiloCampo} />
                </div>

                <div style={estiloGrupo}>
                  <label htmlFor="hora-refeicao" className="wt-eyebrow">Hora</label>
                  <input type="time" id="hora-refeicao" value={horaRefeicao} onChange={e => setHoraRefeicao(e.target.value)} required style={estiloCampo} />
                </div>
              </div>

              <div style={estiloGrupo}>
                <label htmlFor="observacao" className="wt-eyebrow">Observação</label>
                <input type="text" id="observacao" placeholder="Ex.: pós-treino..." value={observacaoAdicional} onChange={e => setObservacaoAdicional(e.target.value)} style={estiloCampo} />
              </div>

              <button type="submit" className="wt-btn wt-btn-primary" disabled={carregando || alimentos.length === 0} style={{ width: 'fit-content', marginTop: '.5rem' }}>
                <span>{carregando ? 'Registrando...' : 'Registrar Refeição'}</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </form>
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="wt-meals-section">
          <div className="wt-section-header">
            <div>
              <span className="wt-eyebrow">HISTÓRICO</span>
              <h2 className="wt-heading-md">Refeições Cadastradas</h2>
            </div>
          </div>

          {carregandoDados ? (
            <div className="wt-meal-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <p className="wt-text-muted">Carregando refeições...</p>
            </div>
          ) : refeicoes.length === 0 ? (
            <div className="wt-meal-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <p className="wt-text-muted">Você ainda não possui nenhuma refeição cadastrada.</p>
            </div>
          ) : (
            <div className="wt-meals-grid">
              {refeicoes.map(refeicao => (
                <div className="wt-meal-card" key={refeicao.id}>
                  <div className="wt-meal-body" style={{ gap: '.75rem' }}>
                    <h3 className="wt-meal-title">{formatarTipoRefeicao(refeicao.tipoRefeicao)}</h3>
                    {exibirItens(refeicao)}
                    {refeicao.observacao && <p style={{ fontSize: '.875rem', color: '#fff', fontWeight: '500' }}>{refeicao.observacao}</p>}
                    <p style={{ fontSize: '.75rem', color: 'var(--wt-text-dim)' }}>
                      <strong>Data e Hora:</strong> {formatarDataHora(refeicao.dataAlimentacao)}
                    </p>
                    {refeicao.totalCalorias != null && (
                      <p className="wt-meal-info">Total: {refeicao.totalCalorias} KCAL</p>
                    )}
                  </div>
                  <div className="wt-meal-footer">
                    <button type="button" className="wt-btn-action" onClick={() => removerRefeicao(refeicao.id)} style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, .3)' }}>
                      <Trash2 size={16} />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

const estiloGrupo = { display: 'flex', flexDirection: 'column', gap: '.5rem' }
const estiloCampo = { background: 'var(--wt-bg)', color: '#fff', border: '1px solid var(--wt-border)', padding: '.875rem', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }