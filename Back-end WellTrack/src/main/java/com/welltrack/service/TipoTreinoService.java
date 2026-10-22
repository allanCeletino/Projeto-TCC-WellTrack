package com.welltrack.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.dto.TipoTreino.TipoTreinoRequestDTO;
import com.welltrack.dto.TipoTreino.TipoTreinoResponseDTO;
import com.welltrack.model.TipoTreino;
import com.welltrack.repository.TipoTreinoRepository;

@Service
public class TipoTreinoService {

    private final TipoTreinoRepository repository;

    // Injeção por construtor
    public TipoTreinoService(TipoTreinoRepository repository) {
        this.repository = repository;
    }

    // CADASTRAR TIPO DE TREINO
    @Transactional
    public TipoTreinoResponseDTO cadastrarTipoTreino(TipoTreinoRequestDTO dados) {
        TipoTreino tipoTreino = new TipoTreino();
        tipoTreino.setNome(dados.getNome());
        tipoTreino.setCaloriasPorHora(dados.getCaloriasPorHora());

        TipoTreino salvo = repository.save(tipoTreino);
        return converterParaResponse(salvo);
    }

    // BUSCAR POR ID
    @Transactional(readOnly = true)
    public TipoTreinoResponseDTO buscarPorId(Long id) {
        TipoTreino tipoTreino = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de treino não encontrado."));

        return converterParaResponse(tipoTreino);
    }

    // LISTAR TODOS
    @Transactional(readOnly = true)
    public List<TipoTreinoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // BUSCAR PAGINADO POR NOME E CALORIAS
    @Transactional(readOnly = true)
    public Page<TipoTreinoResponseDTO> buscarPorNomeECalorias(
            String nome,
            BigDecimal caloriasPorHora,
            Pageable pageable) {

        return repository.findByNomeAndCaloriasPorHora(nome, caloriasPorHora, pageable)
                .map(this::converterParaResponse);
    }

    // ATUALIZAR TIPO DE TREINO
    @Transactional
    public TipoTreinoResponseDTO atualizarTipoTreino(Long id, TipoTreinoRequestDTO dados) {
        TipoTreino tipoTreino = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de treino não encontrado."));

        tipoTreino.setNome(dados.getNome());
        tipoTreino.setCaloriasPorHora(dados.getCaloriasPorHora());

        TipoTreino atualizado = repository.save(tipoTreino);
        return converterParaResponse(atualizado);
    }

    // EXCLUIR TIPO DE TREINO
    @Transactional
    public void excluirTipoTreino(Long id) {
        TipoTreino tipoTreino = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de treino não encontrado."));

        repository.delete(tipoTreino);
    }

    // CONVERTER ENTIDADE PARA RESPONSE DTO
    private TipoTreinoResponseDTO converterParaResponse(TipoTreino tipoTreino) {
        return new TipoTreinoResponseDTO(
            tipoTreino.getId(),
            tipoTreino.getNome(),
            tipoTreino.getCaloriasPorHora()
        );
    }
}