var fs = require('fs');
const https = require('https');

//---Postgres
var pg = require('pg');
var connectionString = "postgres://ale:pippo@localhost:5432/postgres";
var pgClient = new pg.Client(connectionString);
pgClient.connect();
var database = 0;

module.exports = function() {
  this.changedatabase = function (id) {
    if(id==0)
      database = 1;
    else {
      database = 0;
    }};
  this.getdatabase = function() {return database}
  this.appRouter = function (app) {
    //---Get Price
    app.get("/getprice/:refcurrency/:cryptocurrency", function (req, res) {//funziona
      let refcurrency = req.params.refcurrency
      let cryptocurrency = req.params.cryptocurrency
      if(refcurrency=='bitcoin'){
        pgClient.query('SELECT price_btc FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
          if(err) {
            res.status(400).send({error: err});
            return console.error('Query error', err);
          }
          res.status(200).send({price: result.rows[0]});
        });
      }else{
        pgClient.query('SELECT price_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
          if(err) {
            res.status(400).send({error: err});
            return console.error('Query error', err);
          }
          res.status(200).send({price: result.rows[0]});
        });
      }
    });

    app.get("/getinfo/:cryptocurrency", function (req, res) {//funziona
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT rank, circulating_supply, total_supply FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({rank: result.rows[0], circulating_supply: result.rows[1], total_supply: result.rows[2], max_supply: result.rows[3]});
      });
    });

    app.get("/getvolume24h/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT volume_24h_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({volume24h: result.rows[0]});
      });
    });

    app.get("/getmarketcapusd/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT market_cap_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({market_cap_usd: result.rows[0]});
      });
    });

    app.get("/getpercentchangeall/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT percent_change_1h_usd, percent_change_24h_usd, percent_change_7d_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({percent_change_1h_usd: result.rows[0], percent_change_24h_usd: result.rows[1], percent_change_7d_usd: result.rows[2]});
      });
    });

    app.get("/getpercentchange1h/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT percent_change_1h_usd FROM public.coinmarketcap'+database+' WHERE name = '+'"'+cryptocurrency+'"', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({percent_change_1h_usd: result.rows[0]});
      });
    });

    app.get("/getpercentchange24h/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency
      pgClient.query('SELECT percent_change_24h_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({percent_change_24h_usd: result.rows[0]});
      });
    });

    app.get("/getpercentchange7d/:cryptocurrency", function (req, res) {
      let cryptocurrency = req.params.cryptocurrency;
      pgClient.query('SELECT percent_change_7d_usd FROM public.coinmarketcap'+database+' WHERE name = '+cryptocurrency, function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({percent_change_7d_usd: result.rows[0]});
      });
    });

    app.get("/getbestperformer1h", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_1h_usd FROM public.coinmarketcap'+database+' order by percent_change_1h_usd desc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({best_1h: result.rows[0]});
      });
    });

    app.get("/getbestperformer24h", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_24h_usd FROM public.coinmarketcap'+database+' order by percent_change_24h_usd desc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({best_24h: result.rows[0]});
      });
    });

    app.get("/getbestperformer7d", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_7d_usd FROM public.coinmarketcap'+database+' order by percent_change_7d_usd desc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({best_7d: result.rows[0]});
      });
    });

    app.get("/getworstperformer1h", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_1h_usd FROM public.coinmarketcap'+database+' order by percent_change_1h_usd asc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({worst_1h: result.rows[0]});
      });
    });

    app.get("/getworstperformer24h", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_24h_usd FROM public.coinmarketcap'+database+' order by percent_change_24h_usd asc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({worst_24h: result.rows[0]});
      });
    });

    app.get("/getworstperformer7d", function (req, res) {
      pgClient.query('SELECT name, rank, price_usd, percent_change_7d_usd FROM public.coinmarketcap'+database+' order by percent_change_7d_usd asc limit 1', function(err, result) {
        if(err) {
          res.status(400).send({error: err});
          return console.error('Query error', err);
        }
        res.status(200).send({worst_7d: result.rows[0]});
      });
    });

  };
}
