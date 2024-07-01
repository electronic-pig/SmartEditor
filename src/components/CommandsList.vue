<template>
  <div class="dropdown-menu">
    <template v-if="items.length">
      <button :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items" :key="index"
        @click="selectItem(index)">
        {{ item.title }}
      </button>
    </template>
    <div class="item" v-else>
      No result
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
        return true
      }

      if (event.key === 'ArrowDown') {
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length
        return true
      }

      if (event.key === 'Enter') {
        const item = this.items[this.selectedIndex]
        this.command(item)
        return true
      }

      return false
    },
  },
}
</script>

<style lang="scss">
/* Dropdown menu */
.dropdown-menu {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: auto;
  padding: 0.4rem;
  position: relative;

  button {
    padding: 8px 10px;
    border: none;
    border-radius: 5px;
    background-color: var(--white);
    align-items: center;
    background-color: transparent;
    display: flex;
    gap: 0.25rem;
    text-align: left;
    width: 100%;

    &:hover,
    &:hover.is-selected {
      background-color: var(--gray-3);
    }

    &.is-selected {
      background-color: var(--gray-2);
    }
  }
}
</style>