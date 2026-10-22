package com.welltrack.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.dto.Progresso.ProgressoRequestDTO;
import com.welltrack.dto.Progresso.ProgressoResponseDTO;
import com.welltrack.model.Progresso;
import com.welltrack.model.Usuario;
import com.welltrack.repository.ProgressoRepository;
import com.welltrack.repository.UsuarioRepository;

@Service
public class ProgressoService {

    private final ProgressoRepository progressoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProgressoService(ProgressoRepository progressoRepository, UsuarioRepository usuarioRepository) {
        this.progressoRepository = progressoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // REGISTRAR PROGRESSO
    @Transactional
    public ProgressoResponseDTO registrarProgresso(Long usuarioId, ProgressoRequestDTO dados) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Se já existir registro no mesmo dia, lança exceção
        progressoRepository.findByUsuarioAndDataRegistro(usuario, dados.getDataRegistro())
                .ifPresent(p -> {
                    throw new RuntimeException("Já existe um registro de progresso para a data informada.");
                });

        Progresso progresso = new Progresso();
        progresso.setUsuario(usuario);
        progresso.setDataRegistro(dados.getDataRegistro());
        progresso.setPeso(dados.getPeso());
        progresso.setFrequenciaTreino(dados.getFrequenciaTreino());
        progresso.setHorasSono(dados.getHorasSono());
        progresso.setObservacoes(dados.getObservacoes());

        Progresso salvo = progressoRepository.save(progresso);
        return converterParaResponse(salvo);
    }

    // BUSCAR PROGRESSO POR ID (Com validação de segurança)
    @Transactional(readOnly = true)
    public ProgressoResponseDTO buscarPorId(Long id, Long usuarioId) {
        Progresso progresso = progressoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de progresso não encontrado."));

        if (!progresso.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para visualizar este registro.");
        }

        return converterParaResponse(progresso);
    }

    // BUSCAR HISTÓRICO PAGINADO (TELA/TABELA)
    @Transactional(readOnly = true)
    public Page<ProgressoResponseDTO> listarPorUsuarioPaginado(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return progressoRepository.findByUsuarioOrderByDataRegistroDesc(usuario, pageable)
                .map(this::converterParaResponse);
    }

    // BUSCAR INTERVALO DE DADOS (PARA GRÁFICOS DE EVOLUÇÃO)
    @Transactional(readOnly = true)
    public List<ProgressoResponseDTO> buscarEvolucaoPorPeriodo(Long usuarioId, LocalDate inicio, LocalDate fim) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return progressoRepository.findByUsuarioAndDataRegistroBetweenOrderByDataRegistroAsc(usuario, inicio, fim)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // BUSCAR O REGISTRO MAIS RECENTE (PARA DASHBOARD)
    @Transactional(readOnly = true)
    public ProgressoResponseDTO buscarMaisRecente(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Progresso maisRecente = progressoRepository.findFirstByUsuarioOrderByDataRegistroDesc(usuario)
                .orElseThrow(() -> new RuntimeException("Nenhum registro de progresso encontrado."));

        return converterParaResponse(maisRecente);
    }

    // EXCLUIR PROGRESSO (Com validação de segurança)
    @Transactional
    public void excluirProgresso(Long id, Long usuarioId) {
        Progresso progresso = progressoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de progresso não encontrado."));

        if (!progresso.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para excluir este registro.");
        }

        progressoRepository.delete(progresso);
    }

    // CONVERTER ENTIDADE PARA RESPONSE DTO
    private ProgressoResponseDTO converterParaResponse(Progresso progresso) {
        return new ProgressoResponseDTO(
                progresso.getId(),
                progresso.getUsuario().getId(),
                progresso.getDataRegistro(),
                progresso.getPeso(),
                progresso.getFrequenciaTreino(),
                progresso.getHorasSono(),
                progresso.getObservacoes()
        );
    }
}
