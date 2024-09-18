package br.com.cauaqroz.ConectaPlus.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

public interface IFileStorageService {
    String uploadFile(MultipartFile file);
    InputStream downloadFile(String fileId);
}