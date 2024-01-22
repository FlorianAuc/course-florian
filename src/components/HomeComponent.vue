<template>
  <div class="container content">
    <header class="hero is-primary">
      <div class="hero-body">
        <h1 class="title">
          <img style="height: 36px" src="/src/assets/images/logo.png" alt="logo" /> Je cours...
        </h1>
        <p class="settings"><i class="fas fa-cog"></i></p>
      </div>
    </header>
    <section class="main-content container content">
      <div class="objectif"></div>
      <p><button class="button is-success" @click="startTraining" :disabled="entrainementStore.status">Démarrer</button></p>
      <div class="encours" v-if="entrainementStore.status">
        <h2 class="jour title">{{ entrainementStore.getCurrentStep().label }}</h2>
        <p class="progress-text">
          {{ entrainementStore.getEtapeIndex() + 1 }}/{{ totalEtapes() }}
        </p>
        <p class="time">{{ entrainementStore.time }} secondes</p>
        <p class="action">{{ entrainementStore.getCurrentStep().label }}</p>
        <audio src=""></audio>
        <progress
          class="progress is-large is-success"
          :max="totalEtapes()"
          :value="entrainementStore.getEtapeIndex() + 1"
        >
          {{ entrainementStore.getEtapeIndex() + 1 }}
        </progress>
      </div>

      <div class="legend">
        <h3>Légende</h3>
        <table class="table is-striped">
          <tr>
            <td>Echauffement</td>
            <td>
              Ensemble de
              <a
                href="https://www.youtube.com/watch?v=hijkKi4g_q8&ab_channel=MatthieuVerneret"
                target="_blank"
                >petits exercices</a
              >
              assez doux
            </td>
          </tr>
          <tr>
            <td>Trot</td>
            <td>Course normale</td>
          </tr>
          <tr>
            <td>Trot lent</td>
            <td>Limite marche rapide</td>
          </tr>
          <tr>
            <td>Déboulé</td>
            <td>Accélération constante sur 100 à 200 m.</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Trot à vitesses variables</td>
          </tr>
          <tr>
            <td>Sprint</td>
            <td>Vitese max</td>
          </tr>
          <tr>
            <td>Etirements</td>
            <td>
              Ensemble de
              <a
                href="https://www.youtube.com/watch?v=rlDv7M_MxLw&ab_channel=LucileWoodward"
                target="_blank"
                >petits exercices</a
              >
              assez doux
            </td>
          </tr>
        </table>
      </div>
    </section>
    <footer class="footer">
      <p>
        &copy; l'R & L'O.be - {{ year }} -
        <a
          href="https://jogging.jograph.be/les-entrainements-je-cours-pour-ma-forme/"
          target="_blank"
          >Inspired</a
        >
      </p>
      <button class="button reset is-danger" @click="resetTraining">Reset</button>
      <button class="button reset-day is-danger" @click="resetDay">Reset day</button>
      <!-- <button class="button update is-warning">Update</button> -->
      <button class="button install is-primary"><i class="fas fa-download"></i></button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEntrainementStore } from '@/stores/entrainement'

const entrainementStore = useEntrainementStore()

entrainementStore.listEntrainement(); 

onMounted(() => {
  entrainementStore.listEntrainement();
});


const totalEtapes = () => {
  const semaineIndex = entrainementStore.semaine - 1;
  const joursIndex = entrainementStore.jours - 1;
  return entrainementStore.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes.length;
};



const startTraining = async () => {
  await entrainementStore.startTraining();

  // Vérifier si les données d'entraînement sont correctement chargées
  if (entrainementStore.entrainement.length > 0) {
    // Vérifier si toutes les étapes du jour sont terminées, puis passer au jour suivant
    if (!entrainementStore.nextStep()) {
      entrainementStore.nextDay();
    }
  } else {
    console.error("Erreur : Les données d'entraînement ne sont pas correctement chargées.");
  }
}

const resetTraining = () => {
  entrainementStore.resetTraining();
}

const resetDay = () => {
  entrainementStore.resetDay();
}


// ----- Mettre à jour la date du footer automatiquement ----- //
const year = ref(new Date().getFullYear())

// Fonction pour mettre à jour l'année
const updateYear = () => {
  year.value = new Date().getFullYear()
}

// Surveiller les changements de l'année
onMounted(updateYear)

// Appeler la fonction pour initialiser l'année
updateYear()
</script>

<style lang="scss">
section.container {
  padding: 1rem;
}
.install {
  float: right;
}
.update {
  display: none;
  float: left;
  margin-right: 1em;
}
.reset {
  float: left;
  margin-right: 1em;
}
.reset-day {
  float: left;
  margin-right: 1em;
}
.main-content {
  height: calc(100vh - 320px) !important;
}
.footer {
  height: 80px !important;
}
.table {
  td {
    font-size: 11px;
  }
}
.settings {
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 1rem;
  margin-right: 1rem;
  font-size: 2rem;
}
.objectif {
  margin-bottom: 1rem;
}
@media screen and (min-width: 640px) {
  .encours {
    float: left;
  }
  .legend {
    max-width: 50%;
    float: right;
  }
}
</style>
