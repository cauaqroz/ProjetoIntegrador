package br.com.cauaqroz.ConectaPlus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.cauaqroz.ConectaPlus.model.Freelancer;

public interface FreelancerRepository extends MongoRepository<Freelancer, String> {
}