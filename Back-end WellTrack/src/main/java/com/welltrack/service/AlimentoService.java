package com.welltrack.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.Enum.Categoria;
import com.welltrack.dto.alimento.AlimentoRequestDTO;
import com.welltrack.dto.alimento.AlimentoResponseDTO;
import com.welltrack.model.Alimento;
import com.welltrack.repository.AlimentoRepository;
import com.welltrack.repository.ItemAlimentacaoRepository;

@Service
public class AlimentoService {

    private final AlimentoRepository repository;
    private final ItemAlimentacaoRepository itemAlimentacaoRepository;

    // Injeção por construtor
    public AlimentoService(AlimentoRepository repository, ItemAlimentacaoRepository itemAlimentacaoRepository) {
        this.repository = repository;
        this.itemAlimentacaoRepository = itemAlimentacaoRepository;
    }

    // CADASTRAR ALIMENTO
    @Transactional
    public AlimentoResponseDTO cadastrarAlimento(AlimentoRequestDTO dados) {
        // Validação: impede cadastrar alimentos com nomes repetidos
        if (repository.findByNomeContainingIgnoreCase(dados.getNome(), Pageable.unpaged()).hasContent()) {
            throw new RuntimeException("Já existe um alimento cadastrado com esse nome.");
        }

        Alimento alimento = new Alimento();
        alimento.setNome(dados.getNome());
        alimento.setCategoria(dados.getCategoria());
        alimento.setCalorias100g(dados.getCalorias100g());
        alimento.setProteinas100g(dados.getProteinas100g());
        alimento.setCarboidratos100g(dados.getCarboidratos100g());
        alimento.setGorduras100g(dados.getGorduras100g());
        alimento.setFibras100g(dados.getFibras100g());

        Alimento salvo = repository.save(alimento);
        return converterParaResponse(salvo);
    }

    // BUSCAR POR ID
    @Transactional(readOnly = true)
    public AlimentoResponseDTO buscarPorId(Long id) {
        Alimento alimento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alimento não encontrado."));
        return converterParaResponse(alimento);
    }

    // BUSCAR PAGINADO POR NOME
    @Transactional(readOnly = true)
    public Page<AlimentoResponseDTO> buscarPorNome(String nome, Pageable pageable) {
        return repository.findByNomeContainingIgnoreCase(nome, pageable)
                .map(this::converterParaResponse);
    }

    // LISTAR POR CATEGORIA
    @Transactional(readOnly = true)
    public Page<AlimentoResponseDTO> buscarPorCategoria(Categoria categoria, Pageable pageable) {
        return repository.findByCategoria(categoria, pageable)
                .map(this::converterParaResponse);
    }

    // LISTAR TODOS
    @Transactional(readOnly = true)
    public List<AlimentoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // EXCLUIR ALIMENTO DO CATÁLOGO (COM CHECAGEM DE INTEGRIDADE)
    @Transactional
    public void excluirAlimento(Long id) {
        Alimento alimento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alimento não encontrado."));

        // Proteção contra erro de Chave Estrangeira do MySQL
        if (!itemAlimentacaoRepository.findByAlimento(alimento).isEmpty()) {
            throw new RuntimeException("Este alimento não pode ser excluído pois já está presente em históricos de refeições de usuários.");
        }

        repository.delete(alimento);
    }

    // CONVERTER ENTIDADE PARA RESPONSE DTO
    private AlimentoResponseDTO converterParaResponse(Alimento alimento) {
        return new AlimentoResponseDTO(
                alimento.getId(),
                alimento.getNome(),
                alimento.getCategoria(),
                alimento.getCalorias100g(),
                alimento.getProteinas100g(),
                alimento.getCarboidratos100g(),
                alimento.getGorduras100g(),
                alimento.getFibras100g()
        );
    }
}