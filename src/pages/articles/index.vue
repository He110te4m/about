<script lang="ts" setup>
import { useFilterOptions } from './composables/useFilterOptions'
import type { Article } from '~/components/article'
import type { PagerItem } from '~/composables/pager'

// Calculate the list to display
const list = ref<Article[]>([])
const { filterOptions } = useFilterOptions()
const { list: filteredList } = useObjectListFilter(list, filterOptions)
const limit = ref(5)
const { list: articleList, page, maxPage, jump } = usePage(filteredList, limit)
const { pages } = usePager(page, maxPage)
function onJump(item: PagerItem) {
  if (item.type === 'page') {
    jump(item.value)
  }
}

// Handle data loading
onMounted(() => {
  const { data } = useFetch<Article[]>('blog/articles/list').json()
  watch(data, (articles) => {
    articles.reverse()
    list.value = articles ?? []
  })
})

const router = useRouter()
const route = useRoute()
function onChangeCategory(category: string) {
  router.push({
    path: route.path,
    query: {
      category,
    },
  })
}
</script>

<template>
  <ArticleList :list="articleList" @click-category="onChangeCategory" />
  <dl class="articles-pager">
    <dd
      v-for="(item, idx) in pages"
      :key="`page-item-${idx}`"
      class="articles-pager__item"
      :class="{
        'active': item.type === 'page' && item.value === page,
        'no-click': item.type === 'sep' || item.value === page,
      }"
      @click="onJump(item)"
    >
      {{ item.type === 'sep' ? '...' : item.value }}
    </dd>
  </dl>
</template>

<style scoped>
.articles-pager {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-sm);
  width: 100%;
  margin-top: var(--size-md);
}

.articles-pager__item {
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--size-4xl);
  height: var(--size-4xl);

  border: 1px solid #ddd;
  cursor: pointer;
  color: var(--text-description-color);

  transition: color, border-color .5s;
}
.articles-pager__item:hover {
  border-color: var(--text-secondary-color);
  color: var(--text-secondary-color);
}
.articles-pager__item.active {
  border-color: var(--text-primary-color);
  color: var(--text-primary-color);
}
.articles-pager__item.no-click {
  cursor: default;
}
</style>
