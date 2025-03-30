
<template>
  <div class="game-board" :style="boardStyle">
    <div 
      v-for="row in tiles" 
      :key="row[0].id" 
      class="row"
    >
      <Tile
        v-for="tile in row"
        :key="tile.id"
        :tile="tile"
        :selected="isSelected(tile)"
        :hint="isHint(tile)"
        @click="handleClick(tile)"
      />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import Tile from '../components/Tile.vue'

const props = defineProps({
  tiles: Array,
  selected: Array,
  hintPair: Object
})

const emit = defineEmits(['tile-click'])

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.tiles[0]?.length || 0}, 40px)`
}))

const isSelected = (tile) => {
  return props.selected.some(t => t.id === tile.id)
}

const isHint = (tile) => {
  return props.hintPair?.some(t => t?.id === tile.id)
}

const handleClick = (tile) => {
  emit('tile-click', tile)
}
</script>

<style scoped>
.game-board {
  display: grid;
  gap: 2px;
  margin: 20px auto;
}
.row {
  display: contents;
}
</style>