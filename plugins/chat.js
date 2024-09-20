// noinspection JSUnusedLocalSymbols

const utils = require('../plugins-pinkki/util.js').PinkkiUtil

ygopro.ctos_follow_after('CHAT', false, async function(buffer, info, client, server, datas) {
    const room = ROOM_all[client.rid] ?? null;
    if (!room) return;
    const msg = info.msg.trim();
    if (msg.substring(0, 1) !== "/") return;

    const uid = utils.uidGet(client.name_vpass)
    const res = await utils.vpost('/chat', {
        name: client.name_vpass,
        uid: uid,
        room: room.name,
        roomId: room.process_pid,
        content: msg
    })
    if (res && res.data.type) {
        const type = res.data.type
        const message = res.data.message ?? null
        let color = res.data.color ?? null
        if (!color) {
            color = ygopro.constants.COLORS.PINK
        }
        if (!message) return;
        if (type === 1) {
            //回复自己
            ygopro.stoc_send_chat(client, message, color);
        } else if (type === 2) {
            //发送给大厅
            ygopro.stoc_send_chat_to_room(room, message, color);
        }
    }
});
