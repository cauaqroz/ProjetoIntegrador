package br.com.cauaqroz.ConectaPlus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
public class Projeto {
    @Id
    private String id;
    private String titulo;
    private String descricao;
    private String tecnologia;
    @DBRef
    private User criador;
    private List<String> participationRequests = new ArrayList<>();
    private List<String> approvedParticipants = new ArrayList<>();
    private List<String> arquivos = new ArrayList<>();
    private String chatId;
    private String capaUrl;

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getTecnologia() {
        return tecnologia;
    }
    public void setTecnologia(String tecnologia) {
        this.tecnologia = tecnologia;
    }
    public User getCriador() {
        return criador;
    }
    public void setCriador(User criador) {
        this.criador = criador;
    }
    public List<String> getParticipationRequests() {
        return participationRequests;
    }
    public void setParticipationRequests(List<String> participationRequests) {
        this.participationRequests = participationRequests;
    }
    public List<String> getApprovedParticipants() {
        return approvedParticipants;
    }
    public void setApprovedParticipants(List<String> approvedParticipants) {
        this.approvedParticipants = approvedParticipants;
    }
    public List<String> getArquivos() {
        return arquivos;
    }
    public void setArquivos(List<String> arquivos) {
        this.arquivos = arquivos;
    }
    public String getChatId() {
        return chatId;
    }
    public void setChatId(String chatId) {
        this.chatId = chatId;
    }
    public String getCapaUrl() {
        return capaUrl;
    }
    public void setCapaUrl(String capaUrl) {
        this.capaUrl = capaUrl;
    }
}