import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Progresso.css'

function Progresso() {
  const navigate = useNavigate()

  const [data, setData] = useState('')
  const [peso, setPeso] = useState('')
  const [frequenciaTreino, setFrequenciaTreino] = useState('')
  const [horasSono, setHorasSono] = useState('')
  const [observacao, setObservacao] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')

  useEffect(() => {
    carregarDadosUsuario()
    carregarProgressos()
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

  async function carregarProgressos() {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        `http://localhost:8088/api/progresso/usuario/${usuarioId}?page=0&size=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error(
          'Não foi possível carregar o histórico de progresso.'
        )
      }

      const dados = await resposta.json()

      if (Array.isArray(dados)) {
        setRegistros(dados)
      } else if (Array.isArray(dados.content)) {
        setRegistros(dados.content)
      } else {
        setRegistros([])
      }
    } catch (erro) {
      console.error('Erro ao carregar progresso:', erro)
      setMensagem(
        'Não foi possível carregar o histórico de progresso.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function adicionarProgresso(event) {
    event.preventDefault()

    if (
      data === '' ||
      peso === '' ||
      frequenciaTreino === '' ||
      horasSono === ''
    ) {
      setMensagem(
        'Preencha a data, o peso, a frequência de treinos e as horas de sono.'
      )
      return
    }

    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    const novoRegistro = {
      dataRegistro: data,
      peso: Number(peso),
      frequenciaTreino: Number(frequenciaTreino),
      horasSono: Number(horasSono),
      observacoes: observacao
    }

    try {
      setSalvando(true)
      setMensagem('Registrando progresso...')

      const resposta = await fetch(
        `http://localhost:8088/api/progresso/usuario/${usuarioId}`,
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
        let mensagemErro =
          'Não foi possível registrar o progresso.'

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

      setData('')
      setPeso('')
      setFrequenciaTreino('')
      setHorasSono('')
      setObservacao('')

      setMensagem('Progresso registrado com sucesso.')

      await carregarProgressos()
    } catch (erro) {
      console.error('Erro ao registrar progresso:', erro)
      setMensagem(erro.message)
    } finally {
      setSalvando(false)
    }
  }

  async function removerProgresso(id) {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    try {
      setMensagem('Removendo registro...')

      const resposta = await fetch(
        `http://localhost:8088/api/progresso/${id}/usuario/${usuarioId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!resposta.ok) {
        throw new Error(
          'Não foi possível remover o registro de progresso.'
        )
      }

      setMensagem('Registro removido com sucesso.')

      await carregarProgressos()
    } catch (erro) {
      console.error('Erro ao remover progresso:', erro)
      setMensagem(erro.message)
    }
  }

  function formatarData(dataProgresso) {
    if (!dataProgresso) {
      return ''
    }

    const partes = dataProgresso.split('-')

    if (partes.length !== 3) {
      return dataProgresso
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  return (
    <div className="progresso-container">
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nomeUsuario} paginaAtiva="progresso" />

      <main className="progresso-conteudo">
        <div className="progresso-titulo">
          <h2>WEEKLY <span>PROGRESS</span></h2>
          <p>Registre sua evolução e acompanhe seus resultados com precisão.</p>
        </div>

        <div className="progresso-grid-layout">
          <div className="progresso-card formulario-card">
            <h3>Novo Registro</h3>

            <form onSubmit={adicionarProgresso}>
              <div className="progresso-linha">
                <div className="campo-progresso">
                  <label htmlFor="data-progresso">Data do registro</label>
                  <input
                    type="date"
                    id="data-progresso"
                    value={data}
                    onChange={(event) => setData(event.target.value)}
                  />
                </div>

                <div className="campo-progresso">
                  <label htmlFor="peso-progresso">Peso (kg)</label>
                  <input
                    type="number"
                    id="peso-progresso"
                    placeholder="Ex.: 76"
                    min="0"
                    step="0.1"
                    value={peso}
                    onChange={(event) => setPeso(event.target.value)}
                  />
                </div>
              </div>

              <div className="progresso-linha">
                <div className="campo-progresso">
                  <label htmlFor="frequencia-treino">Frequência de treinos</label>
                  <input
                    type="number"
                    id="frequencia-treino"
                    placeholder="Ex.: 3"
                    min="0"
                    step="1"
                    value={frequenciaTreino}
                    onChange={(event) => setFrequenciaTreino(event.target.value)}
                  />
                </div>

                <div className="campo-progresso">
                  <label htmlFor="horas-sono">Horas de sono</label>
                  <input
                    type="number"
                    id="horas-sono"
                    placeholder="Ex.: 8"
                    min="0"
                    step="0.5"
                    value={horasSono}
                    onChange={(event) => setHorasSono(event.target.value)}
                  />
                </div>
              </div>

              <div className="campo-progresso">
                <label htmlFor="observacao-progresso">Observações</label>
                <textarea
                  id="observacao-progresso"
                  placeholder="Ex.: Mantive os treinos durante a semana."
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                />
              </div>

              {mensagem && (
                <p className="mensagem-progresso">{mensagem}</p>
              )}

              <button
                type="submit"
                className="botao-adicionar-progresso"
                disabled={salvando}
              >
                {salvando ? 'Registrando...' : 'Registrar progresso'}
              </button>
            </form>
          </div>

          <div className="lista-progresso-card">
            <h3>Histórico de progresso</h3>

            <div className="lista-progresso-scroll">
              {carregando ? (
                <div className="nenhum-progresso">
                  <p>Carregando histórico...</p>
                </div>
              ) : registros.length === 0 ? (
                <div className="nenhum-progresso">
                  <p>Você ainda não possui nenhum progresso registrado.</p>
                </div>
              ) : (
                registros.map((registro) => (
                  <div className="progresso-item" key={registro.id}>
                    <div className="progresso-informacoes">
                      <h4>{formatarData(registro.dataRegistro)}</h4>
                      <p>
                        <strong>Peso:</strong> {registro.peso} kg
                      </p>
                      <p>
                        <strong>Treinos:</strong> {registro.frequenciaTreino}x
                      </p>
                      <p>
                        <strong>Sono:</strong> {registro.horasSono}h
                      </p>
                      {registro.observacoes && (
                        <p className="progresso-obs">
                          <strong>Obs:</strong> {registro.observacoes}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="botao-remover-progresso"
                      onClick={() => removerProgresso(registro.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER REUTILIZÁVEL */}
      <Footer />
    </div>
  )
}

export default Progresso