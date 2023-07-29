<template>
  <aside h="full" b-ie="color-sep 1" flex="~ col" items="center" p-bs="8" gap="2">
    <div w="200px" aspect="1" class="light" b-rd="50%" m-be="4">
      <img src="/assets/images/logo.jpg" b-rd="50%">
    </div>

    <div font="bold" text="2xl">
      {{ title }}
    </div>

    <div color="desc" font="6">
      {{ description }}
    </div>

    <ul flex items="center" gap="2">
      <li v-for="social in socials" :key="social.link" flex items="center">
        <a :href="social.link" :title="social.label" cursor="pointer" :class="social.icon" />
      </li>
    </ul>
  </aside>
</template>
