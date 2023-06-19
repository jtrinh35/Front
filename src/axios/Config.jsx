import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { authContext } from "../context/authProvider";
const Config = () => {
    const {auth, setAuth} = useContext(authContext)
    const Instance = axios.create({
        // baseURL: “https://store-dimo.azurewebsites.net/api/”
        // baseURL: “https://store-dimo-backup.azurewebsites.net/api”
        // baseURL: “http://localhost:3000/api”
        // baseURL: “http://localhost:5000”,
        //baseURL: "https://pikkoback-rabvfmzrtq-od.a.run.app",
        baseURL: "http://localhost:5000",
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${auth}`
        }
    })
    return Instance
};
export default Config;