package com.welltrack.controller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.sono.SonoRequestDTO;
import com.welltrack.dto.sono.SonoResponseDTO;
import com.welltrack.service.SonoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sono")
@CrossOrigin(origins = "*")
public class SonoController {

    private final SonoService sonoService;

    public SonoController(SonoService sonoService) {
        this.sonoService = sonoService;
    }

    // 1. REGISTRAR NOITE DE SONO
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<SonoResponseDTO> registrarSono(
            @PathVariable Long usuarioId,
            @Valid @RequestBody SonoRequestDTO dados) {

        SonoResponseDTO novoRegistro = sonoService.registrarSono(usuarioId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRegistro);
    }

    // 2. BUSCAR REGISTRO DE SONO POR ID
    @GetMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<SonoResponseDTO> buscarPorId(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        SonoResponseDTO sono = sonoService.buscarPorId(id, usuarioId);
        return ResponseEntity.ok(sono);
    }

    // 3. HISTÓRICO PAGINADO DO USUÁRIO
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<SonoResponseDTO>> listarPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        Page<SonoResponseDTO> historico = sonoService.listarPorUsuarioPaginado(usuarioId, pageable);
        return ResponseEntity.ok(historico);
    }

    // 4. EXCLUIR REGISTRO DE SONO
    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<Void> excluirRegistro(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        sonoService.excluirRegistro(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
