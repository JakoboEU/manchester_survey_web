
const localStoragePersonId = 'person_id';

export function fetchPersonId() {
    return JSON.parse(localStorage.getItem(localStoragePersonId)) || null
}

export function storePersonId(personId) {
    localStorage.setItem(localStoragePersonId, JSON.stringify(personId));
}

export function deletePersonId() {
    localStorage.removeItem(localStoragePersonId)
}