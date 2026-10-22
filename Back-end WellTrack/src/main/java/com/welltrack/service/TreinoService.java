package com.welltrack.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.dto.treino.TreinoRequestDTO;
import com.welltrack.dto.treino.TreinoResponseDTO;
import com.welltrack.model.TipoTreino;
import com.welltrack.model.Treino;
import com.welltrack.model.Usuario;
import com.welltrack.repository.TipoTreinoRepository;
import com.welltrack.repository.TreinoRepository;
import com.welltrack.repository.UsuarioRepository;

@Service
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final TipoTreinoRepository tipoTreinoRepository;
    private final UsuarioRepository usuarioRepository;

    // Injeção por construtor
    public TreinoService(TreinoRepository treinoRepository,
                         TipoTreinoRepository tipoTreinoRepository,
                         UsuarioRepository usuarioRepository) {
        this.treinoRepository = treinoRepository;
        this.tipoTreinoRepository = tipoTreinoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // CADASTRAR TREINO
    @Transactional
    public TreinoResponseDTO cadastrarTreino(Long usuarioId, TreinoRequestDTO dados) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        TipoTreino tipoTreino = tipoTreinoRepository.findById(dados.getTipoTreinoId())
                .orElseThrow(() -> new RuntimeException("Tipo de treino não encontrado."));

        // Cálculo seguro de calorias aplicado no cadastro
        BigDecimal caloriasGastas = calcularCalorias(tipoTreino.getCaloriasPorHora(), dados.getDuracao());

        Treino treino = new Treino();
        treino.setUsuario(usuario);
        treino.setTipoTreino(tipoTreino);
        treino.setDuracao(dados.getDuracao());
        treino.setDataHora(dados.getDataHora());
        treino.setCaloriasGastas(caloriasGastas);
        treino.setObservacao(dados.getObservacao());

        Treino treinoSalvo = treinoRepository.save(treino);

        return converterParaResponse(treinoSalvo);
    }

    @Transactional(readOnly = true)
    public TreinoResponseDTO buscarPorId(Long id, Long usuarioId) {
        Treino treino = treinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado."));
        validarDono(treino.getUsuario(), usuarioId);
        return converterParaResponse(treino);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<TreinoResponseDTO> listarPorUsuarioPaginado(Long usuarioId, org.springframework.data.domain.Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return treinoRepository.findByUsuario(usuario, pageable).map(this::converterParaResponse);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<TreinoResponseDTO> buscarPorPeriodo(Long usuarioId, java.time.LocalDateTime inicio, java.time.LocalDateTime fim, org.springframework.data.domain.Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        if (fim.isBefore(inicio)) throw new RuntimeException("O fim não pode ser anterior ao início.");
        return treinoRepository.findByUsuarioAndDataHoraBetween(usuario, inicio, fim, pageable).map(this::converterParaResponse);
    }

    private void validarDono(Usuario usuario, Long usuarioId) {
        if (!usuario.getId().equals(usuarioId)) throw new RuntimeException("Acesso negado.");
    }


    @Transactional(readOnly = true)
    public TreinoResponseDTO buscarPorId(Long id) {

        Treino treino = treinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado."));

        return converterParaResponse(treino);
    }

    // LISTAR TODOS OS TREINOS
    @Transactional(readOnly = true)
    public List<TreinoResponseDTO> listarTodos() {

        return treinoRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // ATUALIZAR TREINO
 // ATUALIZAR TREINO (com recebimento do usuarioId e validação de posse)
    @Transactional
    public TreinoResponseDTO atualizarTreino(Long id, Long usuarioId, TreinoRequestDTO dados) {

        Treino treino = treinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado."));

        // Validação de segurança: garante que o treino pertence ao usuário logado
        if (!treino.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para alterar este treino.");
        }

        TipoTreino tipoTreino = tipoTreinoRepository.findById(dados.getTipoTreinoId())
                .orElseThrow(() -> new RuntimeException("Tipo de treino não encontrado."));

        // Cálculo seguro de calorias aplicado na atualização
        BigDecimal caloriasGastas = calcularCalorias(tipoTreino.getCaloriasPorHora(), dados.getDuracao());

        treino.setTipoTreino(tipoTreino);
        treino.setDuracao(dados.getDuracao());
        treino.setDataHora(dados.getDataHora());
        treino.setCaloriasGastas(caloriasGastas);
        treino.setObservacao(dados.getObservacao());

        Treino treinoAtualizado = treinoRepository.save(treino);

        return converterParaResponse(treinoAtualizado);
    }

 // 2. Na EXCLUSÃO
    @Transactional
    public void excluirTreino(Long id, Long usuarioId) {
        Treino treino = treinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado."));

        // VALIDAÇÃO AQUI
        if (!treino.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para excluir este treino.");
        }

        treinoRepository.delete(treino);
    }

    // MÉTODO AUXILIAR PARA CÁLCULO SEGURO DE CALORIAS
    private BigDecimal calcularCalorias(BigDecimal caloriasPorHora, BigDecimal duracaoMinutos) {
        // Divide por 60 especificando escala 4 e arredondamento HALF_UP
        BigDecimal duracaoHoras = duracaoMinutos.divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP);
        // Multiplica pelas calorias do tipo e arredonda o resultado para 2 casas decimais
        return caloriasPorHora.multiply(duracaoHoras).setScale(2, RoundingMode.HALF_UP);
    }

    // CONVERTER ENTITY PARA RESPONSE DTO
    private TreinoResponseDTO converterParaResponse(Treino treino) {

        return new TreinoResponseDTO(
                treino.getId(),
                treino.getTipoTreino().getId(),
                treino.getTipoTreino().getNome(),
                treino.getDuracao(),
                treino.getDataHora(),
                treino.getCaloriasGastas(),
                treino.getObservacao()
        );
    }
}