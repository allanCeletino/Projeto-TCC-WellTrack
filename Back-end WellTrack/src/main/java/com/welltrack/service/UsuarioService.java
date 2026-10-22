package com.welltrack.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.welltrack.Enum.Acesso;
import com.welltrack.Enum.Status;
import com.welltrack.dto.usuario.UsuarioCreateRequestDTO;
import com.welltrack.dto.usuario.UsuarioUpdateRequestDTO;
import com.welltrack.dto.usuario.UsuarioResponseDTO;
import com.welltrack.model.Usuario;
import com.welltrack.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // CADASTRAR USUÁRIO - Usa o UsuarioCreateRequestDTO (senha obrigatória)
    @Transactional
    public UsuarioResponseDTO cadastrarUsuario(UsuarioCreateRequestDTO dados) {

        if (repository.findByEmail(dados.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com esse e-mail.");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setIdade(dados.getIdade());
        usuario.setPeso(dados.getPeso());
        usuario.setAltura(dados.getAltura());

        // Criptografa a senha antes de salvar
        usuario.setSenha(encoder.encode(dados.getSenha()));

        // Valores definidos pelo sistema
        usuario.setAcesso(Acesso.USUARIO);
        usuario.setStatus(Status.ATIVO);

        Usuario usuarioSalvo = repository.save(usuario);

        return converterParaResponse(usuarioSalvo);
    }

    // BUSCAR USUÁRIO POR ID
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        return converterParaResponse(usuario);
    }

    // BUSCAR USUÁRIO POR E-MAIL
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorEmail(String email) {

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        return converterParaResponse(usuario);
    }

    // LISTAR TODOS OS USUÁRIOS
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {

        List<Usuario> usuarios = repository.findAll();

        return usuarios.stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // ATUALIZAR USUÁRIO - Usa o UsuarioUpdateRequestDTO (senha opcional)
    @Transactional
    public UsuarioResponseDTO atualizarUsuario(Long id, UsuarioUpdateRequestDTO dados) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        if (!usuario.getEmail().equalsIgnoreCase(dados.getEmail())
                && repository.findByEmail(dados.getEmail()).isPresent()) {

            throw new RuntimeException("Já existe um usuário com esse e-mail.");
        }

        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setIdade(dados.getIdade());
        usuario.setPeso(dados.getPeso());
        usuario.setAltura(dados.getAltura());

        // Atualiza a senha SOMENTE se ela tiver sido preenchida no DTO
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            usuario.setSenha(encoder.encode(dados.getSenha()));
        }

        Usuario usuarioAtualizado = repository.save(usuario);

        return converterParaResponse(usuarioAtualizado);
    }

    // INATIVAR USUÁRIO
    @Transactional
    public UsuarioResponseDTO inativarUsuario(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        usuario.setStatus(Status.INATIVO);

        Usuario usuarioAtualizado = repository.save(usuario);

        return converterParaResponse(usuarioAtualizado);
    }

    // CONVERTER ENTITY PARA RESPONSE DTO
    private UsuarioResponseDTO converterParaResponse(Usuario usuario) {

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getIdade(),
                usuario.getPeso(),
                usuario.getAltura(),
                usuario.getAcesso(),
                usuario.getStatus()
        );
    }
}