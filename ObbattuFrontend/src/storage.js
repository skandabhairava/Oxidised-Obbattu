export function saveObject(key, obj) {
    window.localStorage.setItem(key, JSON.stringify(obj))
}

export function getObject(key) {
    try {return JSON.parse(window.localStorage.getItem(key))}
    catch {return null}
}