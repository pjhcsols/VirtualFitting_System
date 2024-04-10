package basilium.basiliumserver.domain.product;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "category_sequence", sequenceName = "CATEGORY_SEQUENCE", allocationSize = 1)
    @Column(name = "category_id", nullable = false, columnDefinition = "int")
    Long categoryId;

    @Column(name="category_Name", nullable = false)
    String categoryName;
}
