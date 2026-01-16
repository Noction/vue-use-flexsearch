# useFlexSearch

[![NPM version](https://img.shields.io/npm/v/@noction/vue-use-flexsearch.svg?style=flat)](https://npmjs.com/package/@noction/vue-use-flexsearch)
[![NPM downloads](https://img.shields.io/npm/dm/@noction/vue-use-flexsearch.svg?style=flat)](https://npmjs.com/package/@noction/vue-use-flexsearch)
[![codecov](https://codecov.io/gh/Noction/vue-use-flexsearch/branch/main/graph/badge.svg?token=C5NGW1BC2N)](https://codecov.io/gh/Noction/vue-use-flexsearch)

Wrapper for [`Flexsearch`](https://github.com/nextapps-de/flexsearch).

## Install

```bash
pnpm add flexsearch @noction/vue-use-flexsearch
```

## API

```ts
// eslint-disable-next-line unused-imports/no-unused-vars
function useFlexSearch<T extends Record<"id", Id>, D = unknown>(
  query: Ref<string>,
  providedIndex: Ref<Index | Document<D> | null>,
  store?: Ref<Array<T>>,
  searchOptions: SearchOptions = {},
  limit = 10,
): { results: ComputedRef<T[]> };
```

By utilizing the _useFlexSearch_ composable, you can provide your search query, index, and store as inputs, and obtain the results as an array. This optimizes searches by memoizing them, ensuring efficient searching.

### Parameters

| Name          | Type                             | Description                                                                                                                                            | Default |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| query         | Ref<string>                      | The keyword which we are looking for                                                                                                                   |         |
| providedIndex | Ref<Index> or Ref<Document<any>> | The [Index](https://github.com/nextapps-de/flexsearch#index.add) or [Document](https://github.com/nextapps-de/flexsearch#document.add) from Flexsearch |         |
| store         | Ref<Array<T>>                    | The list of item where we are looking                                                                                                                  |         |
| searchOptions | Object                           | Search [options](https://github.com/nextapps-de/flexsearch#search-options)                                                                             | {}      |
| limit         | 10                               | Max number of results to be returned                                                                                                                   | 10      |

## Usage

This code snippet creates a text input field and utilizes FlexSearch to execute a search on the index when the _query_ is changed.

```vue
<script setup>
import { useFlexSearch } from "@noction/vue-use-flexsearch";
import { Index } from "flexsearch";
import { ref, shallowRef } from "vue";

const store = ref([
  { id: 1, title: "The Jungle Book" },
  { id: 2, title: "Dracula" },
  { id: 3, title: "Shōgun" },
]);

const index = shallowRef(new Index({ preset: "match" }));

store.value.forEach((item) => index.value.add(item.id, item.title));

const query = ref("");
const { results } = useFlexSearch(query, index, store);
</script>

<template>
  <div>
    <input v-model="query" />
    <h1>Results</h1>
    <ul>
      <li v-for="result in results" :key="result.id" v-text="result.title" />
    </ul>
  </div>
</template>
```
