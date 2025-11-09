import OBR from "@owlbear-rodeo/sdk"

let isReady = false


async function init() {
    if (isReady) return
    OBR.onReady(() => isReady = true)
    while (!isReady) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
}


async function getPlayer() {
    if (!isReady) await init()
    let metadata = await OBR.player.getMetadata()
    let playerId = await OBR.player.getId()
    let sheetKey = "me.vierdant.dndsheet/sheet-" + playerId

    let localStorageData = window.localStorage.getItem(sheetKey)
    if (localStorageData) {
        localStorageData = JSON.parse(localStorageData)
    } else {
        localStorageData = JSON.parse("{}")
    }

    if (!metadata[sheetKey]) {
        const playerName = await OBR.player.getName()
        const defaultRecord = {
            id: playerId,
            name: playerName,
            data: localStorageData
        }
        await OBR.player.setMetadata({
            [sheetKey]: defaultRecord
        })
        // Retrieve updated metadata after set
        metadata = await OBR.player.getMetadata()
        // Ensure it is present
        if (!metadata[sheetKey]) {
            // Shouldn't ever happen but fallback
            return defaultRecord
        }
    }

    // At this point, metadata[sheetKey] is guaranteed to exist (either was present or just set)
    return metadata[sheetKey]
}


async function saveCharacter(data: any) {
    if (!isReady) await init()
    let playerId = await OBR.player.getId()
    let sheetKey = "me.vierdant.dndsheet/sheet-" + playerId

    await OBR.player.setMetadata({
        [sheetKey]: {
            id: playerId,
            name: await OBR.player.getName(),
            data: data
        }
    })

    window.localStorage.setItem(sheetKey, JSON.stringify(data))
}

async function removePlayer() {
    if (!isReady) await init()
    let metadata = await OBR.player.getMetadata()
    let playerId = await OBR.player.getId()
    let sheetKey = "me.vierdant.dndsheet/sheet-" + playerId

    if (metadata[sheetKey]) {
        await OBR.player.setMetadata({
            [sheetKey]: null
        })
    }
}


export default {
    init,
    getPlayer,
    saveCharacter,
    removePlayer
}