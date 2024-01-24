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
        // console.log('JSON :', data.activities[0])
        this.setEntrainement(data.activities)
        this.initFromLocalStorage()
      } catch (error) {
        console.error(error)
      }
    },

    setEntrainement(data) {
      this.entrainement = data
      this.setSemaine(1)
      this.setJours(1)
      this.setTime(null)
      this.setEtapeIndex(0)
    },

    // ----- lancement de mon entrainement ----- //
    startTraining() {
      if (this.entrainement.length === 0) {
        console.error("Aucune donnée d'entraînement disponible.")
        return
      }

      this.setStatus(true)
      this.setTime(null)

      const firstStep = this.getCurrentStep()
      this.setTime(firstStep.time)

      this.startTimer(firstStep.time)
    },
    // ----- gestion du chronomètre pendant l'entraînement ----- //
    startTimer(time) {
      setTimeout(() => {
        this.completeStep()

        if (this.nextStep()) {
          console.log('After nextStep:', this.getEtapeIndex())
          const currentStep = this.getCurrentStep()
          this.setTime(currentStep.time)

          this.startTimer(currentStep.time)
        } else {
          console.log('After nextStep (end):', this.getEtapeIndex())
          this.setStatus(false)
        }
      }, time * 1000)
    },

    // ----- Localstorage de mes jours et semaines ----- //
    saveWeekAndDay() {
      const semaineIndex = this.semaine
      const joursIndex = this.jours
      const etapeIndex = this.getEtapeIndex()

      console.log('Saving values:', semaineIndex, joursIndex, etapeIndex)

      localStorage.setItem('week', semaineIndex)
      localStorage.setItem('day', joursIndex)
      localStorage.setItem('etapeIndex', etapeIndex)
    },

    initFromLocalStorage() {
      const savedWeek = localStorage.getItem('week')
      const savedDay = localStorage.getItem('day')
      const savedEtapeIndex = localStorage.getItem('etapeIndex')

      if (savedWeek && savedDay && savedEtapeIndex) {
        this.setSemaine(parseInt(savedWeek))
        this.setJours(parseInt(savedDay))
        this.setEtapeIndex(parseInt(savedEtapeIndex)) // Soustrayez 1 pour obtenir l'index correct
      }
    },

    completeStep() {
      const semaineIndex = this.semaine - 1
      const joursIndex = this.jours - 1
      const etapeIndex = this.getEtapeIndex()
      // Marquer l'étape actuelle comme terminée
      this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes[etapeIndex].status = true

      // Vérifier si c'est la dernière étape de la journée
      if (
        etapeIndex ===
        this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes.length - 1
      ) {
        // Si c'est la dernière étape, marquer la journée comme terminée
        this.entrainement[0].semaines[semaineIndex].jours[joursIndex].status = true
        this.saveWeekAndDay()
      }
    },

    // ----- Passer a la prochaine étape -----//
    nextStep() {
      const etapeIndex = this.getEtapeIndex()
      const joursIndex = this.jours - 1

      // Vérifier si la journée est terminée
      if (!this.entrainement[0].semaines[this.semaine - 1].jours[joursIndex].status) {
        // Si la journée n'est pas terminée, passer à l'étape suivante
        if (
          etapeIndex <
          this.entrainement[0].semaines[this.semaine - 1].jours[joursIndex].etapes.length - 1
        ) {
          this.setEtapeIndex(etapeIndex + 1)
          return true
        } else {
          this.setEtapeIndex(0)
        }
      }
    },

    // ----- Passer au prochain jour -----//
    nextDay() {
      //reset l'index une fois l'entrainement fini
      this.setEtapeIndex(0)
      console.log('Inside nextDay, status:', this.status)
      // Vérifier si l'entraînement est en cours avant de passer au jour suivant
      if (this.status) {
        const joursIndex = this.jours - 1

        console.log('Jour actuel et index de jours:', this.jours, joursIndex)

        if (joursIndex < this.entrainement[0].semaines[this.semaine - 1].jours.length - 1) {
          this.setJours(this.jours + 1)
          console.log('Passage au jour suivant:', this.jours)
          return true
        } else {
          this.setJours(1)
          console.log('Retour au premier jour:', this.jours)
          return this.nextWeek()
        }
      } else {
        return false
      }
    },

    // ----- Passer a la prochaine semaine -----//
    nextWeek() {
      const semaineIndex = this.semaine - 1

      if (semaineIndex < this.entrainement[0].semaines.length - 1) {
        this.setSemaine(this.semaine + 1)
        return true
      } else {
        return false
      }
    },
    getCurrentStep() {
      const semaineIndex = this.semaine - 1
      const joursIndex = this.jours - 1
      const etapeIndex = this.getEtapeIndex()

      return this.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes[etapeIndex]
    },

    setStatus(status) {
      this.status = status
    },

    getEtapeIndex() {
      return this.etapeIndex
    },

    setSemaine(semaine) {
      this.semaine = semaine
    },

    setJours(jours) {
      this.jours = jours
    },

    setTime(time) {
      this.time = time
    },

    setEtapeIndex(index) {
      this.etapeIndex = index
    },

    // ----- RESET ----- //
    resetTraining() {
      this.setStatus(false)
      this.setSemaine(1)
      this.setJours(1)
      this.setTime(null)
      this.setEtapeIndex(0)
      this.saveWeekAndDay()

      setTimeout(() => {
        window.location.reload()
      }, 100)
    },

    resetDay() {
      this.setStatus(false)
      this.setTime(null)
      this.setEtapeIndex(0)
      this.saveWeekAndDay()

      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }
})
