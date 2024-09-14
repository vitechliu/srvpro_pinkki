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
        this.globalInitDict()
        const key = namevpass + '_' + roomId
        global.temp_hint_dict[key] = deckdata
    }
    static async recordStartTime(roomId) {
        this.globalInitDict()
        global.start_time_dict[roomId] = moment().toDate()
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
        this.globalInitDict()
        global.pinkki_uid_dict[name] = uid
    }
    static uidGet(name) {
        this.globalInitDict()
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

    static async logDCDuel(room) {
        if (!this.roomHasType(room.name, 'DC')) return;
        this.log54320Room(room, '暂无').then(res => {})
        const roomId = room.process_pid
        let playerInfos = []
        for (let player of room.dueling_players) {
            const key = namevpass + '_' + roomId
            const res = global.temp_hint_dict[key] ?? null
            if (!res) {
                console.log("恢复卡组数据失败")
                continue;
            }
            this.removeDCContent(player.name_vpass, roomId)

            let isWinner = false;
            if (room.winner <= 1) isWinner = player.pos <= 1
            else isWinner = player.pos >= 2

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
            playerInfos: playerInfos,
        }
        await this.vpost('/roomLog', data)

    }

    static async log54320Room(room, players = null) {
        if (room.name === MAIN_ROOM) {
            if (players === null) {
                players = '暂无'
                if (room.players.length > 0) {
                    players = room.players.map(x => x.name).join(',')
                }
            }
            await this.vpost('/logRoom', {players})
        }
    }
}
exports.PinkkiUtil = PinkkiUtil;
