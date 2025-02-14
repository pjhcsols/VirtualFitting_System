import axios from 'axios';
import { UserData } from '../types/delivery';

export const fetchUserData = async (jwtToken: string): Promise<UserData> => {
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}` // Add the JWT token to the header
        }
    };

    try {
        const response = await axios.get("http://155.230.43.12:8090/normalUser/user/detail", config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow the error for higher-level handling
    }
};
