//同步测试
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

ygopro.ctos_follow_after('CHAT', true, async (buffer, info, client, server, datas) => {
    const room = ROOM_all[client.rid] ?? null;
    if (!room) {
        return false;
    }
    ygopro.stoc_send_chat_to_room(room, "cc1", ygopro.constants.COLORS.RED);
    await sleep(1000);
    ygopro.stoc_send_chat_to_room(room, "cc2", ygopro.constants.COLORS.RED);
});


//异步测试
ygopro.ctos_follow_after('CHAT', false, async (buffer, info, client, server, datas) => {
    const room = ROOM_all[client.rid] ?? null;
    if (!room) {
        return false;
    }
    ygopro.stoc_send_chat_to_room(room, "cc3", ygopro.constants.COLORS.RED);
    await sleep(1000);
    ygopro.stoc_send_chat_to_room(room, "cc4", ygopro.constants.COLORS.RED);
});
