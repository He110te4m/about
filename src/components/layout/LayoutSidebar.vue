<template>
  <aside h="full" b-ie="color-gray-2 1" flex="~ col" items="center" py="4" gap="4">
    <div w="200px" aspect="1" class="light" b-rd="50%">
      <img src="/assets/images/logo.jpg" b-rd="50%">
    </div>

    <div font="bold" text="2xl">
      {{ title }}
    </div>

    <div color="gray-5">
      {{ description }}
    </div>

    <ul flex items="center" gap="2">
      <li v-for="social in socials" :key="social.link" flex items="center">
        <a :href="social.link" :title="social.label" cursor="pointer" :class="social.icon" />
      </li>
    </ul>
  </aside>
</template>
