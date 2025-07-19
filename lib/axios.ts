
import { getUser } from "@/actions/auth.actions";
import { auth } from "@/auth";
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5643/api/v1"}`// process.env.API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let access_token: string = '';
    const isServer = typeof window === 'undefined'
    if (isServer) {
      const userObj = await auth();
      const user = userObj?.user
      if (user) {
        access_token = user?.token  || ''
      }
    } else {
      if(typeof localStorage !== 'undefined'){
        const user = await getUser()
        access_token = user?.user?.token || ''
      }
    }
   
    if (access_token) {
      if (!config.headers["authorization"]) {
        config.headers.authorization = `${access_token}`;
      } else {
        config.headers.authorization = `${access_token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    console.log('axios error:', error);
    console.log("Axios Response : ",error.response)
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
