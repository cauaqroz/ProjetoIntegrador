package br.com.cauaqroz.ConectaPlus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import br.com.cauaqroz.ConectaPlus.model.Projeto;
import java.util.List;

public interface ProjetoRepository extends MongoRepository<Projeto, String> {
    List<Projeto> findByCriador_Id(String criadorId);

    @Query("{ 'titulo': { $regex: ?0, $options: 'i' } }")
    List<Projeto> findByTituloContaining(String titulo);

    Projeto findByChatId(String chatId);
}