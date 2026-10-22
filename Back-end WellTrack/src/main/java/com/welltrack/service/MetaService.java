package com.welltrack.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.Enum.StatusMeta;
import com.welltrack.dto.meta.MetaRequestDTO;
import com.welltrack.dto.meta.MetaResponseDTO;
import com.welltrack.model.Meta;
import com.welltrack.model.Usuario;
import com.welltrack.repository.MetaRepository;
import com.welltrack.repository.UsuarioRepository;

@Service
public class MetaService {

    private final MetaRepository metaRepository;
    private final UsuarioRepository usuarioRepository;

    public MetaService(MetaRepository metaRepository, UsuarioRepository usuarioRepository) {
        this.metaRepository = metaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // CRIAR META
    @Transactional
    public MetaResponseDTO criarMeta(Long usuarioId, MetaRequestDTO dados) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (dados.getDataFim().isBefore(dados.getDataInicio())) {
            throw new RuntimeException("A data de fim não pode ser anterior à data de início.");
        }

        Meta meta = new Meta();
        meta.setUsuario(usuario);
        meta.setDescricao(dados.getDescricao());
        meta.setObjetivo(dados.getObjetivo());
        meta.setDataInicio(dados.getDataInicio());
        meta.setDataFim(dados.getDataFim());
        meta.setStatus(dados.getStatus());

        Meta metaSalva = metaRepository.save(meta);
        return converterParaResponse(metaSalva);
    }

 // BUSCAR META POR ID (Com validação)
    @Transactional(readOnly = true)
    public MetaResponseDTO buscarPorId(Long id, Long usuarioId) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));

        if (!meta.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para visualizar esta meta.");
        }

        return converterParaResponse(meta);
    }

    // LISTAR METAS DO USUÁRIO (PAGINADO)
    @Transactional(readOnly = true)
    public Page<MetaResponseDTO> listarPorUsuarioPaginado(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return metaRepository.findByUsuario(usuario, pageable)
                .map(this::converterParaResponse);
    }

    // LISTAR METAS POR STATUS
    @Transactional(readOnly = true)
    public List<MetaResponseDTO> listarPorUsuarioEStatus(Long usuarioId, StatusMeta status) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return metaRepository.findByUsuarioAndStatus(usuario, status)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

 // ATUALIZAR STATUS DA META (Com validação)
    @Transactional
    public MetaResponseDTO atualizarStatus(Long id, Long usuarioId, StatusMeta novoStatus) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));

        if (!meta.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para alterar esta meta.");
        }

        meta.setStatus(novoStatus);
        Meta metaAtualizada = metaRepository.save(meta);

        return converterParaResponse(metaAtualizada);
    }

 // EXCLUIR META (Com validação)
    @Transactional
    public void excluirMeta(Long id, Long usuarioId) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada."));

        if (!meta.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para excluir esta meta.");
        }

        metaRepository.delete(meta);
    }

    // CONVERTER ENTIDADE PARA RESPONSE DTO
    private MetaResponseDTO converterParaResponse(Meta meta) {
        return new MetaResponseDTO(
                meta.getId(),
                meta.getUsuario().getId(),
                meta.getDescricao(),
                meta.getObjetivo(),
                meta.getDataInicio(),
                meta.getDataFim(),
                meta.getStatus()
        );
    }
}