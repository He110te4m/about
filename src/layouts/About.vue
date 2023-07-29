<template>
  <LayoutGroup>
    <div w="full" h="full" card p="8" p-be="8">
      <div flex b-be="1 color-info" p-be="4">
        <img src="/assets/images/logo.jpg" b-rd="50%" w="100px" aspect="1" class="light" m-ie="8">
        <div flex="1 ~ col">
          <div text="4xl">
            {{ title }}
          </div>

          <div my="2">
            {{ description }}
          </div>

          <ul flex items="center" gap="2">
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
