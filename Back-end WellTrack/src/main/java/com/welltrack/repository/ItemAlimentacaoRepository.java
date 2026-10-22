package com.welltrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.welltrack.model.Alimentacao;
import com.welltrack.model.Alimento;
import com.welltrack.model.ItemAlimentacao;

public interface ItemAlimentacaoRepository extends JpaRepository<ItemAlimentacao, Long> {

    // 1. Buscar todos os itens associados a uma refeição específica
    List<ItemAlimentacao> findByAlimentacao(Alimentacao alimentacao);

    // 2. Buscar itens associados a uma refeição pelo ID da Alimentacao
    List<ItemAlimentacao> findByAlimentacaoId(Long alimentacaoId);

    // 3. Buscar em quais registros um alimento do catálogo foi utilizado (Entidade Alimento)
    List<ItemAlimentacao> findByAlimento(Alimento alimento);

    // 4. Buscar em quais registros um alimento foi utilizado pelo ID do Alimento
    List<ItemAlimentacao> findByAlimentoId(Long alimentoId);
}