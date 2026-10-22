package com.welltrack.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.welltrack.model.Progresso;
import com.welltrack.model.Usuario;


public interface ProgressoRepository extends JpaRepository<Progresso, Long> {

    // 1. Histórico de progresso do usuário paginado e ordenado do mais recente para o mais antigo (Ideal para listas/tabelas)
    Page<Progresso> findByUsuarioOrderByDataRegistroDesc(Usuario usuario, Pageable pageable);

    // 2. Buscar histórico em um intervalo de datas ordenado por data crescente (Ideal para renderizar gráficos de evolução no front-end)
    List<Progresso> findByUsuarioAndDataRegistroBetweenOrderByDataRegistroAsc(
        Usuario usuario, 
        LocalDate dataInicio, 
        LocalDate dataFim
    );

    // 3. Buscar o progresso registrado em uma data exata
    Optional<Progresso> findByUsuarioAndDataRegistro(Usuario usuario, LocalDate dataRegistro);

    // 4. Buscar o registro de progresso mais recente do usuário (para exibir no Deshboard)
    Optional<Progresso> findFirstByUsuarioOrderByDataRegistroDesc(Usuario usuario);
}