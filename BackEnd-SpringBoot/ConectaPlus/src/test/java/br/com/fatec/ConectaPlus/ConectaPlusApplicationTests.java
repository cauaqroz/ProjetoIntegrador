package br.com.fatec.ConectaPlus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import br.com.cauaqroz.ConectaPlus.ConectaPlusApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

@SpringBootTest(classes = ConectaPlusApplication.class)
public class ConectaPlusApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Test
    void contextLoads() {
        assertNotNull(context, "O contexto da aplicação não deve ser nulo");
    }
}