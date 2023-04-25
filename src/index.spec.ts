import { faker } from '@faker-js/faker'
import { useFlexSearch } from './index'
import { Document, Index } from 'flexsearch'
import { Ref, ref } from 'vue-demi'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

interface User { id: number, firstName: string, lastName: string }

interface Animal { id: number, type: string }

function dummyDocumentIndex (indexFields: string[]) {
  return new Document({
    document: {
      id: 'id',
      index: indexFields
    }
  })
}

function dummyIndex () {
  return new Index({
    preset: 'match'
  })
}

function dummyDataUser () {
  const userStore: Ref<User[]> = ref([])
  const providedIndex = ref(dummyDocumentIndex(['firstName', 'lastName', 'email']))

  for (let i = 0; i < faker.datatype.number(); i++) {
    const user = { firstName: faker.name.firstName(), lastName: faker.name.lastName(), id: i }

    userStore.value.push(user)
    providedIndex.value.add(user)
  }

  return { userStore, providedIndex }
}

function dummyDataAnimal () {
  const vegetableStore: Ref<Animal[]> = ref([])
  const providedIndex = ref(dummyIndex())

  for (let i = 0; i < faker.datatype.number(); i++) {
    const animal = { id: i, type: faker.animal.type() }

    vegetableStore.value.push(animal)
    providedIndex.value.add(animal.id, animal.type)
  }

  return { vegetableStore, providedIndex }
}

beforeEach(() => {
  console.warn = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useFlexSearch', () => {
  describe('DocumentIndex', () => {
    it('Should get 1 result on searching by firstName', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const results = useFlexSearch(query, providedIndex, userStore)
      const expectedItem = faker.helpers.arrayElement(userStore.value)

      query.value = expectedItem.firstName

      expect(results.value).toHaveLength(1)
    })

    it('Should get 1 result on searching by lastName', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const results = useFlexSearch(query, providedIndex, userStore)
      const expectedItem = faker.helpers.arrayElement(userStore.value)

      query.value = expectedItem.lastName

      expect(results.value).toHaveLength(1)
    })

    it('Should get nothing in results for empty query', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const results = useFlexSearch(query, providedIndex, userStore)

      query.value = ''

      expect(results.value).toHaveLength(0)
    })

    it('should get console warn for no store provided', () => {
      const providedIndex = ref(dummyDocumentIndex([]))
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')

      useFlexSearch(query, providedIndex)

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch store was not provided. Your search results will be empty.'
      )
    })

    it('should get console warn for no index provided', () => {
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')
      const store = [{ id: 0 }]

      useFlexSearch(query, null, ref(store))

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch index was not provided. Your search results will be empty.'
      )
    })

    it('should get console warn for no index and no store provided', () => {
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')

      useFlexSearch(query, null)

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch index and store was not provided. Your search results will be empty.'
      )
    })
  })

  describe('Index', () => {
    it('Should get N result one query change by type of Animal', () => {
      const { vegetableStore, providedIndex } = dummyDataAnimal()
      const query = ref('')
      const results = useFlexSearch(query, providedIndex, vegetableStore)
      const expectedItem = faker.helpers.arrayElement(vegetableStore.value)
      const randomType = expectedItem.type
      const countRandomType = vegetableStore.value.filter(({ type }) => type === randomType).length

      query.value = randomType

      expect(results.value).toHaveLength(countRandomType)
    })
  })
})
