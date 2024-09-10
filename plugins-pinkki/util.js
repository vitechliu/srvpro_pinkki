// //同步测试
(function() {
    const axios = require('axios');
    const URL = 'https://io2.vitechliu.com/api/srvpro'

    this.ttt1 = function() { return "123"; }
    this.vpost = async function (path, params) {
        await axios.request({
            method: 'post',
            url: URL + path,
            json: params,
            headers: {
                'VAUTH': '114514HECTIV'
            }
        })
    }

}).call(this);
