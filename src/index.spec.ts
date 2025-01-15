import type { Ref } from 'vue'
import { faker } from '@faker-js/faker'
import { Document, Index } from 'flexsearch'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useFlexSearch } from './index'

type User = {
  id: number
  firstName: string
  lastName: string
}

type Animal = {
  id: number
  type: string
}

function dummyDocumentIndex(indexFields: string[]) {
  return new Document({
    charset: 'latin:extra',
    document: {
      id: 'id',
      index: indexFields,
    },
    preset: 'match',
    tokenize: 'forward',
  })
}

function dummyIndex() {
  return new Index({
    charset: 'latin:extra',
    preset: 'match',
    tokenize: 'forward',
  })
}

function dummyDataUser() {
  const userStore: Ref<User[]> = ref([])
  const providedIndex = ref(dummyDocumentIndex(['firstName', 'lastName', 'email']))

  for (let i = 0; i < faker.number.int({ max: 10 }); i++) {
    const user = {
      firstName: faker.person.firstName(),
      id: i,
      lastName: faker.person.lastName(),
    }

    userStore.value.push(user)
    providedIndex.value.add(user)
  }

  return { providedIndex, userStore }
}

function dummyDataAnimal() {
  const animalStore: Ref<Animal[]> = ref([])
  const providedIndex = ref(dummyIndex())

  for (let i = 0; i < faker.number.int({ max: 10 }); i++) {
    const animal = { id: i, type: faker.animal.type() }

    animalStore.value.push(animal)
    providedIndex.value.add(animal.id, animal.type)
  }

  return { animalStore, providedIndex }
}

beforeEach(() => {
  console.warn = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useFlexSearch', () => {
  describe('documentIndex', () => {
    it('should get 1 result on searching by firstName', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const { results } = useFlexSearch(query, providedIndex, userStore)
      const expectedItem = faker.helpers.arrayElement(userStore.value)

      query.value = expectedItem.firstName

      expect(results.value).toHaveLength(1)
    })

    it('should get 1 result on searching by lastName', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const { results } = useFlexSearch(query, providedIndex, userStore)
      const expectedItem = faker.helpers.arrayElement(userStore.value)

      query.value = expectedItem.lastName

      expect(results.value).toHaveLength(1)
    })

    it('should get nothing in results for empty query', () => {
      const { userStore, providedIndex } = dummyDataUser()
      const query = ref('')
      const { results } = useFlexSearch(query, providedIndex, userStore)

      query.value = ''

      expect(results.value).toHaveLength(0)
    })

    it('should get console warn for no store provided', () => {
      const providedIndex = ref(dummyDocumentIndex([]))
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')

      useFlexSearch(query, providedIndex)

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch store was not provided. Your search results will be empty.',
      )
    })

    it('should get console warn for no index provided', () => {
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')
      const store = [{ id: 0 }]

      useFlexSearch(query, ref(null), ref(store))

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch index was not provided. Your search results will be empty.',
      )
    })

    it('should get console warn for no index and no store provided', () => {
      const query = ref('')
      const consoleSpy = vi.spyOn(console, 'warn')

      useFlexSearch(query, ref(null))

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch index and store was not provided. Your search results will be empty.',
      )
    })
  })

  describe('index', () => {
    it('should get N result one query change by type of Animal', () => {
      const { animalStore, providedIndex } = dummyDataAnimal()
      const query = ref('')
      const { results } = useFlexSearch(query, providedIndex, animalStore)
      const expectedItem = faker.helpers.arrayElement(animalStore.value)
      const randomType = expectedItem.type
      const countRandomType = animalStore.value.filter(({ type }) => type === randomType).length

      query.value = randomType

      expect(results.value).toHaveLength(countRandomType)
    })
    it('should get warn for no index', () => {
      const { animalStore, providedIndex } = dummyDataAnimal()
      const consoleSpy = vi.spyOn(console, 'warn')

      useFlexSearch(ref(''), providedIndex, animalStore)
      useFlexSearch(ref(''), ref(null), animalStore)

      expect(consoleSpy).toHaveBeenCalledWith(
        'A FlexSearch index was not provided. Your search results will be empty.',
      )
    })
  })
})
