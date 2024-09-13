//log
const utils = require('../plugins-pinkki/util.js')

const CTOS_EVENTS = ['UPDATE_DECK', 'PLAYER_INFO', 'JOIN_GAME'];
const STOC_EVENTS = ['GAME_MSG', 'CHANGE_SIDE'];
const DEBUG = true;

if (DEBUG) {

    for (let e of CTOS_EVENTS) {
        ygopro.ctos_follow_after(e, false, async (buffer, info, client, server, datas) => {
            let infos = ['[CTOS]'];
            if (client.rid) {
                var room = ROOM_all[client.rid] ?? null;
                if (room) {
                    infos.push('[房间' + room.name + ']')
                }
            }
            if (client.name_vpass) {
                infos.push('[玩家' + client.name_vpass + ']')
            }
            console.log(infos.join(''));
        });
    }
    for (let e of STOC_EVENTS) {
        ygopro.ctos_follow_after(e, false, async (buffer, info, client, server, datas) => {
            let infos = ['[STOC]'];
            if (client.rid) {
                var room = ROOM_all[client.rid] ?? null;
                if (room) {
                    infos.push('[房间' + room.name + ']')
                }
            }
            if (client.name_vpass) {
                infos.push('[玩家' + client.name_vpass + ']')
            }
            console.log(infos.join(''));
        });
    }

}

