package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Freelancer;
import br.com.cauaqroz.ConectaPlus.repository.FreelancerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class FreelancerService implements IFreelancerService {

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Override
    public Freelancer createFreelancer(Freelancer freelancerDto) {
        return freelancerRepository.save(freelancerDto);
    }

    @Override
    public Optional<Freelancer> getFreelancerById(String id) {
        return freelancerRepository.findById(id);
    }

    @Override
    public void deleteFreelancerById(String id) {
        freelancerRepository.deleteById(id);
    }

    @Override
    public void updateFreelancer(String userId, Map<String, Object> updates) {
        freelancerRepository.findById(userId).ifPresent(freelancer -> {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "description":
                        freelancer.setDescription((String) value);
                        break;
                    case "portfolio":
                        freelancer.setPortfolio((String) value);
                        break;
                    case "education":
                        freelancer.setEducation((String) value);
                        break;
                    case "areaOfExpertise":
                        freelancer.setAreaOfExpertise((String) value);
                        break;
                    case "completedJobs":
                        freelancer.setCompletedJobs((Integer) value);
                        break;
                    case "onTimeDeliveries":
                        freelancer.setOnTimeDeliveries((Integer) value);
                        break;
                    default:
                        break;
                }
            });
            freelancerRepository.save(freelancer);
        });
    }
}