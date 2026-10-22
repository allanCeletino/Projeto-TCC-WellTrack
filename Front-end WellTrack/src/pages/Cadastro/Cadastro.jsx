import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  async function cadastrarUsuario(event) {
    event.preventDefault()
    setMensagem('')

    if (!nome || !email || !senha || !confirmarSenha || !idade || !peso || !altura) {
      setMensagem('Preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não são iguais.')
      return
    }

    if (senha.length < 6) {
      setMensagem('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    const dadosUsuario = {
      nome: nome,
      email: email,
      senha: senha,
      idade: Number(idade),
      peso: Number(peso),
      altura: Number(altura)
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:8088/api/auth/cadastrar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosUsuario)
        }
      )

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível realizar o cadastro.'
        try {
          const erro = await resposta.json()
          if (erro.message) {
            mensagemErro = erro.message
          } else if (erro.mensagem) {
            mensagemErro = erro.mensagem
          }
        } catch {
          // Mantém a mensagem padrão
        }
        setMensagem(mensagemErro)
        return
      }

      await resposta.json()
      setMensagem('Cadastro realizado com sucesso!')

      setNome('')
      setEmail('')
      setSenha('')
      setConfirmarSenha('')
      setIdade('')
      setPeso('')
      setAltura('')

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (erro) {
      console.error('Erro ao cadastrar usuário:', erro)
      setMensagem('Não foi possível conectar ao servidor. Verifique se o Back-End está ligado.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="welltrack-body">
      {/* Top Navigation / Header */}
      <header className="welltrack-header">

           <img
            src="/src/assets/logo.jpeg"
            alt="WellTrack Logo"
            className="welltrack-logo-img"
          />
        
        <div className="welltrack-nav-text">
          Já tem uma conta? <Link to="/" className="welltrack-link">Entrar</Link>
        </div>
      </header>

      {/* Main Container / Cadastro */}
      <main className="welltrack-main">
        <div className="welltrack-card">
          <div className="welltrack-glow"></div>

          <div className="welltrack-form-header">
            <span className="welltrack-eyebrow">Comece Sua Jornada</span>
            <h1 className="welltrack-title">Crie sua conta</h1>
            <p className="welltrack-subtitle">Cadastre-se para começar a cuidar dos seus hábitos e da sua performance.</p>
          </div>

          <form className="welltrack-form" onSubmit={cadastrarUsuario}>
            <div className="welltrack-input-group">
              <label className="welltrack-label" htmlFor="nome">Nome Completo</label>
              <div className="welltrack-input-wrapper">
                <span className="welltrack-input-icon"><i className="fa-regular fa-user"></i></span>
                <input 
                  type="text" 
                  id="nome"
                  required 
                  placeholder="Ex: Carlos Silva" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="welltrack-input"
                />
              </div>
            </div>

            <div className="welltrack-input-group">
              <label className="welltrack-label" htmlFor="email-cadastro">E-mail</label>
              <div className="welltrack-input-wrapper">
                <span className="welltrack-input-icon"><i className="fa-regular fa-envelope"></i></span>
                <input 
                  type="email" 
                  id="email-cadastro"
                  required 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="welltrack-input"
                />
              </div>
            </div>

            <div className="welltrack-grid-3">
              <div className="welltrack-input-group">
                <label className="welltrack-label" htmlFor="idade">Idade</label>
                <input 
                  type="number" 
                  id="idade"
                  required 
                  placeholder="Ex: 30" 
                  min="1"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="welltrack-input welltrack-input-number"
                />
              </div>

              <div className="welltrack-input-group">
                <label className="welltrack-label" htmlFor="peso">Peso (kg)</label>
                <input 
                  type="number" 
                  id="peso"
                  required 
                  placeholder="Ex: 75" 
                  min="1"
                  step="0.01"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="welltrack-input welltrack-input-number"
                />
              </div>

              <div className="welltrack-input-group">
                <label className="welltrack-label" htmlFor="altura">Altura (m)</label>
                <input 
                  type="number" 
                  id="altura"
                  required 
                  placeholder="Ex: 1.75" 
                  min="0.1"
                  step="0.01"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  className="welltrack-input welltrack-input-number"
                />
              </div>
            </div>

            <div className="welltrack-input-group">
              <label className="welltrack-label" htmlFor="senha-cadastro">Senha</label>
              <div className="welltrack-input-wrapper">
                <span className="welltrack-input-icon"><i className="fa-regular fa-lock"></i></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="senha-cadastro"
                  required 
                  placeholder="Mínimo de 6 caracteres" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="welltrack-input welltrack-input-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="welltrack-eye-btn"
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="welltrack-input-group">
              <label className="welltrack-label" htmlFor="confirmar-senha">Confirmar Senha</label>
              <div className="welltrack-input-wrapper">
                <span className="welltrack-input-icon"><i className="fa-regular fa-lock"></i></span>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmar-senha"
                  required 
                  placeholder="Repita sua senha" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="welltrack-input welltrack-input-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="welltrack-eye-btn"
                >
                  <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {mensagem && (
              <p className="welltrack-mensagem" style={{ color: mensagem.includes('sucesso') ? '#ccff00' : '#ff4d4d' }}>
                {mensagem}
              </p>
            )}

            <button type="submit" disabled={carregando} className="welltrack-cta-button">
              <span>{carregando ? 'Cadastrando...' : 'Criar Conta Gratuita'}</span>
              {!carregando && <i className="fa-solid fa-arrow-right"></i>}
            </button>
          </form>

          <div className="welltrack-divider">
            <span>ou registre-se com</span>
          </div>

          <div className="welltrack-social-grid">
            <button type="button" className="welltrack-social-btn">
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button type="button" className="welltrack-social-btn">
              <i className="fa-brands fa-apple"></i> Apple
            </button>
          </div>
        </div>
      </main>

      <footer className="welltrack-footer">
        &copy; 2026 WellTrack. Todos os direitos reservados.
      </footer>
    </div>
  )
}