package br.com.cauaqroz.ConectaPlus.Controller;

import br.com.cauaqroz.ConectaPlus.dto.FreelancerDTO;
import br.com.cauaqroz.ConectaPlus.model.Freelancer;
import br.com.cauaqroz.ConectaPlus.service.IFreelancerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/freelancers")
public class FreelancerController {

    @Autowired
    private IFreelancerService freelancerService;

    @PostMapping
    public ResponseEntity<?> createFreelancer(@RequestBody Freelancer freelancerDto) {
        Freelancer freelancer = freelancerService.createFreelancer(freelancerDto);
        return ResponseEntity.ok("Freelancer cadastrado com sucesso.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFreelancerById(@PathVariable String id) {
        Optional<Freelancer> freelancerOptional = freelancerService.getFreelancerById(id);
        if (!freelancerOptional.isPresent()) {
            return ResponseEntity.status(404).body("Freelancer não encontrado.");
        }
        Freelancer freelancer = freelancerOptional.get();
        FreelancerDTO freelancerDTO = new FreelancerDTO();
        freelancerDTO.setDescription(freelancer.getDescription());
        freelancerDTO.setPortfolio(freelancer.getPortfolio());
        freelancerDTO.setAreaOfExpertise(freelancer.getAreaOfExpertise());
        freelancerDTO.setEducation(freelancer.getEducation());
        freelancerDTO.setCompletedJobs(freelancer.getCompletedJobs());
        freelancerDTO.setOnTimeDeliveries(freelancer.getOnTimeDeliveries());
        return ResponseEntity.ok(freelancerDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFreelancerById(@RequestHeader("userId") String userId) {
        freelancerService.deleteFreelancerById(userId);
        return ResponseEntity.ok("Freelancer deletado com sucesso.");
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateFreelancer(@RequestHeader("userId") String userId, @RequestBody Map<String, Object> updates) {
        freelancerService.updateFreelancer(userId, updates);
        return ResponseEntity.ok("Freelancer atualizado com sucesso.");
    }
}