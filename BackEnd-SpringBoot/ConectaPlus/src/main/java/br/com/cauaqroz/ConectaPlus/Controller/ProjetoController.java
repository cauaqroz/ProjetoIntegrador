package br.com.cauaqroz.ConectaPlus.Controller;

import br.com.cauaqroz.ConectaPlus.model.Projeto;
import br.com.cauaqroz.ConectaPlus.service.IFileStorageService;
import br.com.cauaqroz.ConectaPlus.service.IProjetoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import org.springframework.util.ReflectionUtils;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {

    @Autowired
    private IProjetoService projetoService;

    @Autowired
    private IFileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Projeto> criarProjeto(@RequestBody Projeto projeto, @RequestHeader("userId") String userId) {
        Projeto createdProjeto = projetoService.criarProjeto(projeto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProjeto);
    }

    @GetMapping
    public ResponseEntity<List<Projeto>> listarProjetos() {
        List<Projeto> projetos = projetoService.listarProjetos();
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/buscarProjetos")
    public ResponseEntity<List<Projeto>> buscarProjetosPorTitulo(@RequestParam String titulo) {
        List<Projeto> projetos = projetoService.buscarProjetosPorTitulo(titulo);
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/UserProjeto")
    public ResponseEntity<List<Projeto>> listarProjetosDoUsuario(@RequestHeader("userId") String userId) {
        List<Projeto> projetos = projetoService.listarProjetosDoUsuario(userId);
        return ResponseEntity.ok(projetos);
    }

    @PostMapping("/{projetoId}/uploadCapa")
public ResponseEntity<?> uploadCapa(@PathVariable String projetoId, @RequestParam("file") MultipartFile file) {
    String fileId = fileStorageService.uploadFile(file);
    Projeto projeto = projetoService.buscarProjetoPorId(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
    projeto.setCapaUrl(fileId);
    projetoService.atualizarProjeto(projeto);
    return ResponseEntity.ok("Capa carregada com sucesso.");
}

@PatchMapping("/{projetoId}")
public ResponseEntity<?> atualizarParcialProjeto(@PathVariable String projetoId, @RequestHeader("ownerId") String ownerId, @RequestBody Map<String, Object> updates) {
    Projeto projeto = projetoService.buscarProjetoPorId(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
    if (!projeto.getCriador().getId().equals(ownerId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para atualizar este projeto.");
    }
    updates.forEach((key, value) -> {
        Field field = ReflectionUtils.findField(Projeto.class, key);
        field.setAccessible(true);
        ReflectionUtils.setField(field, projeto, value);
    });
    projetoService.atualizarProjeto(projeto);
    return ResponseEntity.ok("Projeto atualizado com sucesso.");
}

@PostMapping("/{projetoId}/solicitarParticipacao")
public ResponseEntity<?> solicitarParticipacao(@PathVariable String projetoId, @RequestHeader("userId") String userId) {
    projetoService.solicitarParticipacao(projetoId, userId);
    return ResponseEntity.ok("Solicitação de participação enviada.");
}

    @PostMapping("/{projetoId}/aprovarUsuario")
    public ResponseEntity<?> aprovarUsuario(@PathVariable String projetoId, @RequestHeader("ownerId") String ownerId, @RequestBody Map<String, String> requestBody) {
        projetoService.aprovarUsuario(projetoId, ownerId, requestBody.get("userId"));
        return ResponseEntity.ok("Usuário aprovado com sucesso.");
    }

    @GetMapping("/{projetoId}/pedidosParticipacao")
    public ResponseEntity<List<String>> listarPedidosParticipacao(@PathVariable String projetoId) {
        List<String> pedidos = projetoService.listarPedidosParticipacao(projetoId);
        return ResponseEntity.ok(pedidos);
    }

    @DeleteMapping("/{projetoId}/negarSolicitacao/{userId}")
    public ResponseEntity<?> negarSolicitacao(@PathVariable String projetoId, @PathVariable String userId, @RequestHeader("ownerId") String ownerId) {
        projetoService.negarSolicitacao(projetoId, userId, ownerId);
        return ResponseEntity.ok("Solicitação negada com sucesso.");
    }

    @DeleteMapping("/{projetoId}")
    public ResponseEntity<?> excluirProjeto(@PathVariable String projetoId, @RequestHeader("ownerId") String ownerId) {
        Projeto projeto = projetoService.buscarProjetoPorId(projetoId).orElseThrow(() -> new RuntimeException("Projeto não encontrado."));
        if (!projeto.getCriador().getId().equals(ownerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para excluir este projeto.");
        }
        projetoService.excluirProjeto(projetoId);
        return ResponseEntity.ok("Projeto excluído com sucesso.");
    }

    @GetMapping("/{projetoId}")
    public ResponseEntity<Projeto> exibirProjeto(@PathVariable String projetoId) {
        Projeto projeto = projetoService.buscarProjetoPorId(projetoId).orElse(null);
        if (projeto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projeto);
    }

    @GetMapping("/{projetoId}/capa")
    public ResponseEntity<InputStreamResource> getCapa(@PathVariable String projetoId) {
        Projeto projeto = projetoService.buscarProjetoPorId(projetoId).orElse(null);
        if (projeto == null || projeto.getCapaUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = fileStorageService.downloadFile(projeto.getCapaUrl());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + projeto.getCapaUrl() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(inputStream));
    }

    @GetMapping("/notify/{chatId}")
    public ResponseEntity<Projeto> buscarProjetoPorChatId(@PathVariable String chatId) {
        Projeto projeto = projetoService.buscarProjetoPorChatId(chatId);
        if (projeto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(projeto);
    }
}