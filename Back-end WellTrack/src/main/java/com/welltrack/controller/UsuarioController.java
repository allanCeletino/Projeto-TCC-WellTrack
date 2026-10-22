package com.welltrack.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.usuario.UsuarioResponseDTO;
import com.welltrack.dto.usuario.UsuarioUpdateRequestDTO;
import com.welltrack.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // BUSCAR USUÁRIO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    // BUSCAR USUÁRIO POR E-MAIL
    @GetMapping("/email")
    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(@RequestParam String email) {
        UsuarioResponseDTO usuario = usuarioService.buscarPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    // LISTAR TODOS OS USUÁRIOS
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    // ATUALIZAR PERFIL DO USUÁRIO
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequestDTO dados) {

        UsuarioResponseDTO usuarioAtualizado = usuarioService.atualizarUsuario(id, dados);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    // INATIVAR CONTA DO USUÁRIO
    @PutMapping("/{id}/inativar")
    public ResponseEntity<UsuarioResponseDTO> inativarUsuario(@PathVariable Long id) {
        UsuarioResponseDTO usuarioInativado = usuarioService.inativarUsuario(id);
        return ResponseEntity.ok(usuarioInativado);
    }
}
