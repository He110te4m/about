<script lang="ts" setup>
import { LayoutGroup } from '~/components/layout'
import { description, socials, title } from '~/configs'
</script>

<template>
  <LayoutGroup>
    <div w="full" h="full" p-be="8">
      <div flex b-be="1 color-$info-color" p-be="4" lt-sm:flex="col" lt-sm:items="center">
        <img src="/assets/images/logo.jpg" b-rd="50%" w="100px" h="100px" class="light" m-ie="8" lt-sm:m-ie="0" lt-sm:m-be="4">
        <div flex="1 ~ col">
          <div text="4xl" lt-sm:text="2xl center">
            {{ title }}
          </div>

          <div my="2" lt-sm:text="center balance">
            {{ description }}
          </div>

          <ul flex items="center" gap="2" lt-sm:justify="center">
            <li v-for="social in socials" :key="social.link" flex items="center">
              <a :href="social.link" :title="social.label" :class="social.icon" />
            </li>
          </ul>
        </div>
      </div>
      <div px="4">
        <RouterView />
      </div>
    </div>
  </LayoutGroup>
</template>
