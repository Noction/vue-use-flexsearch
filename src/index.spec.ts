import {Document, Index} from "flexsearch";
import {ref, Ref} from "vue-demi";
import {useFlexSearch} from "./index";
import {describe, expect, it, vi, beforeEach, afterEach} from "vitest";
import {faker} from "@faker-js/faker";

function dummyDocumentIndex(indexFields: string[]) {
    return new Document({
        document: {
            id: "id",
            index: indexFields,
        },
    });
}

function dummyIndex() {
    return new Index({
        preset: "match",
    });
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

type User = { id: number, firstName: string, lastName: string }
const dummyDataUser = () => {
    const userStore: Ref<User[]> = ref([])
    const providedIndex = ref(dummyDocumentIndex(['firstName', 'lastName', 'email']));
    for (let i = 0; i < 5; i++) {
        const user = {firstName: faker.name.firstName(), lastName: faker.name.lastName(), id: i}
        userStore.value.push(user)
        providedIndex.value.add(user)
    }
    return {userStore, providedIndex}
}

type Animal = { id: number, type: string }
const dummyDataAnimal = () => {
    const vegetableStore: Ref<Animal[]> = ref([])
    const providedIndex = ref(dummyIndex())
    for (let i = 0; i < 5; i++) {
        const animal = {id: i, type: faker.animal.type()}
        vegetableStore.value.push(animal)
        providedIndex.value.add(animal.id, animal.type)
    }

    return {vegetableStore, providedIndex}
}
beforeEach(() => {
    console.clear();
});
describe("useFlexSearch Document Index", () => {
    it("Should get 1 result one query change by firstName of User", () => {
        const {userStore, providedIndex} = dummyDataUser()
        const query = ref("");
        const results = useFlexSearch(query, providedIndex, userStore);

        query.value = userStore.value[random(0, 4)].firstName;

        expect(results.value).toHaveLength(1);
    });
    it("Should get 1 result one query change by lastName of User", () => {
        const {userStore, providedIndex} = dummyDataUser()
        const query = ref("");
        const results = useFlexSearch(query, providedIndex, userStore);

        query.value = userStore.value[random(0, 4)].lastName;

        expect(results.value).toHaveLength(1);
    });
    it("Should get nothing in results for empty query", () => {
        const {userStore, providedIndex} = dummyDataUser()
        const query = ref("");
        const results = useFlexSearch(query, providedIndex, userStore);

        query.value = "";

        expect(results.value).toHaveLength(0);
    });
    it("should get console warn for no store provided", function () {
        const providedIndex = ref(dummyDocumentIndex([]));
        const query = ref("");
        const consoleSpy = vi.spyOn(console, "warn");

        useFlexSearch(query, providedIndex);

        expect(consoleSpy).toHaveBeenCalledWith(
            "A FlexSearch store was not provided. Your search results will be empty."
        );
    });
    it("should get console warn for no index provided", function () {
        const query = ref("");
        const consoleSpy = vi.spyOn(console, "warn");
        const store = [{}]

        useFlexSearch(query, null, ref(store));

        expect(consoleSpy).toHaveBeenCalledWith(
            "A FlexSearch index was not provided. Your search results will be empty."
        );
    });
    it("should get console warn for no index and no store provided", function () {
        const query = ref("");
        const consoleSpy = vi.spyOn(console, "warn");

        useFlexSearch(query, null);

        expect(consoleSpy).toHaveBeenCalledWith(
            "A FlexSearch index and store was not provided. Your search results will be empty."
        );
    });
});

describe("useFlexSearch Index", () => {
    it("Should get N result one query change by type of Animal", () => {
        const {vegetableStore, providedIndex} = dummyDataAnimal()
        const query = ref("");
        const results = useFlexSearch(query, providedIndex, vegetableStore);
        const randomType = vegetableStore.value[random(0, 4)].type
        const countRandomType = vegetableStore.value.filter(x => x.type === randomType).length

        query.value = randomType

        expect(results.value).toHaveLength(countRandomType);
    });
})