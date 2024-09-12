//同步测试
const utils = require('../plugins-pinkki/util.js')

ygopro.ctos_follow_after("UPDATE_DECK", true, async (buffer, info, client, server, datas) => {
    var room = ROOM_all[client.rid];
    if (!room) return null;

    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN)  return null;

    if (client.is_local) return null;

    if (!utils.roomHasType(room.name, 'DC')) return null;

    console.log("ClientMain:" + client.main)
    console.log("ClientSide:" + client.side)


    const roomname = room.name
    const username = client.name_vpass
    const deck = await utils.getDCDeck(roomname, username);
    if (deck === null) {
        ygopro.stoc_send_chat_to_room(room, "获取随机卡组失败，使用自带卡组", ygopro.constants.COLORS.PINK);
        return true;
    }

    client.main = deck.main.concat(deck.extra);
    client.side = deck.side;
    console.log("ClientMainAfter:" + client.main)
    console.log("ClientSideAfter:" + client.side)

    let compat_deckbuf = utils.genDeckBuff(client.main, client.side)
    ygopro.ctos_send(server, "UPDATE_DECK", {
        mainc: client.main.length,
        sidec: client.side.length,
        deckbuf: compat_deckbuf
    });
    return true;
});
