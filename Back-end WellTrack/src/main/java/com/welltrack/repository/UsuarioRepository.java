package com.welltrack.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.welltrack.Enum.Status;
import com.welltrack.model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    //status, acesso senha altura peso idade email nome
	
	
    Optional<Usuario> findByEmail(String email);
    
    //lista de usuarioativo e ativo para acesso de adm
    List<Usuario> findByStatus(Status status);
    

    Optional<Usuario> findBySenha(String senha);
}
