import axios from "axios";
import { Config } from '@/config'
import WebApp from '@twa-dev/sdk'

const api = axios.create({
    baseURL: Config.REST_SERVER || `http://localhost:8080/api`,
    headers: {
        "Content-Type": "application/json",
        "Accept": 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'X-Telegram-WebApp-initData': WebApp.initData
    },
});

export default api;