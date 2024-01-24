import { defineStore } from 'pinia'

export const useEntrainementStore = defineStore({
  id: 'entrainement',
  state: () => ({
    urlApi: 'entrainement.json',
    status: false,
    entrainement: [],
    semaine: 1,
    jours: 1,
    time: null,
    etapeIndex: 0
  }),

  getters: {},

  actions: {
    async listEntrainement() {
      try {
        const res = await fetch(this.urlApi)
        const data = await res.json()
        this.entrainement = data.activities
        this.initFromLocalStorage()
      } catch (error) {
        console.error(error)
      }
    },

    startTraining() {
      if (this.entrainement.length === 0) {
        console.error("Aucune donnée d'entraînement disponible.")
        return
      }

      this.status = true
      this.time = null

      const firstStep = this.getCurrentStep()
      this.time = firstStep.time

      // Ajoutez cette condition pour ne pas augmenter etapeIndex si déjà à 1
      if (this.etapeIndex !== 0) {
        this.etapeIndex = 0
      }
      this.startTimer(firstStep.time)
    },

    startTimer(time) {
      setTimeout(() => {
        this.completeStep()

        if (this.nextStep()) {
          const currentStep = this.getCurrentStep()
          this.time = currentStep.time

          this.startTimer(currentStep.time)
        } else {
          this.status = false
        }
      }, time * 1000)
    },

    saveWeekAndDay() {
      const semaineIndex = this.semaine
      const joursIndex = this.jours
      const etapeIndex = this.etapeIndex

      localStorage.setItem('week', semaineIndex)
      localStorage.setItem('day', joursIndex)
      localStorage.setItem('etapeIndex', etapeIndex)
    },

    initFromLocalStorage() {
      const savedWeek = localStorage.getItem('week')
      const savedDay = localStorage.getItem('day')
      const savedEtapeIndex = localStorage.getItem('etapeIndex')

      if (savedWeek && savedDay && savedEtapeIndex) {
        this.semaine = parseInt(savedWeek)
        this.jours = parseInt(savedDay)
        this.etapeIndex = parseInt(savedEtapeIndex)
      }
    },

    nextStep() {
      const etapeIndex = this.etapeIndex
      const joursIndex = this.jours - 1

      if (!this.entrainement[0].semaines[this.semaine - 1].jours[joursIndex].status) {
        if (
          etapeIndex <
          this.entrainement[0].semaines[this.semaine - 1].jours[joursIndex].etapes.length - 1
        ) {
          this.etapeIndex = etapeIndex + 1
          return true
        } else {
          this.etapeIndex = 0
        }
      }
    },

    nextDay() {
      this.etapeIndex = 0

      if (this.status) {
        const joursIndex = this.jours - 1

        if (joursIndex < this.entrainement[0].semaines[this.semaine - 1].jours.length - 1) {
          this.jours = this.jours + 1
          return true
        } else {
          this.jours = 1
          return this.nextWeek()
        }
      } else {
        return false
      }
    },

    nextWeek() {
      const semaineIndex = this.semaine - 1

      if (semaineIndex < this.entrainement[0].semaines.length - 1) {
        this.semaine = this.semaine + 1
        return true
      } else {
        return false
      }
    },

    checkTrainingCompletion() {
      const { entrainement, semaine, jours } = this

      const currentWeek = entrainement[0].semaines[semaine - 1]
      if (!currentWeek || !currentWeek.jours[jours - 1]) {
        // La semaine ou le jour n'existe pas, vous pouvez gérer cela selon vos besoins
        return
      }

      const allStepsComplete = currentWeek.jours[jours - 1].etapes.every((step) => step.status)

      if (allStepsComplete) {
        currentWeek.status = true // Marquer la semaine comme terminée

        const allWeeksComplete = entrainement[0].semaines.every((week) => week.status)

        // Toutes les semaines sont terminées et la saison n'est pas encore marquée comme terminée
        if (allWeeksComplete && !entrainement[0].status) {
          // Marquer la saison comme terminée
          entrainement[0].status = true
          alert('Félicitations ! Vous avez terminé tous les entraînements de la saison.')
        }
      }
    },

    completeStep() {
      const semaineIndex = this.semaine - 1
      const joursIndex = this.jours - 1
      const etapeIndex = this.etapeIndex

      this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes[etapeIndex].status = true

      if (
        etapeIndex ===
        this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes.length - 1
      ) {
        this.entrainement[0].semaines[semaineIndex].jours[joursIndex].status = true
        this.saveWeekAndDay()

        // Appel de la méthode pour vérifier si toutes les semaines sont terminées
        this.checkTrainingCompletion()
      }
    },

    getCurrentStep() {
      const semaineIndex = this.semaine - 1
      const joursIndex = this.jours - 1
      const etapeIndex = this.etapeIndex

      return this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes[etapeIndex]
    },

    resetTraining() {
      this.status = false
      this.semaine = 1
      this.jours = 1
      this.time = null
      this.etapeIndex = 0
      this.saveWeekAndDay()

      setTimeout(() => {
        window.location.reload()
      }, 100)
    },

    resetDay() {
      this.status = false
      this.time = null
      this.etapeIndex = 0

      // Mettez à false le statut du jour actuel
      const semaineIndex = this.semaine - 1
      const joursIndex = this.jours - 1
      this.entrainement[0].semaines[semaineIndex].jours[joursIndex].status = false

      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }
})
