// //同步测试
const axios = require('axios');
const URL = 'https://io2.vitechliu.com/api/srvpro'
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinkkiUtil = void 0;
class PinkkiUtil {
    static globalInitDict() {
        if (!global.pinkki_uid_dict) global.pinkki_uid_dict = {}
        if (!global.temp_hint_dict) global.temp_hint_dict = {}
    }

    static async sleep2(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async static getDCDeck(roomname, username) {
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
    async static loadDCContent(client, namevpass, roomId) {
        this.globalInitDict()
        const key = namevpass + '_' + roomId
        const res = global.temp_hint_dict[key] ?? null
        // console.log('loadDC')
        // console.log(global.temp_hint_dict)
        // console.log(key)
        // console.log(res)
        if (res) {
            const firstLine = "您分配到的随机卡组为:" + res.name + "  (ID" + res.id + ")(作者:" + res.author +")"
            ygopro.stoc_send_chat(client, firstLine , ygopro.constants.COLORS.PINK);

            if (res.hint && res.hint.length > 0) {
                await this.sleep2(5000)
                const nextLine = "来自作者的展开提示: " + res.hint
                ygopro.stoc_send_chat(client, nextLine , ygopro.constants.COLORS.PINK);
            }
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
    async static vpost(path, params) {
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
    //
    // optimizeClientDeck(info, client) {
    //     buff_main = (function() {
    //         var j, ref, results;
    //         results = [];
    //         for (i = j = 0, ref = info.mainc; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
    //             results.push(info.deckbuf[i]);
    //         }
    //         return results;
    //     })();
    //     buff_side = (function() {
    //         var j, ref, ref1, results;
    //         results = [];
    //         for (i = j = ref = info.mainc, ref1 = info.mainc + info.sidec; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
    //             results.push(info.deckbuf[i]);
    //         }
    //         return results;
    //     })();
    //     client.main = buff_main;
    //     client.side = buff_side;
    // }
}
exports.PinkkiUtil = PinkkiUtil;
