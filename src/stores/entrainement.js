import { defineStore } from 'pinia'

export const useEntrainementStore = defineStore({
  id: 'entrainement',
  state: () => ({
    urlApi: 'entrainement.json',
    status: false,
    entrainement: []
  }), //fin du state

  getters: {}, //fin du getter

  actions: {
    async listEntrainement() {
      try {
        const res = await fetch(this.urlApi)
        const data = await res.json()
        console.log('JSON :', data.activities[0])
        // Mise à jour du state avec les données d'entraînement
        this.setEntrainement(data.activities)
      } catch (error) {
        console.error(error)
      }
    }, // fin de listEntrainement

    //mettre à jour le tableau d'entraînement
    setEntrainement(data) {
      this.entrainement = data
    },

    //mettre à jour le statut
    setStatus(status) {
      this.status = status
      // localStorage.setItem('status', JSON.stringify(status))
    }
  } // fin d'action
})
