import axios from "axios";

export const handleCheckBusinessRegistration = async (req) => {
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.REACT_APP_BUSINESSREGISTRATION_API_KEY}`;
    const { data } = await axios.post(url, {
        b_no: [req],
    });
    
    return data.data[0].b_stt_cd;
}   