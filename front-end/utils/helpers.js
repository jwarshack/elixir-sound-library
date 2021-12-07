
export function shortAddress(addr) {
    const first = addr.slice(0, 4)
    const last = addr.slice(-4)
    return `${first}...${last}`
}