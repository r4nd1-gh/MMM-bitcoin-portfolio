let NodeHelper = require('node_helper');
let request = require('request');

module.exports = NodeHelper.create({
  getTickers: function (url) {
      const self = this;

      request({ url: url, method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            let result = JSON.parse(body);
            self.sendSocketNotification('BTC_TICKER_RESULT', result);
          }
      });
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_BTC_TICKER') {
      this.getTickers(payload);
    }
  }

});
