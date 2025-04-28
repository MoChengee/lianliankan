
<template>
  <div 
    class="tile"
    :class="{ 
      'removed': tile.removed,
      'selected': selected,
      'hint': hint
    }"
    @click="handleClick"
  >
    <img 
      v-if="!tile.removed"
      :src="getImage(tile.type)"
      alt="tile"
    >
  </div>
</template>

<script setup>

const props = defineProps({
  tile: Object,
  selected: Boolean,
  hint: Boolean
})

const emit = defineEmits(['click'])

const getImage = (type) => {
  return new URL(`../assets/images/elements/${type}.png`, import.meta.url).href;
};

const handleClick = () => {
  if(!props.tile.removed){
    emit('click', props.tile)
  }
}
</script>

<style scoped>
.tile {
  width: 40px;
  height: 40px;
  /* border: 1px solid #ccc; */
  cursor: pointer;
  transition: all 0.2s;
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected {
  outline: 2px solid #ff0000;
  /* border: 2px solid #ff0000; */
  /* transform: scale(1.1); */  /* 放大 */
}

.hint {
  box-shadow: 0 0 10px yellow;
}

.removed {
  background: transparent;
  border-color: transparent;
}
</style>