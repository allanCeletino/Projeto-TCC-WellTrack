package com.welltrack.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import com.welltrack.model.TipoTreino;
import com.welltrack.model.Treino;
import com.welltrack.model.Usuario;


public interface TreinoRepository extends JpaRepository<Treino, Long> {

    // 1. Histórico de treinos do usuário paginado filho da puta(ideal para a tela de treinos)
    Page<Treino> findByUsuario(Usuario usuario, Pageable pageable);

    // 2. Buscar treinos de um usuário dentro de um período 
    Page<Treino> findByUsuarioAndDataHoraBetween(
        Usuario usuario, 
        LocalDateTime inicio, 
        LocalDateTime fim, 
        Pageable pageable
    );

    // 3. Filtrar treinos por tipo de treino específico (ex: todos os treinos de "Musculaço" do usuário)
    Page<Treino> findByUsuarioAndTipoTreino(Usuario usuario, TipoTreino tipoTreino, Pageable pageable);

    // 4. Lista simples de treinos em um intervalo de datas
    List<Treino> findByUsuarioAndDataHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fim);
}