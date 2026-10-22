package com.welltrack.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.welltrack.Enum.Categoria;
import com.welltrack.model.Alimento;

public interface AlimentoRepository extends JpaRepository<Alimento, Long> {
	// 1. Busca por nome no catálogo/dicionário (Paginado)
    Page<Alimento> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    // 2. Busca simples por nome
    List<Alimento> findByNomeContainingIgnoreCase(String nome);

    // 3. Filtrar alimentos pela categoria mapeada no Enum
    Page<Alimento> findByCategoria(Categoria categoria, Pageable pageable);
}
