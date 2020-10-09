const request = require('request');
require("./routes/routes.js")();
var pg = require('pg');
var bodyParser = require("body-parser");

var connectionString = "postgres://ale:pippo@localhost:5432/postgres";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

var db;
var minutes = 5, the_interval = minutes * 60 * 1000;

module.exports = function(){
  this.startAlexa = function(){
    setInterval(function() {
      console.log("I am doing my 5 minutes check");
    
          request('https://api.coingecko.com/api/v3/coins?order=market_cap_desc&per_page=100&localization=false', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
    
            if(getdatabase() == 0){
              db = 1
            }else
              db = 0;
    
              pgClient.query('TRUNCATE TABLE public.coinmarketcap'+db);
              var queryText = 'INSERT INTO public.coinmarketcap'+db+'(id, name, symbol, website_slug, rank, circulating_supply, total_supply, price_usd, total_volume_usd, market_cap_usd, percent_change_1h_usd, percent_change_24h_usd, percent_change_7d_usd, price_btc, total_volume_btc, market_cap_btc, percent_change_1h_btc, percent_change_24h_btc, percent_change_7d_btc) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)';
              
              //parse del json
              var restCall = res.body;
              var arr = restCall;
    
              //dalla query arrivano le prime 100 crypto
              for(let i = 0; i < 100; i++){
                //insert crypto in db
                pgClient.query(queryText, [arr[i].market_data.market_cap_rank, arr[i].id, arr[i].symbol, arr[i].id, arr[i].market_data.market_cap_rank, arr[i].market_data.circulating_supply, arr[i].market_data.total_supply, arr[i].market_data.current_price.usd, arr[i].market_data.total_volume.usd, arr[i].market_data.market_cap.usd, arr[i].market_data.price_change_percentage_1h_in_currency.usd, arr[i].market_data.price_change_percentage_24h_in_currency.usd, arr[i].market_data.price_change_percentage_7d_in_currency.usd, 
                  arr[i].market_data.current_price.btc, arr[i].market_data.total_volume.btc, arr[i].market_data.market_cap.btc, arr[i].market_data.price_change_percentage_1h_in_currency.btc, arr[i].market_data.price_change_percentage_24h_in_currency.btc, arr[i].market_data.price_change_percentage_7d_in_currency.btc], function(err, result) {
                  if(err){
                      console.log(err);
                  } //handle error
                  else {
                    console.log("creato record");
                  }
                });
              }
              //switcha il db in modo da puntare a quello aggiornato
              changedatabase(getdatabase());
    
          });
    }, the_interval);

  }
}
