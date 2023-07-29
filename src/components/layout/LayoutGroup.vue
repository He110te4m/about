<template>
  <div w="full" h="full" flex="~ col">
    <LayoutHeader h="40px" />
    <main py="8" overflow="y-auto" flex="1">
      <slot name="wrapper">
        <div max-w="720px" w="80%" mx="auto" h="full">
          <slot />
        </div>
      </slot>
    </main>
    <LayoutFooter h="40px" />
  </div>
</template>
