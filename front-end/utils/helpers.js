export function shortAddress(addr) {
    const first = addr.slice(0, 4)
    const last = addr.slice(-4)
    return `${first}...${last}`
}

export async function getAddressOrENS(addr, provider) {
    if (!provider) return addr

    const name = await provider.lookupAddress(addr)
    if (!name) return shortAddress(addr)
    return name
}