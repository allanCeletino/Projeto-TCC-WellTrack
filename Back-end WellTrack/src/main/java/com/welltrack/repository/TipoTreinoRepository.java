package com.welltrack.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.welltrack.model.TipoTreino;

public interface TipoTreinoRepository extends JpaRepository<TipoTreino, Long> {

    // Busca flexível por nome ignorando maiúsculas e minúsculas
    List<TipoTreino> findByNomeContainingIgnoreCase(String nome);

    // Busca exata por nome e calorias por hora
    Page<TipoTreino> findByNomeAndCaloriasPorHora(String nome, BigDecimal caloriasPorHora, Pageable pageable);
}