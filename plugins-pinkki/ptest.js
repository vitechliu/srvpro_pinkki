//同步测试
const utils = require('../plugins-pinkki/util.js')

ygopro.stoc_follow_before('JOIN_GAME', false, async (buffer, info, client, server, datas) => {
    /** @type {Room} */
    const room = ROOM_all[client.rid] ?? null;
    if (!room) return false;
    console.log('[JOIN_GAME]' + client.name_vpass + "加入了" + room.name)
    // console.log('RoomName: ' + room.name)
    const res = await utils.vpost('/auth', {name: client.name_vpass, room: room.name})
    // ygopro.stoc_send_chat_to_room(room, "cc1", ygopro.constants.COLORS.RED);
    console.log(res)
});
