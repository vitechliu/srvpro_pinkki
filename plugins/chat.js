// noinspection JSUnusedLocalSymbols

const utils = require('../plugins-pinkki/util.js').PinkkiUtil

ygopro.ctos_follow_before('CHAT', true, async function(buffer, info, client, server, datas) {
    const room = ROOM_all[client.rid] ?? null;
    if (!room) return false;
    const msg = global._.trim(info.msg);
    const isCMD = global._.startsWith(msg, "/");
    const cmd = msg.split(' ');
    const cmdFirst = cmd[0] ?? null;
    const BASE_COMMANDS = ['/投降', '/surrender', '/ai', '/roomname', '/refresh', '/test'];
    switch (msg) {
        case '神秘瓜巴指令':
            ygopro.stoc_send_hint_card_to_room(room, 11012887)
            return true;
    }

    if (!isCMD || BASE_COMMANDS.includes(cmdFirst)) {
        return false;
    }



    const uid = utils.uidGet(client.name_vpass)
    const res = await utils.vpost('/chat', {
        name: client.name_vpass,
        uid: uid,
        room: room.name,
        roomId: room.process_pid,
        content: msg
    })
    // console.log(res)
    if (res && res.data.type) {
        const type = res.data.type
        const message = res.data.response ?? null
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
    return true;
});
