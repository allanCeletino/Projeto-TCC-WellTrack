package com.welltrack.controller;
import java.time.LocalDateTime;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.treino.TreinoRequestDTO;
import com.welltrack.dto.treino.TreinoResponseDTO;
import com.welltrack.service.TreinoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/treinos")
@CrossOrigin(origins = "*")
public class TreinoController {

    private final TreinoService treinoService;

    public TreinoController(TreinoService treinoService) {
        this.treinoService = treinoService;
    }

    // 1. CADASTRAR TREINO
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<TreinoResponseDTO> cadastrarTreino(
            @PathVariable Long usuarioId,
            @Valid @RequestBody TreinoRequestDTO dados) {

        TreinoResponseDTO novoTreino = treinoService.cadastrarTreino(usuarioId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTreino);
    }

    // 2. BUSCAR TREINO POR ID (Com validação de segurança)
    @GetMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<TreinoResponseDTO> buscarPorId(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        TreinoResponseDTO treino = treinoService.buscarPorId(id, usuarioId);
        return ResponseEntity.ok(treino);
    }

    // 3. HISTÓRICO DE TREINOS DO USUÁRIO (PAGINADO)
    // Exemplo: /api/treinos/usuario/1?page=0&size=10
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<TreinoResponseDTO>> listarPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        Page<TreinoResponseDTO> treinos = treinoService.listarPorUsuarioPaginado(usuarioId, pageable);
        return ResponseEntity.ok(treinos);
    }

    // 4. BUSCAR TREINOS POR PERÍODO DE DATAS (PAGINADO)
    // Exemplo: /api/treinos/usuario/1/periodo?inicio=2026-09-01T00:00:00&fim=2026-09-30T23:59:59&page=0&size=10
    @GetMapping("/usuario/{usuarioId}/periodo")
    public ResponseEntity<Page<TreinoResponseDTO>> buscarPorPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            Pageable pageable) {

        Page<TreinoResponseDTO> treinos = treinoService.buscarPorPeriodo(usuarioId, inicio, fim, pageable);
        return ResponseEntity.ok(treinos);
    }

    // 5. ATUALIZAR TREINO
    @PutMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<TreinoResponseDTO> atualizarTreino(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @Valid @RequestBody TreinoRequestDTO dados) {

        TreinoResponseDTO treinoAtualizado = treinoService.atualizarTreino(id, usuarioId, dados);
        return ResponseEntity.ok(treinoAtualizado);
    }

    // 6. EXCLUIR TREINO
    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<Void> excluirTreino(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        treinoService.excluirTreino(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
