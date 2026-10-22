package com.welltrack.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.auth.LoginRequestDTO;
import com.welltrack.dto.auth.LoginResponseDTO;
import com.welltrack.dto.usuario.UsuarioCreateRequestDTO;
import com.welltrack.dto.usuario.UsuarioResponseDTO;
import com.welltrack.service.AuthService;
import com.welltrack.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    // Injeção de dependências por construtor
    public AuthController(AuthService authService, UsuarioService usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    // CADASTRO INICIAL DE USUÁRIO
    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody UsuarioCreateRequestDTO dados) {
        UsuarioResponseDTO novoUsuario = usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    // LOGIN DE USUÁRIO
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dados) {
        LoginResponseDTO response = authService.logar(dados);
        return ResponseEntity.ok(response);
    }
}