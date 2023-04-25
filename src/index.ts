import FlexSearch, { Document, Index, SimpleDocumentSearchResultSetUnit } from 'flexsearch'
import { Ref, computed, ref, watch } from 'vue-demi'

/**
 *
 * @param query The keyword which we are looking for
 * @param providedIndex The {@link https://github.com/nextapps-de/flexsearch#index.add Index} or {@link https://github.com/nextapps-de/flexsearch#document.add Document} from Flexsearch
 * @param store The list of item where we are looking
 * @param searchOptions Search {@link https://github.com/nextapps-de/flexsearch#search-options options}
 * @param limit Max number of results to be returned
 *
 */
export function useFlexSearch <T extends {id: string| number}> (
  query: Ref<string>,
  providedIndex: Ref<Index> | Ref<Document<any>> | null,
  store?: Ref<Array<T>>,
  searchOptions = {},
  limit = 10
) {
  const index = ref<Index | Document<any> | null>(null)
  const isDocument = ref(false)

  watch(
    [query, providedIndex, query],
    () => {
      if (!providedIndex && !store) {
        console.warn('A FlexSearch index and store was not provided. Your search results will be empty.')
      } else if (!providedIndex) {
        console.warn('A FlexSearch index was not provided. Your search results will be empty.')
      } else if (!store) {
        console.warn('A FlexSearch store was not provided. Your search results will be empty.')
      }
    },
    { immediate: true }
  )

  watch(
    [providedIndex],
    () => {
      if (!providedIndex) {
        index.value = null
        return
      }

      if (providedIndex.value instanceof FlexSearch.Index) {
        index.value = providedIndex.value
      }
      if (providedIndex.value instanceof FlexSearch.Document) {
        isDocument.value = true
        index.value = providedIndex.value
      }
    },
    { immediate: true }
  )

  return computed(() => {
    if (!query || !index.value || !store) return []
    if (query) {
      const rawResults = index.value.search(query.value, limit, searchOptions)

      return rawResults.map(rawResult => {
        if (isDocument.value) {
          const [id] = (rawResult as SimpleDocumentSearchResultSetUnit).result

          return store.value.find(storeItem => storeItem.id === id)
        }
        return store.value.find(storeItem => storeItem.id === rawResult)
      })
    }
  })
}
