<template>
  <div w="full" h="full" class="layout">
    <LayoutSidebar g-name="sidebar" />
    <LayoutHeader g-name="header" />
    <main g-name="main" py="8" overflow="y-auto">
      <slot />
    </main>
    <LayoutFooter g-name="footer" />
  </div>
</template>
