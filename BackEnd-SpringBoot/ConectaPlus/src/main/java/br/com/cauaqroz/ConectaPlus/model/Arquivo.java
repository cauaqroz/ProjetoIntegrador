package br.com.cauaqroz.ConectaPlus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Arquivo {
    @Id
    private String id;
    private String nome;
    private String url;
    private String projetoId;

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getProjetoId() {
        return projetoId;
    }
    public void setProjetoId(String projetoId) {
        this.projetoId = projetoId;
    }
}