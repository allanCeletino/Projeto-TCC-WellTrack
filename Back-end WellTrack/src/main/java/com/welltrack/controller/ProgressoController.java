package com.welltrack.controller;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.Progresso.*;

import com.welltrack.service.ProgressoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/progresso")
@CrossOrigin(origins = "*")
public class ProgressoController {

    private final ProgressoService progressoService;

    public ProgressoController(ProgressoService progressoService) {
        this.progressoService = progressoService;
    }

    // 1. REGISTRAR PROGRESSO
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<ProgressoResponseDTO> registrarProgresso(
            @PathVariable Long usuarioId,
            @Valid @RequestBody ProgressoRequestDTO dados) {

        ProgressoResponseDTO novoProgresso = progressoService.registrarProgresso(usuarioId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProgresso);
    }

    // 2. BUSCAR PROGRESSO POR ID
    @GetMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<ProgressoResponseDTO> buscarPorId(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        ProgressoResponseDTO progresso = progressoService.buscarPorId(id, usuarioId);
        return ResponseEntity.ok(progresso);
    }

    // 3. HISTÓRICO PAGINADO DE PROGRESSO
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<ProgressoResponseDTO>> listarPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        Page<ProgressoResponseDTO> historico = progressoService.listarPorUsuarioPaginado(usuarioId, pageable);
        return ResponseEntity.ok(historico);
    }

    // 4. INTERVALO PARA GRÁFICOS DE EVOLUÇÃO (PESO, FREQUÊNCIA, SONO)
    @GetMapping("/usuario/{usuarioId}/grafico")
    public ResponseEntity<List<ProgressoResponseDTO>> buscarEvolucaoPorPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        List<ProgressoResponseDTO> evolucao = progressoService.buscarEvolucaoPorPeriodo(usuarioId, inicio, fim);
        return ResponseEntity.ok(evolucao);
    }

    // 5. REGISTRO MAIS RECENTE (DASHBOARD)
    @GetMapping("/usuario/{usuarioId}/mais-recente")
    public ResponseEntity<ProgressoResponseDTO> buscarMaisRecente(@PathVariable Long usuarioId) {
        ProgressoResponseDTO recente = progressoService.buscarMaisRecente(usuarioId);
        return ResponseEntity.ok(recente);
    }

    // 6. EXCLUIR REGISTRO DE PROGRESSO
    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<Void> excluirProgresso(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        progressoService.excluirProgresso(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
