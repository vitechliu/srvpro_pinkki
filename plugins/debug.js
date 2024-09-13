//log
const utils = require('../plugins-pinkki/util.js')

const CTOS_EVENTS = ['UPDATE_DECK', 'PLAYER_INFO', 'JOIN_GAME'];
const STOC_EVENTS = ['CHANGE_SIDE', 'DUEL_START', 'ERROR_MSG'];
const DEBUG = false;

if (DEBUG) {

    for (let e of CTOS_EVENTS) {
        ygopro.ctos_follow(e, false, (buffer, info, client, server, datas) => {
            let infos = ['[CTOS]'];
            infos.push('[' + e + ']')
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
    for (let e2 of STOC_EVENTS) {
        ygopro.stoc_follow(e2, false, (buffer, info, client, server, datas) => {
            let infos = ['[STOC]'];
            infos.push('[' + e2 + ']')
            if (client && client.rid) {
                var room = ROOM_all[client.rid] ?? null;
                if (room) {
                    infos.push('[房间' + room.name + ']')
                }
            }
            if (client && client.name_vpass) {
                infos.push('[玩家' + client.name_vpass + ']')
            }
            console.log(infos.join(''));
        });
    }

}

