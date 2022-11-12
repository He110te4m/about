<template>
  <footer text-xl py-6 flex gap-2 justify="center">
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>
  </footer>
</template>
