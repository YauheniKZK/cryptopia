import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getUserService, createUser, activatedUser } from '@/services/tap.service'

export const useAppStore = defineStore('app', () => {

  async function actionCreateUser() {
    const res = await createUser()
    console.log('res', res)
  }

  async function actionActivatedUser() {
    const res = await activatedUser()
    console.log('res', res)
  }

  async function getUser() {
    const res = await getUserService()
    console.log('res', res)
  }

  return { getUser, actionCreateUser, actionActivatedUser }
})
