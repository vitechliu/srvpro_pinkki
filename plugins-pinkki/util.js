// //同步测试
const axios = require('axios');
const moment = require("moment/moment");
const MAIN_ROOM = 'TM500,DC,T#54320';
const URL = 'https://io2.vitechliu.com/api/srvpro'
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinkkiUtil = void 0;
class PinkkiUtil {
    static globalInitDict() {
        if (!global.pinkki_uid_dict) global.pinkki_uid_dict = {}
        if (!global.temp_hint_dict) global.temp_hint_dict = {}
        if (!global.start_time_dict) global.start_time_dict = {}
        if (!global.dc_decks) global.dc_decks = []
        if (!global.dc_decks_loading) global.dc_decks_loading = false
    }


    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static async getDCDeck(roomname, username) {
        const uid = this.uidGet(username)
        try {
            const data = await this.vpost('/load', {room: roomname, uid: uid, name:username})
            return data.data ?? null
        } catch (e) {
            return null
        }
    }
    static recordDCContent(namevpass, roomId, deckdata) {
        const key = namevpass + '_' + roomId
        global.temp_hint_dict[key] = deckdata
    }
    static recordStartTime(roomId) {
        global.start_time_dict[roomId] = moment().toDate()
    }
    static pullStartTime(roomId) {
        const res = global.start_time_dict[roomId] ?? null
        if (res) delete global.start_time_dict[roomId]
        return res
    }
    static async loadDCContent(client, namevpass, roomId) {
        const key = namevpass + '_' + roomId
        const res = global.temp_hint_dict[key] ?? null
        if (res) {
            const firstLine = "您分配到的随机卡组为:" + res.name + "  (ID" + res.id + ")(作者:" + res.author +")"
            ygopro.stoc_send_chat(client, firstLine , ygopro.constants.COLORS.PINK);

            if (res.hint && res.hint.length > 0) {
                await this.sleep(5000)
                const nextLine = "来自作者的展开提示: " + res.hint
                ygopro.stoc_send_chat(client, nextLine , ygopro.constants.COLORS.PINK);
            }
        }
    }
    static removeDCContent(namevpass, roomId) {
        const key = namevpass + '_' + roomId
        const res = global.temp_hint_dict[key] ?? null
        if (res) {
            delete global.temp_hint_dict[key]
        }
    }
    static genDeckBuff(main, side) {
        let compat_deckbuf = main.concat(side);
        let fin = {}
        let i = 0
        for (let c of compat_deckbuf) {
            fin[i.toString()] = c
            i ++
        }
        return fin
    }
    static async vpost(path, params) {
        try {
            return await axios.request({
                method: 'post',
                url: URL + path,
                data: params,
                headers: {
                    'VAUTH': '114514HECTIV'
                }
            })
        } catch (e) {
            console.error(e.message)
            return null
        }
    }
    static uidSet(name, uid) {
        global.pinkki_uid_dict[name] = uid
    }
    static uidGet(name) {
        return global.pinkki_uid_dict[name] ?? null
    }
    static roomHasType(roomname, type) {
        var room_parameters = roomname.split('#', 2)[0].split(/[,£¬]/);
        var found = false;
        for (var parameter of room_parameters) {
            if (parameter.toUpperCase() === type) {
                return true
            }
        }
        return false
    }

    static async preloadDecks() {
        const preloadCount = 20; //比20小就需要预加载
        if (global.dc_decks.length > preloadCount) return;
        if (global.dc_decks_loading) return;
        global.dc_decks_loading = true;
        console.log("卡组不足，加载50套卡组")
        const data = await this.vpost('/load2', {})
        if (data && data.decks) {
            for (let deck of data.decks) {
                global.dc_decks.push(deck)
            }
        }
        global.dc_decks_loading = false;
    }
    static async deckLog(room, username, deckId) {
        const uid = this.uidGet(username)
        await this.vpost('/deckLog', {
            room: room.name,
            name: username,
            uid: uid,
            deckId: deckId
        })
    }

    static async logDCDuel(room) {
        if (!this.roomHasType(room.name, 'DC')) return;
        const roomId = room.process_pid
        // console.log("RoomWinner")
        // console.log(room.winner)
        let playerInfos = []
        let isDouble = room.dueling_players.length === 4
        for (let player of room.dueling_players) {
            const key = player.name_vpass + '_' + roomId
            const res = global.temp_hint_dict[key] ?? null
            if (!res) {
                console.log("恢复卡组数据失败")
                continue;
            }
            this.removeDCContent(player.name_vpass, roomId)

            let isWinner = false;
            if (isDouble) {
                if (room.winner === 1 || room.winner === 0) isWinner = player.pos <= 1
                else if (room.winner === 2 || room.winner === 3) isWinner = player.pos >= 2
            } else {
                isWinner = player.pos === room.winner
            }


            playerInfos.push({
                uid: this.uidGet(player.name_vpass),
                name: player.name,
                pos: player.pos,
                realName: player.name_vpass,
                deckId: res.id,
                isWinner: isWinner,
                ip: player.ip,
                isFirst: player.is_first,
            })
        }
        const data = {
            room: room.name,
            roomId: room.process_pid,
            roomStartTime: this.pullStartTime(roomId),
            playerInfos: playerInfos,
        }
        await this.vpost('/duelLog', data)

    }
}
exports.PinkkiUtil = PinkkiUtil;
