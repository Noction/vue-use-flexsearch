import FlexSearch, { Document, Index, SimpleDocumentSearchResultSetUnit } from 'flexsearch'
import { Ref, computed, ref, watch } from 'vue-demi'

/**
 * name of action.
 *
 * @see description
 * @param query
 * @param providedIndex
 * @param store
 * @param searchOptions
 * @param limit
 */
export const useFlexSearch = <T extends {id: string| number}>(
  query: Ref<string>,
  providedIndex: Ref<Index> | Ref<Document<any>> | null,
  store?: Ref<Array<T>>,
  searchOptions = {},
  limit = 10
) => {
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
