<template>
  <div w="full" h="full" flex="~ col" site-bg>
    <LayoutHeader h="40px" content-bg />
    <main py="8" overflow="y-auto" flex="1">
      <slot name="wrapper">
        <div max-w="720px" w="80%" mx="auto" min-h="full" card>
          <slot />
        </div>
      </slot>
    </main>
    <LayoutFooter h="40px" content-bg />
  </div>
</template>
