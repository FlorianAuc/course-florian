<template>
  <div class="container content">
    <header class="hero is-primary">
      <div class="hero-body">
        <h1 class="title">
          <img style="height: 36px" src="/images/logo.png" alt="logo" /> Je cours...
        </h1>
        <p class="settings"><i class="fas fa-cog"></i></p>
      </div>
    </header>
    <section class="main-content container content">
      <div class="objectif"></div>
      <p>
        <button class="button is-success" @click="startTraining" :disabled="entrainementStore.status">Démarrer</button>
      </p>
      <div class="encours" v-if="entrainementStore.status">
        <h2 class="jour title"> Semaine {{ entrainementStore.semaine }} - Jour {{ entrainementStore.jours }}</h2>
        <p class="progress-text">
          {{ entrainementStore.etapeIndex + 1 }}/{{ totalEtapes() }}
        </p>
        <p class="time">{{ entrainementStore.time }} secondes</p>
        <p class="action">{{ entrainementStore.getCurrentStep().label }}</p>
        <audio autoplay :src="`/${entrainementStore.getCurrentStep().label.toLowerCase()}.mp3`" ref="audioPlayer"></audio>

        <progress
          class="progress is-large is-success"
          :max="totalEtapes()"
          :value="entrainementStore.etapeIndex + 1"
        >
          {{ entrainementStore.etapeIndex + 1 }}
        </progress>
      </div>

      <div class="legend">
        <h3>Légende</h3>
        <table class="table is-striped">
          <tr>
            <td class="is-size-6">Echauffement</td>
            <td class="is-size-6">
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
            <td class="is-size-6">Trot</td>
            <td class="is-size-6">Course normale</td>
          </tr>
          <tr>
            <td class="is-size-6">Trot lent</td>
            <td class="is-size-6">Limite marche rapide</td>
          </tr>
          <tr>
            <td class="is-size-6">Déboulé</td>
            <td class="is-size-6">Accélération constante sur 100 à 200 m.</td>
          </tr>
          <tr>
            <td class="is-size-6">Course</td>
            <td class="is-size-6">Trot à vitesses variables</td>
          </tr>
          <tr>
            <td class="is-size-6">Sprint</td>
            <td class="is-size-6">Vitese max</td>
          </tr>
          <tr>
            <td class="is-size-6">Etirements</td>
            <td class="is-size-6">
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
        >Inspired</a>
      </p>
      <button class="button reset is-danger" @click="resetTraining">Reset</button>
      <button class="button reset-day is-danger" @click="resetDay">Reset day</button>
      <button class="button install is-primary"><i class="fas fa-download"></i></button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEntrainementStore } from '@/stores/entrainement';

const entrainementStore = useEntrainementStore();

const totalEtapes = () => {
  const semaineIndex = entrainementStore.semaine - 1;
  const joursIndex = entrainementStore.jours - 1;
  return entrainementStore.entrainement[0].semaines[semaineIndex].jours[joursIndex].etapes.length;
};

const startTraining = () => {
  entrainementStore.startTraining();

  // Réinitialiser etapeIndex à 0 directement
  entrainementStore.etapeIndex = -1;

  if (entrainementStore.entrainement.length > 0) {
    if (!entrainementStore.nextStep()) {
      entrainementStore.nextDay();
    }
  } else {
    console.error("Erreur : Les données d'entraînement ne sont pas correctement chargées.");
  }
};

const resetTraining = () => {
  entrainementStore.resetTraining();
};

const resetDay = () => {
  entrainementStore.resetDay();
};

const year = ref(new Date().getFullYear());

const updateYear = () => {
  year.value = new Date().getFullYear();
};

onMounted(updateYear);

updateYear();
</script>

<style lang="scss">

.notification {
  transition: transform 0.5s ease;
  font-size: 2rem;
  text-align: center;
  background: rgba(0, 194, 0, 0.895);
  z-index: 9999;
}

.is-hidden {
  transform: translateY(-100%);
}
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
progress{
  width: 300px;
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
.legend{
  font-size: 2rem;
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

@media screen and (max-height: 800px){
.footer{
  margin-top: 5rem;
}
}
</style>
