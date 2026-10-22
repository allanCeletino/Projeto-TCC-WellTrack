package com.welltrack.controller;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import com.welltrack.dto.TipoTreino.TipoTreinoRequestDTO;
import com.welltrack.dto.TipoTreino.TipoTreinoResponseDTO;
import com.welltrack.service.TipoTreinoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tipos-treino")
@CrossOrigin(origins = "*")
public class TipoTreinoController {

    private final TipoTreinoService tipoTreinoService;

    public TipoTreinoController(TipoTreinoService tipoTreinoService) {
        this.tipoTreinoService = tipoTreinoService;
    }

    // 1. CADASTRAR TIPO DE TREINO (Ex: Musculação, Corrida, Natação)
    @PostMapping
    public ResponseEntity<TipoTreinoResponseDTO> cadastrarTipoTreino(@Valid @RequestBody TipoTreinoRequestDTO dados) {
        TipoTreinoResponseDTO novoTipoTreino = tipoTreinoService.cadastrarTipoTreino(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTipoTreino);
    }

    // 2. BUSCAR TIPO DE TREINO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<TipoTreinoResponseDTO> buscarPorId(@PathVariable Long id) {
        TipoTreinoResponseDTO tipoTreino = tipoTreinoService.buscarPorId(id);
        return ResponseEntity.ok(tipoTreino);
    }

    // 3. LISTAR TODOS OS TIPOS DE TREINO (Catálogo geral para preencher select/dropdowns)
    @GetMapping
    public ResponseEntity<List<TipoTreinoResponseDTO>> listarTodos() {
        List<TipoTreinoResponseDTO> tiposTreino = tipoTreinoService.listarTodos();
        return ResponseEntity.ok(tiposTreino);
    }

    // 4. BUSCAR PAGINADO POR NOME E CALORIAS
    // Exemplo: /api/tipos-treino/buscar?nome=Corrida&caloriasPorHora=600&page=0&size=10
    @GetMapping("/buscar")
    public ResponseEntity<Page<TipoTreinoResponseDTO>> buscarPorNomeECalorias(
            @RequestParam String nome,
            @RequestParam BigDecimal caloriasPorHora,
            Pageable pageable) {

        Page<TipoTreinoResponseDTO> resultado = tipoTreinoService.buscarPorNomeECalorias(nome, caloriasPorHora, pageable);
        return ResponseEntity.ok(resultado);
    }

    // 5. ATUALIZAR TIPO DE TREINO
    @PutMapping("/{id}")
    public ResponseEntity<TipoTreinoResponseDTO> atualizarTipoTreino(
            @PathVariable Long id,
            @Valid @RequestBody TipoTreinoRequestDTO dados) {

        TipoTreinoResponseDTO tipoTreinoAtualizado = tipoTreinoService.atualizarTipoTreino(id, dados);
        return ResponseEntity.ok(tipoTreinoAtualizado);
    }

    // 6. EXCLUIR TIPO DE TREINO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirTipoTreino(@PathVariable Long id) {
        tipoTreinoService.excluirTipoTreino(id);
        return ResponseEntity.noContent().build();
    }
}
