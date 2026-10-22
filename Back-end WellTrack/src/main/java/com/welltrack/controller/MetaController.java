package com.welltrack.controller;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.Enum.StatusMeta;
import com.welltrack.dto.meta.MetaRequestDTO;
import com.welltrack.dto.meta.MetaResponseDTO;
import com.welltrack.service.MetaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    // 1. CRIAR NOVA META
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<MetaResponseDTO> criarMeta(
            @PathVariable Long usuarioId,
            @Valid @RequestBody MetaRequestDTO dados) {

        MetaResponseDTO novaMeta = metaService.criarMeta(usuarioId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMeta);
    }

    // 2. BUSCAR META POR ID (Valida a propriedade do usuário logado)
    @GetMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<MetaResponseDTO> buscarPorId(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        MetaResponseDTO meta = metaService.buscarPorId(id, usuarioId);
        return ResponseEntity.ok(meta);
    }

    // 3. LISTAR METAS DO USUÁRIO (PAGINADO)
    // Exemplo: /api/metas/usuario/1?page=0&size=10
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<MetaResponseDTO>> listarPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        Page<MetaResponseDTO> metas = metaService.listarPorUsuarioPaginado(usuarioId, pageable);
        return ResponseEntity.ok(metas);
    }

    // 4. LISTAR METAS DO USUÁRIO FILTRADAS POR STATUS
    // Exemplo: /api/metas/usuario/1/status?status=EM_ANDAMENTO
    @GetMapping("/usuario/{usuarioId}/status")
    public ResponseEntity<List<MetaResponseDTO>> listarPorUsuarioEStatus(
            @PathVariable Long usuarioId,
            @RequestParam StatusMeta status) {

        List<MetaResponseDTO> metas = metaService.listarPorUsuarioEStatus(usuarioId, status);
        return ResponseEntity.ok(metas);
    }

    // 5. ATUALIZAR STATUS DA META (PATCH)
    // Exemplo: /api/metas/1/usuario/1/status?novoStatus=CONCLUIDA
    @PatchMapping("/{id}/usuario/{usuarioId}/status")
    public ResponseEntity<MetaResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @RequestParam StatusMeta novoStatus) {

        MetaResponseDTO metaAtualizada = metaService.atualizarStatus(id, usuarioId, novoStatus);
        return ResponseEntity.ok(metaAtualizada);
    }

    // 6. EXCLUIR META (Valida a propriedade do usuário logado)
    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<Void> excluirMeta(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {

        metaService.excluirMeta(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
