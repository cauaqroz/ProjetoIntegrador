package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Channel;
import br.com.cauaqroz.ConectaPlus.model.Projeto;
import br.com.cauaqroz.ConectaPlus.model.User;
import br.com.cauaqroz.ConectaPlus.repository.ChannelRepository;
import br.com.cauaqroz.ConectaPlus.repository.ProjetoRepository;
import br.com.cauaqroz.ConectaPlus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjetoService implements IProjetoService {

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChannelRepository channelRepository;


        @Override
    public Projeto criarProjeto(Projeto projeto, String userId) {
        User criador = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        projeto.setCriador(criador);

        Channel channel = new Channel();
        channel.setMasterUserId(userId);
        channel.setAllowedUserIds(new ArrayList<>(Collections.singletonList(userId)));
        channel.setAccessRequests(new ArrayList<>());
        channel.setMessages(new ArrayList<>());

        // Verifica se a lista de participantes aprovados não é nula antes de processar
        if (projeto.getApprovedParticipants() != null) {
            List<String> approvedUserIds = projeto.getApprovedParticipants().stream()
                .map(user -> {
                    User userObj = userRepository.findById(user).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
                    return userObj.getId();
                })
                .collect(Collectors.toList());
            channel.getAllowedUserIds().addAll(approvedUserIds);
        }

        channel = channelRepository.save(channel);
        projeto.setChatId(channel.getId());
        return projetoRepository.save(projeto);
    }

    @Override
    public List<Projeto> listarProjetos() {
        return projetoRepository.findAll();
    }

    @Override
    public List<Projeto> buscarProjetosPorTitulo(String titulo) {
        return projetoRepository.findByTituloContaining(titulo);
    }

    @Override
    public List<Projeto> listarProjetosDoUsuario(String userId) {
        return projetoRepository.findByCriador_Id(userId);
    }

    @Override
    public Optional<Projeto> buscarProjetoPorId(String projetoId) {
        return projetoRepository.findById(projetoId);
    }

    @Override
    public void excluirProjeto(String projetoId) {
        projetoRepository.deleteById(projetoId);
    }

    @Override
    public Projeto buscarProjetoPorChatId(String chatId) {
        return projetoRepository.findByChatId(chatId);
    }

    @Override
    public Projeto atualizarProjeto(Projeto projeto) {
        return projetoRepository.save(projeto);
    }

    @Override
    public void solicitarParticipacao(String projetoId, String userId) {
        Projeto projeto = projetoRepository.findById(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
        if (projeto.getParticipationRequests().contains(userId)) {
            throw new RuntimeException("Solicitação de participação já enviada.");
        }
        projeto.getParticipationRequests().add(userId);
        projetoRepository.save(projeto);
    }

    @Override
public void aprovarUsuario(String projetoId, String ownerId, String userId) {
    Projeto projeto = projetoRepository.findById(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
    if (!projeto.getCriador().getId().equals(ownerId)) {
        throw new RuntimeException("Apenas o proprietário do projeto pode aprovar usuários.");
    }

    Channel channel = channelRepository.findById(projeto.getChatId()).orElseThrow(() -> new RuntimeException("Canal não encontrado."));

    if (channel.getAllowedUserIds() == null) {
        channel.setAllowedUserIds(new ArrayList<>());
    }

    if (!projeto.getParticipationRequests().remove(userId)) {
        throw new RuntimeException("Solicitação de participação não encontrada.");
    }

    projeto.getApprovedParticipants().add(userId);
    channel.getAllowedUserIds().add(userId);

    projetoRepository.save(projeto);
    channelRepository.save(channel);
}

    @Override
    public List<String> listarPedidosParticipacao(String projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
        return projeto.getParticipationRequests();
    }

    @Override
    public void negarSolicitacao(String projetoId, String userId, String ownerId) {
        Projeto projeto = projetoRepository.findById(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
        if (!projeto.getCriador().getId().equals(ownerId)) {
            throw new RuntimeException("Apenas o proprietário do projeto pode negar solicitações.");
        }
        if (!projeto.getParticipationRequests().remove(userId)) {
            throw new RuntimeException("Solicitação de participação não encontrada.");
        }
        projetoRepository.save(projeto);
    }
}