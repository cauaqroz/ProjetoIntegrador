package br.com.cauaqroz.ConectaPlus.Controller;

import br.com.cauaqroz.ConectaPlus.model.User;
import br.com.cauaqroz.ConectaPlus.model.Freelancer;
import br.com.cauaqroz.ConectaPlus.model.Friendship;
import br.com.cauaqroz.ConectaPlus.model.Projeto;
import br.com.cauaqroz.ConectaPlus.service.IUserService;
import br.com.cauaqroz.ConectaPlus.service.IFreelancerService;
import br.com.cauaqroz.ConectaPlus.repository.ProjetoRepository;
import br.com.cauaqroz.ConectaPlus.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @Autowired
    private IFreelancerService freelancerService;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private FileStorageService fileStorageService;

    

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User userDto) {
        try {
            return ResponseEntity.ok("Usuário cadastrado com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
    
        User user = userOpt.get();
        Optional<Freelancer> freelancerOpt = freelancerService.getFreelancerById(user.getId());
    
        List<Projeto> projetosCriados = projetoRepository.findByCriador_Id(user.getId());
    
        List<Projeto> projetosParticipando = projetoRepository.findAll().stream()
                .filter(projeto -> projeto.getApprovedParticipants().contains(user.getId()))
                .collect(Collectors.toList());
    
            
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("registrationDate", user.getRegistrationDate());
        result.put("name", user.getName());
        result.put("lastName", user.getLastName());
        result.put("email", user.getEmail());
        result.put("country", user.getCountry());
        result.put("state", user.getState());
        result.put("avatar", user.getAvatar());
        result.put("friends", user.getFriends());
        result.put("projetosCriados", projetosCriados);
        result.put("projetosParticipando", projetosParticipando);
    
        freelancerOpt.ifPresent(freelancer -> {
            result.put("description", freelancer.getDescription());
            result.put("portfolio", freelancer.getPortfolio());
            result.put("education", freelancer.getEducation());
            result.put("areaOfExpertise", freelancer.getAreaOfExpertise());
        });
    
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        User user = userOptional.get();

        List<Projeto> projetosCriados = projetoRepository.findByCriador_Id(user.getId());

        List<Projeto> projetosParticipando = projetoRepository.findAll().stream()
                .filter(projeto -> projeto.getApprovedParticipants().contains(user.getId()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("country", user.getCountry());
        response.put("state", user.getState());
        response.put("projetosCriados", projetosCriados);
        response.put("projetosParticipando", projetosParticipando);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update")
    public ResponseEntity<?> patchUserById(@RequestHeader("userId") String userId, @RequestBody Map<String, Object> updates) {
        try {
            userService.updateUser(userId, updates);
            return ResponseEntity.ok("Usuário atualizado com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUserById(@RequestHeader("userId") String userId) {
        return userService.getUserById(userId).map(user -> {
            freelancerService.deleteFreelancerById(user.getId());
            userService.deleteUserById(userId);
            return ResponseEntity.ok("Usuário deletado com sucesso.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado."));
    }


    @PostMapping("/uploadAvatar")
    public ResponseEntity<?> uploadAvatar(@RequestHeader("userId") String userId, @RequestParam("file") MultipartFile file) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        String avatarUrl = fileStorageService.uploadFile(file);
        userService.uploadAvatar(userId, avatarUrl);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Avatar atualizado com sucesso.");
        response.put("avatarId", avatarUrl);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/avatar/{avatarId}")
    public ResponseEntity<InputStreamResource> getAvatar(@PathVariable("avatarId") String avatarId) {
        try {
            InputStream inputStream = fileStorageService.downloadFile(avatarId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + avatarId + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(inputStream));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestHeader("userId") String userId, @RequestBody Map<String, String> requestBody) {
        String friendId = requestBody.get("friendId");

        try {
            userService.addFriend(userId, friendId);
            return ResponseEntity.ok().body("Amigo adicionado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestHeader("userId") String userId, @RequestBody Map<String, String> requestBody) {
        String friendId = requestBody.get("friendId");

        try {
            userService.removeFriend(userId, friendId);
            return ResponseEntity.ok().body("Amigo removido com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginDetails) {
        try {
            String token = userService.loginUser(loginDetails);
            Optional<User> userOpt = userService.getUserByEmail(loginDetails.getEmail());
            User user = userOpt.get();

            List<Projeto> projetosCriados = projetoRepository.findByCriador_Id(user.getId());

            List<Projeto> projetosParticipando = projetoRepository.findAll().stream()
                    .filter(projeto -> projeto.getApprovedParticipants().contains(user.getId()))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("country", user.getCountry());
            response.put("state", user.getState());
            response.put("projetosCriados", projetosCriados);
            response.put("projetosParticipando", projetosParticipando);
            response.put("token", token);
            response.put("avatar", user.getAvatar());
            response.put("friends", user.getFriends());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.findAll();
    return ResponseEntity.ok(users);
}

@GetMapping("/search")
public ResponseEntity<List<User>> searchUsersByName(@RequestParam String name) {
    List<User> users = userService.searchUsersByName(name);
    return ResponseEntity.ok(users);
}

}