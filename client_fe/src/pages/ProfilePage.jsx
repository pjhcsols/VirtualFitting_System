import React, { useState, useEffect } from "react";
import HeaderBottom from "../components/Header_Bottom";
import MypageDetail from "../components/MyPageDetail";
import Delivery from "../components/Delivery";


const ProfilePage = () => {
    return (
        <div>
            <HeaderBottom/>
            <MypageDetail/>
            <Delivery/>
        </div>
    );
}

export default ProfilePage;