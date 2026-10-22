package com.welltrack.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import com.welltrack.Enum.TipoRefeicao;
import com.welltrack.model.Alimentacao;
import com.welltrack.model.Usuario;


public interface AlimentacaoRepository extends JpaRepository<Alimentacao, Long> {

    // 1. Histórico de refeições do usuário (Paginado, ideal para tela de histórico)
    Page<Alimentacao> findByUsuario(Usuario usuario, Pageable pageable);

    // 2. Buscar todas as refeições de um usuário em um intervalo de data e hora (Essencial para calcular os macros do dianu  Service)
    List<Alimentacao> findByUsuarioAndDataAlimentacaoBetweenOrderByDataAlimentacaoAsc(
        Usuario usuario, 
        LocalDateTime inicio, 
        LocalDateTime fim
    );

    // 3. Filtrar refeições do usuário por tipo (ex: listar todos os JANTAR do usuário)
    Page<Alimentacao> findByUsuarioAndTipoRefeicao(
        Usuario usuario, 
        TipoRefeicao tipoRefeicao, 
        Pageable pageable
    );

    // 4. Buscar histórico de refeições ordenado da mais recente para a mais antiga
    List<Alimentacao> findByUsuarioOrderByDataAlimentacaoDesc(Usuario usuario);
}