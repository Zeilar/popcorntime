import axios from "axios";
import { HOST } from "./host";

axios.defaults.baseURL = HOST;

if (typeof axios.defaults.params !== "object") {
    axios.defaults.params = {};
}
