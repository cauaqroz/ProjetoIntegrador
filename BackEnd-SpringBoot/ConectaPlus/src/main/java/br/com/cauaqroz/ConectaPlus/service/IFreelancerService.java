package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Freelancer;
import java.util.Optional;
import java.util.Map;

public interface IFreelancerService {
    Freelancer createFreelancer(Freelancer freelancerDto);
    Optional<Freelancer> getFreelancerById(String id);
    void deleteFreelancerById(String id);
    void updateFreelancer(String userId, Map<String, Object> updates);
}