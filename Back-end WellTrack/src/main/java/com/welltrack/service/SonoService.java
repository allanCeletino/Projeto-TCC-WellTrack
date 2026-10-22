package com.welltrack.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.dto.sono.SonoRequestDTO;
import com.welltrack.dto.sono.SonoResponseDTO;
import com.welltrack.model.Sono;
import com.welltrack.model.Usuario;
import com.welltrack.repository.SonoRepository;
import com.welltrack.repository.UsuarioRepository;

@Service
public class SonoService {

    private final SonoRepository sonoRepository;
    private final UsuarioRepository usuarioRepository;

    public SonoService(SonoRepository sonoRepository, UsuarioRepository usuarioRepository) {
        this.sonoRepository = sonoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // REGISTRAR SONO
    @Transactional
    public SonoResponseDTO registrarSono(Long usuarioId, SonoRequestDTO dados) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Sono sono = new Sono();
        sono.setUsuario(usuario);
        sono.setQualidadeSono(dados.getQualidadeSono());
        sono.setHorarioDormiu(dados.getHorarioDormiu());
        sono.setHorarioAcordou(dados.getHorarioAcordou());
        sono.setData(dados.getData());
        sono.setDescricao(dados.getDescricao());

        Sono salvo = sonoRepository.save(sono);
        return converterParaResponse(salvo);
    }

 // BUSCAR SONO POR ID (Com validação)
    @Transactional(readOnly = true)
    public SonoResponseDTO buscarPorId(Long id, Long usuarioId) {
        Sono sono = sonoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de sono não encontrado."));

        if (!sono.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para visualizar este registro.");
        }

        return converterParaResponse(sono);
    }

    // HISTÓRICO PAGINADO DO USUÁRIO
    @Transactional(readOnly = true)
    public Page<SonoResponseDTO> listarPorUsuarioPaginado(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return sonoRepository.findByUsuario(usuario, pageable)
                .map(this::converterParaResponse);
    }

 // EXCLUIR REGISTRO DE SONO (Com validação)
    @Transactional
    public void excluirRegistro(Long id, Long usuarioId) {
        Sono sono = sonoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de sono não encontrado."));

        if (!sono.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para excluir este registro.");
        }

        sonoRepository.delete(sono);
    }

    // CONVERTER ENTIDADE PARA RESPONSE DTO
    private SonoResponseDTO converterParaResponse(Sono sono) {
        return new SonoResponseDTO(
                sono.getId(),
                sono.getUsuario().getId(),
                sono.getQualidadeSono(),
                sono.getHorarioDormiu(),
                sono.getHorarioAcordou(),
                sono.getData(),
                sono.getDescricao()
        );
    }
}