package basilium.basiliumserver.domain.shoppingCart;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter@Setter
@RequiredArgsConstructor
public  class ShoppingListDTO {

    List<Long> shoppingList;

}