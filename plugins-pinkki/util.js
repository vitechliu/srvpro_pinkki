// //同步测试
(function() {
    const axios = require('axios');
    const URL = 'https://io2.vitechliu.com/api/srvpro'

    this.globalInitDict = function() {
        if (!global.pinkki_uid_dict) global.pinkki_uid_dict = {}
    }

    this.getDCDeck = async function(roomname, username) {
        const uid = this.uidGet(username)
        try {
            const data = this.vpost('/load', {room: roomname, uid: uid})
            console.log(data)
            return data.data ?? null
        } catch (e) {
            return null
        }
    }
    this.genDeckBuff = function(main, side) {
        let compat_deckbuf = main.concat(side);
        // while (compat_deckbuf.length < 90) {
        //     compat_deckbuf.push(0);
        // }
        return compat_deckbuf
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
