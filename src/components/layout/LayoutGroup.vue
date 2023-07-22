<template>
  <div w="full" h="full" class="layout">
    <LayoutSidebar g-name="sidebar" />
    <LayoutHeader g-name="header" />
    <main g-name="main" py="8" overflow="y-auto">
      <slot name="wrapper">
        <div max-w="720px" w="80%" mx="auto">
          <slot />
        </div>
      </slot>
    </main>
    <LayoutFooter g-name="footer" />
  </div>
</template>
