
import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Extrai os dados do usuário do token JWT
  function obterDadosDoToken(token) {
    try {
      const partesToken = token.split('.');

      if (partesToken.length !== 3) {
        return null;
      }

      const payloadBase64 = partesToken[1];

      const payloadCorrigido = payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const payload = decodeURIComponent(
        atob(payloadCorrigido)
          .split('')
          .map((caractere) => {
            return (
              '%' +
              caractere.charCodeAt(0)
                .toString(16)
                .padStart(2, '0')
            );
          })
          .join('')
      );

      return JSON.parse(payload);
    } catch (erro) {
      console.error('Erro ao ler o token:', erro);
      return null;
    }
  }

  // Realiza o login utilizando o backend
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (!email.trim() || !password) {
      setMessage('Preencha o e-mail e a senha.');
      return;
    }

    try {
      setIsLoading(true);

      const resposta = await fetch(
        'http://localhost:8088/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            senha: password
          })
        }
      );

      // Trata erros retornados pelo backend
      if (!resposta.ok) {
        let mensagemErro = 'E-mail ou senha inválidos.';

        try {
          const erro = await resposta.json();

          if (erro.message) {
            mensagemErro = erro.message;
          } else if (erro.mensagem) {
            mensagemErro = erro.mensagem;
          }
        } catch {
          // Mantém a mensagem padrão.
        }

        setMessage(mensagemErro);
        return;
      }

      const dados = await resposta.json();

      // Verifica se o backend retornou o token
      if (!dados.token) {
        setMessage(
          'O servidor não retornou o token de acesso.'
        );
        return;
      }

      // Obtém o ID do usuário através do token
      const dadosToken = obterDadosDoToken(dados.token);

      if (
        !dadosToken ||
        dadosToken.id === undefined ||
        dadosToken.id === null
      ) {
        setMessage(
          'Não foi possível identificar o usuário conectado.'
        );
        return;
      }

      // Salva os dados da sessão
      localStorage.setItem('token', dados.token);
      localStorage.setItem(
        'usuarioId',
        String(dadosToken.id)
      );

      // Redireciona para o dashboard
      navigate('/dashboard');

    } catch (erro) {
      console.error('Erro ao realizar login:', erro);

      setMessage(
        'Não foi possível conectar ao servidor. ' +
        'Verifique se o Back-End está ligado.'
      );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="welltrack-login-container">

      {/* Header */}
      <header className="welltrack-header">
        <div className="welltrack-brand">
       

          <img
            src="/src/assets/logo.jpeg"
            alt="WellTrack Logo"
            className="welltrack-logo-img"
          />

         
        </div>

        <div className="welltrack-header-right">
          <span>Não tem uma conta?</span>

          <Link
            to="/Cadastro"
            className="welltrack-link-accent"
          >
            Cadastre-se
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="welltrack-main">
        <div className="welltrack-card">

          <div className="welltrack-card-glow-bar"></div>

          <div className="welltrack-card-header">
            <span className="welltrack-badge">
              Acesso Exclusivo
            </span>

            <h1 className="welltrack-title">
              BEM-VINDO DE VOLTA
            </h1>

            <p className="welltrack-subtitle">
              Entre para acessar seu painel de treinos e progresso.
            </p>
          </div>

          {/* Formulário de login */}
          <form
            onSubmit={handleSubmit}
            className="welltrack-form"
          >

            {/* E-mail */}
            <div className="welltrack-field-group">
              <label htmlFor="email">
                E-mail ou Usuário
              </label>

              <div className="welltrack-input-wrapper">
                <i className="fa-regular fa-envelope welltrack-input-icon"></i>

                <input
                  type="email"
                  id="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="welltrack-field-group">
              <div className="welltrack-label-row">
                <label htmlFor="password">
                  Senha
                </label>

                <a
                  href="#forgot"
                  className="welltrack-forgot-link"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <div className="welltrack-input-wrapper">
                <i className="fa-solid fa-lock welltrack-input-icon"></i>

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="welltrack-eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                >
                  <i
                    className={`fa-regular ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Mensagens de erro */}
            {message && (
              <p
                className="mensagem-login"
                role="alert"
              >
                {message}
              </p>
            )}

            {/* Lembrar de mim */}
            <div className="welltrack-checkbox-row">
              <label className="welltrack-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>Lembrar de mim</span>
              </label>
            </div>

            {/* Botão de entrar */}
            <button
              type="submit"
              className="welltrack-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
                </>
              )}
            </button>

          </form>

          {/* Separador */}
          <div className="welltrack-divider">
            <span>ou entre com</span>
          </div>

          {/* Botões sociais */}
          <div className="welltrack-social-grid">
            <button
              type="button"
              className="welltrack-social-btn"
            >
              <i className="fa-brands fa-google"></i>
              Google
            </button>

            <button
              type="button"
              className="welltrack-social-btn"
            >
              <i className="fa-brands fa-apple"></i>
              Apple ID
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="welltrack-footer">
        <p>
          &copy; 2026 WellTrack Fitness. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
