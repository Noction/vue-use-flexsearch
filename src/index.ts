import type { Document, Id, IndexSearchResult, SearchOptions, SimpleDocumentSearchResultSetUnit } from 'flexsearch'
import type { Ref } from 'vue-demi'
import { Index } from 'flexsearch'
import { computed, ref, watch } from 'vue-demi'

/**
 *
 * @param query The keyword which we are looking for
 * @param providedIndex The {@link https://github.com/nextapps-de/flexsearch#index.add Index} or {@link https://github.com/nextapps-de/flexsearch#document.add Document} from Flexsearch
 * @param store The list of item where we are looking
 * @param searchOptions Search {@link https://github.com/nextapps-de/flexsearch#search-options options}
 * @param limit Max number of results to be returned
 *
 */

export function useFlexSearch<T extends Record<'id', Id>, D = unknown>(
  query: Ref<string>,
  providedIndex: Ref<Index | Document<D> | null>,
  store?: Ref<Array<T>>,
  searchOptions: SearchOptions = {},
  limit = 10,
) {
  const index = ref<Index | Document<D> | null>(null)

  watch([providedIndex, store], ([newProvidedIndex, newStore]) => {
    if (!newProvidedIndex && !newStore) {
      console.warn('A FlexSearch index and store was not provided. Your search results will be empty.')
    }
    else if (!newProvidedIndex) {
      console.warn('A FlexSearch index was not provided. Your search results will be empty.')
    }
    else if (!newStore) {
      console.warn('A FlexSearch store was not provided. Your search results will be empty.')
    }
  }, { immediate: true })

  watch([providedIndex], (newProvidedIndex) => {
    if (!newProvidedIndex)
      return index.value = null

    if (newProvidedIndex instanceof Index)
      return index.value = newProvidedIndex

    index.value = providedIndex.value
  }, { immediate: true })

  return {
    results: computed(() => {
      const results: T[] = []

      if (!query.value || !index.value || !store?.value)
        return results
      const rawResults = index.value.search(query.value, limit, searchOptions)

      if (rawResults.length === 0)
        return results

      if (isIndexSearchResult(rawResults)) {
        rawResults.forEach((id) => {
          const item = store.value.find(item => item.id === id)

          if (item) {
            results.push(item)
          }
        })
        return results
      }

      const usedIds = new Set<Id>()

      for (const rawResult of rawResults) {
        for (const id of rawResult.result) {
          if (!usedIds.has(id)) {
            usedIds.add(id)
            const item = store.value.find(item => item.id === id)

            if (item)
              results.push(item)
          }
        }
      }
      return results
    }),
  }
}

function isIndexSearchResult(value: SimpleDocumentSearchResultSetUnit[] | IndexSearchResult): value is IndexSearchResult {
  return ['string', 'number'].includes(typeof value[0])
}
