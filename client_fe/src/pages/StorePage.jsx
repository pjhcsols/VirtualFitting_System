import React from "react";
import Header_Store from "../components/Header_Store";

function StorePage() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/storeDetail');
  }

    return (
        <Header_Store />
    )
}

export default StorePage;