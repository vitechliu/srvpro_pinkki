//同步测试
const utils = require('../plugins-pinkki/util.js')


ygopro.stoc_follow_after("DUEL_START", false, async (buffer, info, client, server, datas) => {
    var room = ROOM_all[client.rid];
    if (!room) return null;
    if (!utils.roomHasType(room.name, 'DC')) return null;
    const roomname = room.name
    const username = client.name_vpass
    await utils.loadDCContent(client, username, roomname)
    return true;
});
ygopro.ctos_follow_after("UPDATE_DECK", true, async (buffer, info, client, server, datas) => {
    console.log(info);
    var room = ROOM_all[client.rid];
    if (!room) return false;
    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN)  {
        return null;
    }

    if (client.is_local) return null;

    if (!utils.roomHasType(room.name, 'DC')) return null;


    const roomname = room.name
    const username = client.name_vpass
    const deckRaw = await utils.getDCDeck(roomname, username);
    if (deckRaw === null) {
        ygopro.stoc_send_chat(room, "获取随机卡组失败，使用自带卡组", ygopro.constants.COLORS.PINK);
        return true;
    }

    const deck = deckRaw.deck
    utils.recordDCContent(username, roomname, deckRaw)
    client.main = deck.main.concat(deck.extra);
    client.side = deck.side;
    // console.log("ClientMainAfter:" + client.main)
    ygopro.stoc_send_chat(client, "成功获取随机卡组", ygopro.constants.COLORS.PINK);

    let compat_deckbuf = utils.genDeckBuff(client.main, client.side)
    ygopro.ctos_send(server, "UPDATE_DECK", {
        mainc: client.main.length,
        sidec: client.side.length,
        deckbuf: compat_deckbuf
    });
    return true;
});
ygopro.stoc_follow_after("CHANGE_SIDE", true, async (buffer, info, client, server, datas) => {
    var room = ROOM_all[client.rid];
    if (!room) return false;
    if (client.is_local) return null;
    if (!utils.roomHasType(room.name, 'DC')) return null;


    const roomname = room.name
    const username = client.name_vpass
    const deckRaw = await utils.getDCDeck(roomname, username);
    if (deckRaw === null) {
        ygopro.stoc_send_chat(room, "更新随机卡组失败，使用自带卡组", ygopro.constants.COLORS.PINK);
        return null;
    }

    const deck = deckRaw.deck
    utils.recordDCContent(username, roomname, deckRaw)
    client.main = deck.main.concat(deck.extra);
    client.side = deck.side;
    ygopro.stoc_send_chat(client, "成功获取随机卡组", ygopro.constants.COLORS.PINK);

    let compat_deckbuf = utils.genDeckBuff(client.main, client.side)
    ygopro.ctos_send(server, "UPDATE_DECK", {
        mainc: client.main.length,
        sidec: client.side.length,
        deckbuf: compat_deckbuf
    });
    return true;
});
