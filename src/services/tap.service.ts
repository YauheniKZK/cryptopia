import api from '@/api/api'
import { Config } from '@/config'
import WebApp from '@twa-dev/sdk'

export const getUserService = async () => {
    if (WebApp) {
        const url = `${Config.REST_SERVER}/api/all-users`
        const res = await api.get(url)
        console.log('res', res)    
        return res
    }
}
