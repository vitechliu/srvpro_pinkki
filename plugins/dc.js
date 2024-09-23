//同步测试
// noinspection JSUnusedLocalSymbols

const utils = require('../plugins-pinkki/util.js').PinkkiUtil

// ygopro.ctos_follow_after('CREATE_GAME', true, async (buffer, info, client, server, datas) => {
//     const room = getDCRoomFromPlayerClient(client);
//     if (!room) return null;
//     room.hostinfo.rule = 5
// });
function getDCRoomFromPlayerClient(client) {
    if (client.is_local) return false;
    let room = ROOM_all[client.rid] ?? false;
    if (!room) return false;
    if (!utils.roomHasType(room.name, 'DC')) return false;
    return room
}
ygopro.stoc_follow_after("DUEL_START", false, async (buffer, info, client, server, datas) => {
    const room = getDCRoomFromPlayerClient(client);
    if (!room) return null;
    const username = client.name_vpass
    utils.recordStartTime(room.process_pid)
    await utils.loadDCContent(client, username, room.process_pid)
});
function generateDeckV2(client, server, room, failMessage) {
    const roomname = room.name
    const username = client.name_vpass
    if (global.dc_decks.length <= 0) {
        ygopro.stoc_send_chat_to_room(room, failMessage, ygopro.constants.COLORS.RED);
        return;
    }
    const deckRaw = global.dc_decks.shift()
    const deck = deckRaw.deck
    utils.recordDCContent(username, room.process_pid, deckRaw)
    const main = deck.main.concat(deck.extra);
    const side = deck.side;
    ygopro.stoc_send_chat(client, "成功获取随机卡组", ygopro.constants.COLORS.PINK);
    let compat_deckbuf = utils.genDeckBuff(main, side)
    client.main = main
    client.side = side
    const updateInfo = {
        mainc: main.length,
        sidec: side.length,
        deckbuf: compat_deckbuf
    }
    ygopro.ctos_send(client.server, "UPDATE_DECK", updateInfo);
    utils.preloadDecks().then(r => {})
    utils.deckLog(roomname, username, deckRaw.id).then(r => {})
}
// async function generateDeck(client, server, room, failMessage) {
//     const roomname = room.name
//     const username = client.name_vpass
//     const deckRaw = await utils.getDCDeck(roomname, username);
//     if (deckRaw === null) {
//         ygopro.stoc_send_chat(room, failMessage, ygopro.constants.COLORS.PINK);
//         return;
//     }
//     const deck = deckRaw.deck
//     utils.recordDCContent(username, room.process_pid, deckRaw)
//     const main = deck.main.concat(deck.extra);
//     const side = deck.side;
//     ygopro.stoc_send_chat(client, "成功获取随机卡组", ygopro.constants.COLORS.PINK);
//     let compat_deckbuf = utils.genDeckBuff(main, side)
//     client.main = main
//     client.side = side
//     const updateInfo = {
//         mainc: main.length,
//         sidec: side.length,
//         deckbuf: compat_deckbuf
//     }
//     // utils.optimizeClientDeck(updateInfo, client)
//     // console.log("UpdateInfo:");
//     // console.log(updateInfo)
//     // const promise = ygopro.ctos_send(server, "UPDATE_DECK", updateInfo);
//     // console.log(promise)
//
//     ygopro.ctos_send(client.server, "UPDATE_DECK", updateInfo);
// }

ygopro.stoc_follow_after('JOIN_GAME', true, async (buffer, info, client, server, datas) => {
    const room = getDCRoomFromPlayerClient(client);
    if (!room) return null;
    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN) return null;
    generateDeckV2(client, server, room, "获取随机卡组失败，使用自带卡组");
});
ygopro.ctos_follow_after("UPDATE_DECK", true, async (buffer, info, client, server, datas) => {
    const room = getDCRoomFromPlayerClient(client);
    if (!room) return null;
    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN) return null;

    const uid = utils.uidGet(client.name_vpass)
    if (uid === null) {
        const kickedName = client.name;
        //踢出
        ygopro.stoc_send_chat_to_room(room, "[" + kickedName + "]被移出了房间(没有绑定账号，并且找不到同名群账号)", ygopro.constants.COLORS.RED);
        global.CLIENT_kick(client);
        return '_cancel';
    }
    return true; //跳过DC房间的自主卡组提交阶段
});

// ygopro.stoc_follow_after("CHANGE_SIDE", true, async (buffer, info, client, server, datas) => {
//     //todo test
//     const room = getDCRoomFromPlayerClient(client);
//     if (!room) return null;
//     await generateDeck(client, server, room, "更新随机卡组失败，使用自带卡组");
//     return true;
// });


// ygopro.stoc_follow_after("ERROR_MSG", true, async (buffer, info, client, server, datas) => {
//     console.log(info)
//     // console.log(datas)
//     if (info.msg === 2 && info.code === 1610612736) {
//         return true;
//     }
// });
