package basilium.basiliumserver.service.DTO.shoppingCart;

import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter@Setter
@RequiredArgsConstructor
public  class ShoppingListDTO {

    List<Long> shoppingList;

}
