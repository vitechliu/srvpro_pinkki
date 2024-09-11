// //同步测试
(function() {
    const axios = require('axios');
    const URL = 'https://io2.vitechliu.com/api/srvpro'

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
