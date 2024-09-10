// //同步测试
(function() {
    const axios = require('axios');
    const URL = 'https://io2.vitechliu.com/api/srvpro'

    this.vpost = async function (path, params) {
        try {
            await axios.request({
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

}).call(this);
