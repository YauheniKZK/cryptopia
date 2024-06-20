import api from '@/api/api'
import { Config } from '@/config'
import WebApp from '@twa-dev/sdk'


export const createUser = async () => {
    if (WebApp) {
        const url = `${Config.REST_SERVER}/api/create-user`
        const res = await api.get(url)
        console.log('res', res)    
        return res
    }
}
export const getUserService = async () => {
    if (WebApp) {
        const url = `${Config.REST_SERVER}/api/all-users`
        const res = await api.get(url)
        console.log('res', res)    
        return res
    }
}
