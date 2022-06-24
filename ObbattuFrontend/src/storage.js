export function saveObj(key, obj) {
    window.localStorage.setItem(key, JSON.stringify(obj))
}

export function getObj(key) {
    try {
        let json = JSON.parse(window.localStorage.getItem(key))
        return json
    } catch {
        return null
    }
}