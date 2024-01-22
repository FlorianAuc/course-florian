<template>
  <main>
    <HomeComponent :entrainement="entrainement"></HomeComponent>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomeComponent from '@/components/HomeComponent.vue'
import { useEntrainementStore } from '@/stores/entrainement'

const entrainementStore = useEntrainementStore()

const entrainement = ref([])

onMounted(async () => {
  await entrainementStore.listEntrainement()
  entrainement.value = entrainementStore.entrainement
})
</script>

<style lang="scss"></style>
