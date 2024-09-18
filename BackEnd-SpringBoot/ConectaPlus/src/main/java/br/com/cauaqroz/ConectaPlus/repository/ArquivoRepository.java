package br.com.cauaqroz.ConectaPlus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.cauaqroz.ConectaPlus.model.Arquivo;

public interface ArquivoRepository extends MongoRepository<Arquivo, String> {
}