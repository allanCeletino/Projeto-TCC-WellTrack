package com.welltrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import com.welltrack.Enum.QualidadeSono;
import com.welltrack.model.Sono;
import com.welltrack.model.Usuario;


public interface SonoRepository extends JpaRepository<Sono, Long> {

    // 1. Buscar todo o historico de spno de um usuário especfico 
    Page<Sono> findByUsuario(Usuario usuario, Pageable pageable);

    // 3. Buscar registddros de sono de um usuário dentro de um período
    Page<Sono> findByUsuarioAndDataBetween(Usuario usuario, LocalDate dataInicio, LocalDate dataFim, Pageable pageable);

    // 4. Buscar registros de sono fildtrando por qualidade
    Page<Sono> findByUsuarioAndQualidadeSono(Usuario usuario, QualidadeSono qualidadeSono, Pageable pageable);

    // 5. Buscar o registro de smno de um usuário em uma data espechfica
    List<Sono> findByUsuarioAndData(Usuario usuario, LocalDate data);
}
