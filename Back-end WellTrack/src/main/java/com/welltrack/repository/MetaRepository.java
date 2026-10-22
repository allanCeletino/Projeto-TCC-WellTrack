package com.welltrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.welltrack.Enum.StatusMeta;
import com.welltrack.model.Meta;
import com.welltrack.model.Usuario;

public interface MetaRepository extends JpaRepository<Meta, Long>{

	// 1. Mostrar todas as metas de um usuário específico (Paginado para a tela)
    Page<Meta> findByUsuario(Usuario usuario, Pageable pageable);

    // 1.1 Lista simples de todas as metas de um usuário
    List<Meta> findByUsuario(Usuario usuario);

    // 2. Mostrar metas de um usuário que iniciam em um determinado período
    List<Meta> findByUsuarioAndDataInicioBetweenOrderByDataInicioAsc(
        Usuario usuario, 
        LocalDate dataInicio, 
        LocalDate dataFim
    );

 // 3. Filtrar metas de um usuário por Status (ex: apenas as metas EM_ANDAMENTO do usuário)
    List<Meta> findByUsuarioAndStatus(Usuario usuario, StatusMeta status);
}
