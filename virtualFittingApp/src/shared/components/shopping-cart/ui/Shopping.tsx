import React, { useState, useEffect } from "react";
import { Payment } from "@/shared/components/payment";
import type { ShoppingCartProps } from "@/shared/components/shopping-cart/types/shoppingCartProps";
import {
  fetchUserInfo,
  deleteItemFromCart,
} from "@/shared/components/shopping-cart/api/shoppingCart.action";
import type { User } from "@/shared/types/user/user";

import styled from "styled-components";

function Shopping() {

  return (
    <Wrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px 0px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

export { Shopping };
