package basilium.basiliumserver.repository.product;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class JpaProductRepository implements ProductRepository{

    private final EntityManager em;
    public JpaProductRepository(EntityManager em) {
        this.em = em;
    }


}
