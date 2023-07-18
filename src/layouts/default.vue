<template>
  <div w="full" h="full" class="layout">
    <LayoutSidebar g-name="sidebar" />
    <LayoutHeader g-name="header" />
    <main g-name="main">
      <RouterView />
    </main>
    <LayoutFooter g-name="footer" />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template:  40px 1fr 40px / 320px 1fr;
  grid-template-areas:
      "sidebar header"
      "sidebar main"
      "sidebar footer"
}

.layout .sidebar {
  grid-area: sidebar;
}
.layout .header {
  grid-area: header;
}
.layout .main {
  grid-area: main;
}
.layout .footer {
  grid-area: footer;
}
</style>
