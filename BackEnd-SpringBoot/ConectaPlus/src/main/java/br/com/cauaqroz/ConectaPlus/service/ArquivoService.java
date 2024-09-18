package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Arquivo;
import br.com.cauaqroz.ConectaPlus.model.Projeto;
import br.com.cauaqroz.ConectaPlus.repository.ArquivoRepository;
import br.com.cauaqroz.ConectaPlus.repository.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ArquivoService implements IArquivoService {

    @Autowired
    private ArquivoRepository arquivoRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private IFileStorageService fileStorageService;

    @Override
    public String uploadArquivo(MultipartFile file, String projetoId, String userId) {
        Projeto projeto = projetoRepository.findById(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        if (!projeto.getApprovedParticipants().contains(userId)) {
            throw new RuntimeException("Usuário não autorizado");
        }

        String filePath = fileStorageService.uploadFile(file);
        Arquivo arquivo = new Arquivo();
        arquivo.setNome(file.getOriginalFilename());
        arquivo.setUrl(filePath);
        arquivo.setProjetoId(projetoId);
        arquivoRepository.save(arquivo);
        projeto.getArquivos().add(arquivo.getId());
        projetoRepository.save(projeto);
        return "Arquivo carregado com sucesso!";
    }
}