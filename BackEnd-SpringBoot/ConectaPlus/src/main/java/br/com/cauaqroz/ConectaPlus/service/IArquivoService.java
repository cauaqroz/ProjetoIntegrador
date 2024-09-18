package br.com.cauaqroz.ConectaPlus.service;

import org.springframework.web.multipart.MultipartFile;

public interface IArquivoService {
    String uploadArquivo(MultipartFile file, String projetoId, String userId);
}