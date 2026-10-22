package com.welltrack.controller;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.Enum.Categoria;
import com.welltrack.dto.alimento.AlimentoRequestDTO;
import com.welltrack.dto.alimento.AlimentoResponseDTO;
import com.welltrack.service.AlimentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/alimentos")
@CrossOrigin(origins = "*")
public class AlimentoController {

    private final AlimentoService alimentoService;

    public AlimentoController(AlimentoService alimentoService) {
        this.alimentoService = alimentoService;
    }

    // 1. CADASTRAR ALIMENTO NO CATÁLOGO
    @PostMapping
    public ResponseEntity<AlimentoResponseDTO> cadastrarAlimento(@Valid @RequestBody AlimentoRequestDTO dados) {
        AlimentoResponseDTO novoAlimento = alimentoService.cadastrarAlimento(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAlimento);
    }

    // 2. BUSCAR ALIMENTO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<AlimentoResponseDTO> buscarPorId(@PathVariable Long id) {
        AlimentoResponseDTO alimento = alimentoService.buscarPorId(id);
        return ResponseEntity.ok(alimento);
    }

    // 3. BUSCAR PAGINADO POR NOME (Exemplo: /api/alimentos/buscar?nome=arroz&page=0&size=10)
    @GetMapping("/buscar")
    public ResponseEntity<Page<AlimentoResponseDTO>> buscarPorNome(
            @RequestParam String nome,
            Pageable pageable) {

        Page<AlimentoResponseDTO> alimentos = alimentoService.buscarPorNome(nome, pageable);
        return ResponseEntity.ok(alimentos);
    }

    // 4. LISTAR PAGINADO POR CATEGORIA (Exemplo: /api/alimentos/categoria/PROTEINAS?page=0&size=10)
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<Page<AlimentoResponseDTO>> buscarPorCategoria(
            @PathVariable Categoria categoria,
            Pageable pageable) {

        Page<AlimentoResponseDTO> alimentos = alimentoService.buscarPorCategoria(categoria, pageable);
        return ResponseEntity.ok(alimentos);
    }

    // 5. LISTAR TODOS OS ALIMENTOS (Sem paginação)
    @GetMapping
    public ResponseEntity<List<AlimentoResponseDTO>> listarTodos() {
        List<AlimentoResponseDTO> alimentos = alimentoService.listarTodos();
        return ResponseEntity.ok(alimentos);
    }

    // 6. EXCLUIR ALIMENTO DO CATÁLOGO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAlimento(@PathVariable Long id) {
        alimentoService.excluirAlimento(id);
        return ResponseEntity.noContent().build();
    }
}
