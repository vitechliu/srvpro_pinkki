// //同步测试
(function() {
    const axios = require('axios');
    const URL = 'https://io2.vitechliu.com/api/srvpro'

    this.globalInitDict = function() {
        if (!global.pinkki_uid_dict) global.pinkki_uid_dict = {}
        if (!global.temp_hint_dict) global.temp_hint_dict = {}
    }

    this.sleep = async function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    this.getDCDeck = async function(roomname, username) {
        const uid = this.uidGet(username)
        try {
            const data = await this.vpost('/load', {room: roomname, uid: uid, name:username})
            return data.data ?? null
        } catch (e) {
            return null
        }
    }
    this.recordDCContent = function (namevpass, roomname, deckdata) {
        this.globalInitDict()
        const key = namevpass + '_' + roomname
        global.temp_hint_dict[key] = deckdata
    }
    this.loadDCContent = async function (client, namevpass, roomname) {
        this.globalInitDict()
        const key = namevpass + '_' + roomname
        const res = global.temp_hint_dict[key] ?? null
        // console.log('loadDC')
        // console.log(global.temp_hint_dict)
        // console.log(key)
        // console.log(res)
        if (res) {
            const firstLine = "您分配到的随机卡组为:" + res.name + "  (ID" + res.id + ")(作者:" + res.author +")"
            ygopro.stoc_send_chat(client, firstLine , ygopro.constants.COLORS.PINK);

            if (res.hint && res.hint.length > 0) {
                await this.sleep(5000)
                const nextLine = "来自作者的展开提示: " + res.hint
                ygopro.stoc_send_chat(client, nextLine , ygopro.constants.COLORS.PINK);
            }
            delete global.temp_hint_dict[key]
        }
    }
    this.genDeckBuff = function(main, side) {
        let compat_deckbuf = main.concat(side);
        let fin = {}
        let i = 0
        for (let c of compat_deckbuf) {
            fin[i.toString()] = c
            i ++
        }
        return fin
    }
    this.vpost = async function (path, params) {
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

    this.uidSet = function(name, uid) {
        this.globalInitDict()
        global.pinkki_uid_dict[name] = uid
    }
    this.uidGet = function(name) {
        this.globalInitDict()
        return global.pinkki_uid_dict[name] ?? null
    }

    this.roomHasType = function(roomname, type) {
        var room_parameters = roomname.split('#', 2)[0].split(/[,£¬]/);
        var found = false;
        for (var parameter of room_parameters) {
            if (parameter.toUpperCase() === type) {
                return true
            }
        }
        return false
    }

}).call(this);
