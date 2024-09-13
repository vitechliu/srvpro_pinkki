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

async function generateDeck(client, server, room, failMessage) {
    const roomname = room.name
    const username = client.name_vpass
    const deckRaw = await utils.getDCDeck(roomname, username);
    if (deckRaw === null) {
        ygopro.stoc_send_chat(room, failMessage, ygopro.constants.COLORS.PINK);
        return;
    }
    const deck = deckRaw.deck
    utils.recordDCContent(username, roomname, deckRaw)
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
    // utils.optimizeClientDeck(updateInfo, client)
    console.log("UpdateInfo:");
    console.log(updateInfo)
    // const promise = ygopro.ctos_send(server, "UPDATE_DECK", updateInfo);
    // console.log(promise)

    ygopro.ctos_send(server, "UPDATE_DECK", updateInfo);

}

ygopro.ctos_follow_after("UPDATE_DECK", true, async (buffer, info, client, server, datas) => {
    console.log('RealInfo:');
    let db = info.deckbuf
    let db0 = db['0']

    console.log('CurrentClientMain')
    console.log(client.main)
    console.log('info.deckbuf')
    console.log(info.deckbuf)
    // ygopro.ctos_send(server, "UPDATE_DECK", info);
    // return null;


    var room = ROOM_all[client.rid];
    if (!room) return false;
    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN)  {
        return null;
    }
    if (client.is_local) return null;
    if (!utils.roomHasType(room.name, 'DC')) return null;

    await generateDeck(client, server, room, "获取随机卡组失败，使用自带卡组");
    return true;
});
ygopro.stoc_follow_after("CHANGE_SIDE", true, async (buffer, info, client, server, datas) => {
    var room = ROOM_all[client.rid];
    if (!room) return false;
    if (client.is_local) return null;
    if (!utils.roomHasType(room.name, 'DC')) return null;

    await generateDeck(client, server, room, "更新随机卡组失败，使用自带卡组");
    return true;
});
ygopro.stoc_follow_after("ERROR_MSG", true, async (buffer, info, client, server, datas) => {
    console.log(info)
    // console.log(datas)
    if (info.msg === 2 && info.code === 1610612736) {
        return true;
    }
});
