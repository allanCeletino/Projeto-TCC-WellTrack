package com.welltrack.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.welltrack.dto.alimentacao.ItemAlimentacaoResponseDTO;
import com.welltrack.model.Alimentacao;
import com.welltrack.model.Alimento;
import com.welltrack.model.ItemAlimentacao;
import com.welltrack.repository.AlimentacaoRepository;
import com.welltrack.repository.AlimentoRepository;
import com.welltrack.repository.ItemAlimentacaoRepository;

@RestController
@RequestMapping("/api/itens-alimentacao")
@CrossOrigin(origins = "*")
public class ItemAlimentacaoController {
    private final ItemAlimentacaoRepository itemRepository;
    private final AlimentacaoRepository alimentacaoRepository;
    private final AlimentoRepository alimentoRepository;

    public ItemAlimentacaoController(ItemAlimentacaoRepository itemRepository,
                                     AlimentacaoRepository alimentacaoRepository,
                                     AlimentoRepository alimentoRepository) {
        this.itemRepository = itemRepository;
        this.alimentacaoRepository = alimentacaoRepository;
        this.alimentoRepository = alimentoRepository;
    }

    @GetMapping("/refeicao/{alimentacaoId}")
    public ResponseEntity<List<ItemAlimentacaoResponseDTO>> buscarPorRefeicaoId(@PathVariable Long alimentacaoId) {
        Alimentacao alimentacao = alimentacaoRepository.findById(alimentacaoId)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada."));
        return ResponseEntity.ok(itemRepository.findByAlimentacao(alimentacao).stream()
                .map(this::toDto).toList());
    }

    @GetMapping("/alimento/{alimentoId}")
    public ResponseEntity<List<ItemAlimentacaoResponseDTO>> buscarPorAlimentoId(@PathVariable Long alimentoId) {
        Alimento alimento = alimentoRepository.findById(alimentoId)
                .orElseThrow(() -> new RuntimeException("Alimento não encontrado no catálogo."));
        return ResponseEntity.ok(itemRepository.findByAlimento(alimento).stream()
                .map(this::toDto).toList());
    }

    private ItemAlimentacaoResponseDTO toDto(ItemAlimentacao item) {
        BigDecimal calorias = item.getAlimento().getCalorias100g()
                .multiply(item.getQuantidade())
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        return new ItemAlimentacaoResponseDTO(item.getId(), item.getAlimento().getId(),
                item.getAlimento().getNome(), item.getQuantidade(), calorias);
    }
}
