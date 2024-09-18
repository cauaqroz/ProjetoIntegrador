package br.com.cauaqroz.ConectaPlus.Controller;

import br.com.cauaqroz.ConectaPlus.service.IArquivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/arquivos")
public class ArquivoController {

    @Autowired
    private IArquivoService arquivoService;

    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("projetoId") String projetoId,
                                                   @RequestHeader("userId") String userId) {
        String response = arquivoService.uploadArquivo(file, projetoId, userId);
        return ResponseEntity.status(201).body(response);
    }
}