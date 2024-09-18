package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Projeto;
import java.util.List;
import java.util.Optional;

public interface IProjetoService {
    Projeto criarProjeto(Projeto projeto, String userId);
    List<Projeto> listarProjetos();
    List<Projeto> buscarProjetosPorTitulo(String titulo);
    List<Projeto> listarProjetosDoUsuario(String userId);
    Optional<Projeto> buscarProjetoPorId(String projetoId);
    void excluirProjeto(String projetoId);
    Projeto buscarProjetoPorChatId(String chatId);
    Projeto atualizarProjeto(Projeto projeto);
    void solicitarParticipacao(String projetoId, String userId);
    List<String> listarPedidosParticipacao(String projetoId);
    void aprovarUsuario(String projetoId, String ownerId, String userId);
    void negarSolicitacao(String projetoId, String userId, String ownerId);
}