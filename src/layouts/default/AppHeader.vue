<script lang="ts" setup>
</script>

<template>
  <header h="16" w="full" flex="~" justify="between" items="center" px="6" color="$text-primary-color">
    <div text="xl">
      牡龙's Blog
    </div>
    <dl flex gap="4">
      <dd>
        <RouterLink to="/articles">
          Articles
        </RouterLink>
      </dd>
      <dd>
        <RouterLink to="/aboutme">
          About me
        </RouterLink>
      </dd>
      <dd v-if="false">
        <button icon-btn @click="toggleDark()">
          <div dark:i-carbon-moon i-carbon-sun />
        </button>
      </dd>
    </dl>
  </header>
</template>
