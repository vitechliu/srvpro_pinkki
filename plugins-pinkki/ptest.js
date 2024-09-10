//同步测试
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
ygopro.ctos_follow_before('JOIN_GAME', false, async (buffer, info, client, server, datas) => {
    /** @type {Room} */
    const room = ROOM_all[client.rid] ?? null;
    if (!room) return false;
    console.log('[JOIN_GAME]')
    console.log('RoomName: ' + room.name)
    

    ygopro.stoc_send_chat_to_room(room, "cc1", ygopro.constants.COLORS.RED);
});
