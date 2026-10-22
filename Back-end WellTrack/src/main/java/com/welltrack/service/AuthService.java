package com.welltrack.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.Enum.Status;
import com.welltrack.dto.auth.LoginRequestDTO;
import com.welltrack.dto.auth.LoginResponseDTO;
import com.welltrack.model.Usuario;
import com.welltrack.repository.UsuarioRepository;
import com.welltrack.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    // Injeção por construtor com o JwtService
    public AuthService(UsuarioRepository repository, PasswordEncoder encoder, JwtService jwtService) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO logar(LoginRequestDTO loginDados) {

        // 1. Normaliza o e-mail e busca no banco
        String emailClean = loginDados.getEmail().trim().toLowerCase();
        Usuario usuario = repository.findByEmail(emailClean)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        // 2. Valida se a conta do usuário está ativa
        if (usuario.getStatus() == Status.INATIVO) {
            throw new RuntimeException("Conta inativa. Entre em contato com o suporte.");
        }

        // 3. Valida se a senha bate com o hash BCrypt
        if (!encoder.matches(loginDados.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        // 4. Gera o Token JWT real utilizando os dados do usuário
        String token = jwtService.gerarToken(usuario);

        return new LoginResponseDTO(token);
    }
}