package com.welltrack.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.dto.alimentacao.AlimentacaoRequestDTO;
import com.welltrack.dto.alimentacao.AlimentacaoResponseDTO;
import com.welltrack.dto.alimentacao.ItemAlimentacaoRequestDTO;
import com.welltrack.dto.alimentacao.ItemAlimentacaoResponseDTO;
import com.welltrack.dto.alimentacao.ResumoNutricionalDTO;
import com.welltrack.model.Alimentacao;
import com.welltrack.model.Alimento;
import com.welltrack.model.ItemAlimentacao;
import com.welltrack.model.Usuario;
import com.welltrack.repository.AlimentacaoRepository;
import com.welltrack.repository.AlimentoRepository;
import com.welltrack.repository.UsuarioRepository;

@Service
public class AlimentacaoService {

    private final AlimentacaoRepository alimentacaoRepository;
    private final AlimentoRepository alimentoRepository;
    private final UsuarioRepository usuarioRepository;

    public AlimentacaoService(AlimentacaoRepository alimentacaoRepository,
                              AlimentoRepository alimentoRepository,
                              UsuarioRepository usuarioRepository) {
        this.alimentacaoRepository = alimentacaoRepository;
        this.alimentoRepository = alimentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // REGISTRAR REFEIÇÃO COMPLETA
    @Transactional
    public AlimentacaoResponseDTO registrarRefeicao(Long usuarioId, AlimentacaoRequestDTO dados) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Alimentacao alimentacao = new Alimentacao();
        alimentacao.setUsuario(usuario);
        alimentacao.setTipoRefeicao(dados.getTipoRefeicao());
        alimentacao.setDataAlimentacao(dados.getDataAlimentacao());
        alimentacao.setObservacao(dados.getObservacao());

        List<ItemAlimentacao> itensEntidade = new ArrayList<>();

        for (ItemAlimentacaoRequestDTO itemDto : dados.getItens()) {
            Alimento alimento = alimentoRepository.findById(itemDto.getAlimentoId())
                    .orElseThrow(() -> new RuntimeException("Alimento ID " + itemDto.getAlimentoId() + " não encontrado."));

            ItemAlimentacao item = new ItemAlimentacao();
            item.setAlimentacao(alimentacao);
            item.setAlimento(alimento);
            item.setQuantidade(itemDto.getQuantidade());

            itensEntidade.add(item);
        }

        alimentacao.setItens(itensEntidade);
        Alimentacao salva = alimentacaoRepository.save(alimentacao);

        return converterParaResponse(salva);
    }

    // BUSCAR POR ID
    @Transactional(readOnly = true)
    public AlimentacaoResponseDTO buscarPorId(Long id) {
        Alimentacao alimentacao = alimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada."));
        return converterParaResponse(alimentacao);
    }

    @Transactional(readOnly = true)
    public AlimentacaoResponseDTO buscarPorId(Long id, Long usuarioId) {
        Alimentacao a = alimentacaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Refeição não encontrada."));
        if (!a.getUsuario().getId().equals(usuarioId)) throw new RuntimeException("Acesso negado.");
        return converterParaResponse(a);
    }

    // HISTÓRICO PAGINADO
    @Transactional(readOnly = true)
    public Page<AlimentacaoResponseDTO> listarPorUsuarioPaginado(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return alimentacaoRepository.findByUsuario(usuario, pageable)
                .map(this::converterParaResponse);
    }

    // EXCLUIR REFEIÇÃO
    @Transactional
    public void excluirRefeicao(Long id) {
        Alimentacao alimentacao = alimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada."));

        alimentacaoRepository.delete(alimentacao);
    }

    @Transactional
    public void excluirRefeicao(Long id, Long usuarioId) {
        Alimentacao a = alimentacaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Refeição não encontrada."));
        if (!a.getUsuario().getId().equals(usuarioId)) throw new RuntimeException("Acesso negado.");
        alimentacaoRepository.delete(a);
    }

    // CONVERTER E CALCULAR REGRA DE TRÊS DAS CALORIAS
    private AlimentacaoResponseDTO converterParaResponse(Alimentacao alimentacao) {
        BigDecimal totalCalorias = BigDecimal.ZERO;
        List<ItemAlimentacaoResponseDTO> itensResponse = new ArrayList<>();

        for (ItemAlimentacao item : alimentacao.getItens()) {
            // Regra de três: (Calorias100g * GramasConsumidas) / 100
            BigDecimal caloriasItem = item.getAlimento().getCalorias100g()
                    .multiply(item.getQuantidade())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            totalCalorias = totalCalorias.add(caloriasItem);

            itensResponse.add(new ItemAlimentacaoResponseDTO(
                    item.getId(),
                    item.getAlimento().getId(),
                    item.getAlimento().getNome(),
                    item.getQuantidade(),
                    caloriasItem
            ));
        }

        return new AlimentacaoResponseDTO(
                alimentacao.getId(),
                alimentacao.getUsuario().getId(),
                alimentacao.getTipoRefeicao(),
                alimentacao.getDataAlimentacao(),
                alimentacao.getObservacao(),
                itensResponse,
                totalCalorias
        );
    }
    
    
    @Transactional(readOnly = true)
    public ResumoNutricionalDTO obterResumoDiario(Long usuarioId, LocalDate data) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(LocalTime.MAX);

        List<Alimentacao> refeicoes = alimentacaoRepository
                .findByUsuarioAndDataAlimentacaoBetweenOrderByDataAlimentacaoAsc(usuario, inicioDia, fimDia);

        BigDecimal calorias = BigDecimal.ZERO;
        BigDecimal proteinas = BigDecimal.ZERO;
        BigDecimal carboidratos = BigDecimal.ZERO;
        BigDecimal gorduras = BigDecimal.ZERO;
        BigDecimal fibras = BigDecimal.ZERO;

        for (Alimentacao refeicao : refeicoes) {
            for (ItemAlimentacao item : refeicao.getItens()) {
                BigDecimal proporcao = item.getQuantidade().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                Alimento a = item.getAlimento();

                calorias = calorias.add(a.getCalorias100g().multiply(proporcao));
                proteinas = proteinas.add(a.getProteinas100g().multiply(proporcao));
                carboidratos = carboidratos.add(a.getCarboidratos100g().multiply(proporcao));
                gorduras = gorduras.add(a.getGorduras100g().multiply(proporcao));
                if (a.getFibras100g() != null) {
                    fibras = fibras.add(a.getFibras100g().multiply(proporcao));
                }
            }
        }

        return new ResumoNutricionalDTO(
                data,
                calorias.setScale(2, RoundingMode.HALF_UP),
                proteinas.setScale(2, RoundingMode.HALF_UP),
                carboidratos.setScale(2, RoundingMode.HALF_UP),
                gorduras.setScale(2, RoundingMode.HALF_UP),
                fibras.setScale(2, RoundingMode.HALF_UP)
        );
    }
    
}