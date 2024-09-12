//同步测试
const utils = require('../plugins-pinkki/util.js')

ygopro.ctos_follow_after("UPDATE_DECK", true, async (buffer, info, client, server, datas) => {
    var room = ROOM_all[client.rid];
    console.log('stage1')
    if (!room) return null;
    console.log('stage2')

    if (room.duel_stage !== ygopro.constants.DUEL_STAGE.BEGIN)  return null;
    console.log('stage3')

    if (client.is_local) return null;
    console.log('stage4')

    if (!utils.roomHasType(room.name, 'DC')) return null;
    console.log('stage5')

    console.log("ClientMain:" + client.main)
    console.log("ClientSide:" + client.side)

    return true;


    const roomname = room.name
    const username = client.name_vpass
    const deck = await utils.getDeck(roomname, username);
    if (deck === null) {
        ygopro.stoc_send_chat_to_room(room, "获取随机卡组失败，使用自带卡组", ygopro.constants.COLORS.PINK);
        return true;
    }

    //
    // client.main = deck.main.concat(deck.extra);
    // client.side = deck.side;
    //
    // var compat_deckbuf = buff_main_new.concat(buff_side_new);
    // while (compat_deckbuf.length < 90) {
    //     compat_deckbuf.push(0);
    // }
    //
    // ygopro.ctos_send(server, "UPDATE_DECK", {
    //     mainc: client.main.length,
    //     sidec: client.side.length,
    //     deckbuf: compat_deckbuf
    // });
    // return true;
});
