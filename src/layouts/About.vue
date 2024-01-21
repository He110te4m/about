<script lang="ts" setup>
import { LayoutGroup } from '~/components/layout'
import { description, socials, title } from '~/configs'
</script>

<template>
  <LayoutGroup>
    <div w="full" h="full" p-be="8">
      <div flex b-be="1 color-$info-color" p-be="4" lt-xs:flex="col" lt-xs:items="center">
        <img src="/assets/images/logo.jpg" b-rd="50%" w="100px" h="100px" class="light" m-ie="8" lt-xs:m-ie="0" lt-xs:m-be="4">
        <div flex="1 ~ col">
          <div text="4xl" lt-xs:text="2xl center">
            {{ title }}
          </div>

          <div my="2" lt-xs:text="center balance">
            {{ description }}
          </div>

          <ul flex items="center" gap="2" lt-xs:justify="center">
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
