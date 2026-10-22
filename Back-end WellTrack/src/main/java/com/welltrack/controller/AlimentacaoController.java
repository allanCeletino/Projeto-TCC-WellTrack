package com.welltrack.controller;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

import com.welltrack.Enum.TipoRefeicao;
import com.welltrack.dto.alimentacao.AlimentacaoRequestDTO;
import com.welltrack.dto.alimentacao.AlimentacaoResponseDTO;
import com.welltrack.dto.alimentacao.ResumoNutricionalDTO;
import com.welltrack.service.AlimentacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/refeicoes")
@CrossOrigin(origins = "*")
public class AlimentacaoController {

    private final AlimentacaoService alimentacaoService;

    public AlimentacaoController(AlimentacaoService alimentacaoService) {
        this.alimentacaoService = alimentacaoService;
    }

    // 1. REGISTRAR REFEIÇÃO COMPLETA
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<AlimentacaoResponseDTO> registrarRefeicao(
            @PathVariable Long usuarioId,
            @Valid @RequestBody AlimentacaoRequestDTO dados) {

        AlimentacaoResponseDTO novaRefeicao = alimentacaoService.registrarRefeicao(usuarioId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaRefeicao);
    }

    // 2. BUSCAR REFEIÇÃO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<AlimentacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        AlimentacaoResponseDTO refeicao = alimentacaoService.buscarPorId(id);
        return ResponseEntity.ok(refeicao);
    }

    // 3. HISTÓRICO GERAL DE REFEIÇÕES DO USUÁRIO (PAGINADO)
    // Exemplo de URL: /api/refeicoes/usuario/1?page=0&size=10
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<AlimentacaoResponseDTO>> listarPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        Page<AlimentacaoResponseDTO> historico = alimentacaoService.listarPorUsuarioPaginado(usuarioId, pageable);
        return ResponseEntity.ok(historico);
    }

    // 4. RESUMO NUTRICIONAL DIÁRIO DA ALIMENTAÇÃO (TOTAL DE CALORIAS E MACROS DO DIA)
    // Exemplo de URL: /api/refeicoes/usuario/1/resumo-diario?data=2026-09-13
    @GetMapping("/usuario/{usuarioId}/resumo-diario")
    public ResponseEntity<ResumoNutricionalDTO> obterResumoDiario(
            @PathVariable Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        ResumoNutricionalDTO resumo = alimentacaoService.obterResumoDiario(usuarioId, data);
        return ResponseEntity.ok(resumo);
    }

    // 5. EXCLUIR REFEIÇÃO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirRefeicao(@PathVariable Long id) {
        alimentacaoService.excluirRefeicao(id);
        return ResponseEntity.noContent().build();
    }
}
