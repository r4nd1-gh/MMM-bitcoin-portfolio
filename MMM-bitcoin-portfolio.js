'use strict';

Module.register("MMM-bitcoin-portfolio", {

  result: {},
  defaults: {
    currency: 'usd',
    showBeforePrice: 'Bitcoin price: ',
    exchange: 'bitstamp',
    ownedAmount: 0,
    showBeforeOwned: '',
    updateInterval: 60000,

    // Used to work out url and symbols
    currencyTable: {
      usd: {
        symbol: '$',
        exchangeCode: 'btcusd'
      },
      eur: {
        symbol: '€',
        exchangeCode: 'btceur'
      }
    }
  },

  getStyles: function() {
    return ["MMM-bitcoin-portfolio.css"];
  },

  start: function() {
    this.getPrice();
    this.scheduleUpdate();
  },

  getDom: function() {
    let wrapper = document.createElement("ticker");
    wrapper.className = 'medium bright';
    wrapper.className = 'ticker';

    let data = this.result;
    let symbolElement =  document.createElement("span");
    let currencySymbol = this.config.currencyTable[this.config.currency].symbol;
    let lastPrice = data.last;
    if (lastPrice) {
      symbolElement.innerHTML = this.config.showBeforePrice + ' ' + currencySymbol;
      wrapper.appendChild(symbolElement);
      let priceElement = document.createElement("span");
      priceElement.innerHTML = lastPrice;
      wrapper.appendChild(priceElement);

      if( this.config.ownedAmount > 0 )
      {
        let brElement = document.createElement("br");
        wrapper.appendChild(brElement);

        let portfolioElement = document.createElement("small");
        portfolioElement.innerHTML = this.config.showBeforeOwned + ' ' + currencySymbol +  ' ' + (parseFloat(lastPrice)*parseFloat(this.config.ownedAmount)).toFixed(2);
        wrapper.appendChild(portfolioElement);
      }
    }
    return wrapper;
  },

  scheduleUpdate: function(delay) {
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    const self = this;
    setInterval(function() {
      self.getPrice();
    }, nextLoad);
  },

  getPrice: function () {
    let currency = this.config.currency;
    let url = 'https://www.bitstamp.net/api/v2/ticker/' + this.config.currencyTable[currency].exchangeCode + '/';
    this.sendSocketNotification('GET_BTC_TICKER', url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "BTC_TICKER_RESULT") {
      const self = this;
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});
