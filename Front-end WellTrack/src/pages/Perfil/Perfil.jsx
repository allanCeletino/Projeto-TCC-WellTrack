import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Perfil.css'

function Perfil() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)

  // Formata altura para sempre exibir duas casas decimais (ex: 1.7 -> "1.70")
  const formatarAltura = (val) => {
    if (!val && val !== 0) return ''
    const num = Number(val)
    return isNaN(num) ? val : num.toFixed(2)
  }

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem('token')
      const usuarioId = localStorage.getItem('usuarioId')

      // Carrega foto salva localmente (se existir)
      const fotoSalva = localStorage.getItem(`foto_perfil_${usuarioId}`)
      if (fotoSalva) {
        setFotoPerfil(fotoSalva)
      }

      if (!token || !usuarioId) {
        navigate('/')
        return
      }

      try {
        const resposta = await fetch(
          `http://localhost:8088/api/usuarios/${usuarioId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar o perfil.')
        }

        const usuario = await resposta.json()

        setNome(usuario.nome || '')
        setEmail(usuario.email || '')
        setIdade(usuario.idade || '')
        setPeso(usuario.peso || '')
        setAltura(usuario.altura !== undefined ? formatarAltura(usuario.altura) : '')
        if (usuario.foto) setFotoPerfil(usuario.foto)
      } catch (erro) {
        console.error(erro)
        setMensagem('Não foi possível carregar os dados do perfil.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPerfil()
  }, [navigate])

  // Trata o upload de foto do utilizador
  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFotoPerfil(base64String)
        const usuarioId = localStorage.getItem('usuarioId')
        if (usuarioId) {
          localStorage.setItem(`foto_perfil_${usuarioId}`, base64String)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove a foto de perfil
  const handleRemoverFoto = () => {
    setFotoPerfil('')
    const usuarioId = localStorage.getItem('usuarioId')
    if (usuarioId) {
      localStorage.removeItem(`foto_perfil_${usuarioId}`)
    }
  }

  async function salvarPerfil(event) {
    event.preventDefault()

    if (
      nome === '' ||
      email === '' ||
      idade === '' ||
      peso === '' ||
      altura === ''
    ) {
      setMensagem('Preencha todos os campos.')
      return
    }

    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('usuarioId')

    if (!token || !usuarioId) {
      navigate('/')
      return
    }

    const dadosUsuario = {
      nome: nome,
      email: email,
      senha: '',
      idade: Number(idade),
      peso: Number(peso),
      altura: Number(altura)
    }

    try {
      setMensagem('Salvando alterações...')

      const resposta = await fetch(
        `http://localhost:8088/api/usuarios/${usuarioId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(dadosUsuario)
        }
      )

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível atualizar o perfil.'

        try {
          const erro = await resposta.json()
          if (erro.message) {
            mensagemErro = erro.message
          }
        } catch {
          // Mantém mensagem padrão
        }

        throw new Error(mensagemErro)
      }

      const usuarioAtualizado = await resposta.json()

      setNome(usuarioAtualizado.nome || '')
      setEmail(usuarioAtualizado.email || '')
      setIdade(usuarioAtualizado.idade || '')
      setPeso(usuarioAtualizado.peso || '')
      setAltura(usuarioAtualizado.altura !== undefined ? formatarAltura(usuarioAtualizado.altura) : '')

      setMensagem('Perfil atualizado com sucesso.')
    } catch (erro) {
      console.error(erro)
      setMensagem(erro.message)
    }
  }

  if (carregando) {
    return (
      <div className="perfil-page">
        <Header nomeUsuario={nome} paginaAtiva="perfil" />
        <main className="perfil-main">
          <h2 className="perfil-loading">Carregando dados do perfil...</h2>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="perfil-page">
      {/* HEADER REUTILIZÁVEL */}
      <Header nomeUsuario={nome} paginaAtiva="perfil" />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="perfil-main">
        <div className="perfil-titulo-wrapper">
          <span className="perfil-eyebrow">SUA CONTA</span>
          <h1>MEU PERFIL</h1>
        </div>

        <div className="perfil-grid">
          
          {/* CARD DE PERFIL */}
          <div className="perfil-card user-card">
            <div className="card-top-line"></div>
            
            <div className="avatar-wrapper">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Foto de Perfil" />
              ) : (
                <div className="avatar-placeholder">
                  {nome ? nome.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              
              <label htmlFor="foto-upload" className="avatar-upload-btn" title="Alterar Foto">
                📷
              </label>
              <input 
                type="file" 
                id="foto-upload" 
                accept="image/*" 
                onChange={handleFotoChange}
                style={{ display: 'none' }} 
              />
            </div>

            {/* BOTÃO PARA REMOVER FOTO (EXIBIDO APENAS SE HOUVER FOTO) */}
            {fotoPerfil && (
              <button 
                type="button" 
                onClick={handleRemoverFoto}
                className="btn-remover-foto"
              >
                Remover foto
              </button>
            )}

            <h2>{nome || 'Atleta WellTrack'}</h2>
            <p className="user-email">{email || 'membro@welltrack.com'}</p>

            <div className="user-stats-grid">
              <div className="stat-box">
                <span className="stat-value">{peso ? `${peso}kg` : '--'}</span>
                <span className="stat-label">PESO ATUAL</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{idade || '--'}</span>
                <span className="stat-label">IDADE</span>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <div className="perfil-form-container">
            <div className="perfil-card form-card">
              <div className="form-header">
                <h3>Dados Cadastrais</h3>
                <span className="sync-badge">SINCRONIZADO</span>
              </div>

              <form onSubmit={salvarPerfil} className="perfil-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome-perfil">Nome</label>
                    <input
                      type="text"
                      id="nome-perfil"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email-perfil">E-mail</label>
                    <input
                      type="email"
                      id="email-perfil"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label htmlFor="idade">Idade</label>
                    <input
                      type="number"
                      id="idade"
                      min="1"
                      value={idade}
                      onChange={(event) => setIdade(event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      id="peso"
                      min="1"
                      value={peso}
                      onChange={(event) => setPeso(event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="altura">Altura (m)</label>
                    <input
                      type="text"
                      id="altura"
                      placeholder="Ex: 1,70"
                      value={altura}
                      onChange={(event) => setAltura(event.target.value)}
                      onBlur={(event) => setAltura(formatarAltura(event.target.value))}
                    />
                  </div>
                </div>

                {mensagem && (
                  <div className="perfil-mensagem">
                    {mensagem}
                  </div>
                )}

                <button type="submit" className="perfil-btn-submit">
                  SALVAR ALTERAÇÕES
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER REUTILIZÁVEL */}
      <Footer />
    </div>
  )
}

export default Perfil