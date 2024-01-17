<template>
  <main w="full" h="full" py="8" min-h="100vh" overscroll-y="auto">
    <slot name="wrapper">
      <div max-w="720px" w="80%" mx="auto" card>
        <slot />
      </div>
    </slot>
  </main>
</template>
