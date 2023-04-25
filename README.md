# useFlexSearch

Wrapper for [`Flexsearch`](https://github.com/nextapps-de/flexsearch).

## Install 

```bash
npm i -S flexsearch @noction/vue-use-flexsearch
```

## API

```ts
function useFlexSearch <T extends {id: string| number}> (
    query: Ref<string>,
    providedIndex: Ref<Index> | Ref<Document<any>> | null,
    store?: Ref<Array<T>>,
    searchOptions = {},
    limit = 10
): Object[]
```

By utilizing the _useFlexSearch_ composable, you can provide your search query, index, and store as inputs, and obtain the results as an array. This optimizes searches by memoizing them, ensuring efficient searching.

### Parameters

| Name          | Type                             | Description                                                                                                                                            | Default |
|---------------|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| query         | Ref<string>                      | The keyword which we are looking for                                                                                                                   |         |
| providedIndex | Ref<Index> or Ref<Document<any>> | The [Index](https://github.com/nextapps-de/flexsearch#index.add) or [Document](https://github.com/nextapps-de/flexsearch#document.add) from Flexsearch |         |
| store         | Ref<Array<T>>                    | The list of item where we are looking                                                                                                                  |         |
| searchOptions | Object                           | Search [options](https://github.com/nextapps-de/flexsearch#search-options)                                                                             | {}      |
| limit         | 10                               | Max number of results to be returned                                                                                                                   | 10      |


## Usage

This code snippet creates a text input field and utilizes FlexSearch to execute a search on the index when the _query_ is changed.

```vue
<script setup>
import { ref } from 'vue'
import { useFlexSearch } from '@noction/vue-use-flexsearch'
    
const store = [
  { id: 1, title: 'The Jungle Book' },
  { id: 2, title: 'Darcula' },
  { id: 3, title: 'Shōgun' }
]
const index = new Index({ preset: 'match' })

const query = ref('')
const results = useFlexSearch(query, index, store)
</script>

<template>
  <div>
    <input v-model="query">
    <h1>Results</h1>
    <ul>
      <li
          v-for="result in results"
          :key="result.id"
          v-text="result.title"
      />
    </ul>
  </div>
</template>
```
