import axios from "axios";

const useEdenredConfig = () => {
  const Instance = axios.create({
    // baseURL: “https://store-dimo.azurewebsites.net/api/”
    // baseURL: “https://store-dimo-backup.azurewebsites.net/api”
    // baseURL: “http://localhost:3000/api”
    //baseURL: "https://pikkoback-rabvfmzrtq-od.a.run.app",
    baseURL: "http://localhost:5000", 
    withCredentials: true
    
  });
  return Instance;
};
export default useEdenredConfig;
