<script lang="ts" setup>
import { description, socials, title } from '~/configs/site'
</script>

<template>
  <aside h="full" b-ie="color-gray-200 1" flex="~ col" items="center" py="4" gap="4">
    <img src="/assets/images/logo.jpg" b-rd="50%" w="200px" aspect="1">

    <div font="bold" text="2xl">
      {{ title }}
    </div>

    <div color="gray-500">
      {{ description }}
    </div>

    <ul flex items="center" gap="2">
      <li v-for="social in socials" :key="social.link" flex items="center">
        <a :href="social.link" :title="social.label" cursor="pointer" :class="social.icon" />
      </li>
    </ul>
  </aside>
</template>
