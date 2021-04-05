const FTXRest = require('./');

const ftx = new FTXRest({
    key: "TAQHo0l39IDy64JYD5AfpI70SR3Pu8-g_TtcFWWM",
    secret: "w0y0JMexRUJdFMjfh61o62xarMnb06OgZTabQbG9",
    subaccount:"YedekOTO"
});


const output = {
    tum_coin_gecmisini_getir:function( data ){
        let pr = new Promise((resolve, reject) => {
            (async() => {
                params = {
                    method: 'GET',
                    path: '/futures',
                };
                console.log( {params} );
                ftx.request(params).then(r=>{
                    resolve( r.result );
                });
            })()
        });
        return pr;
    },
    emirleri_iptal_et: function( market_name ){
        let pr = new Promise((resolve, reject) => {
            (async() => {
                ftx.request({
                    method: 'DELETE',
                    path: '/orders',
                    data: {
                        "market": market_name
                    }
                }).then(r=>{
                    resolve(r);
                });
            })()
        });
        return pr;
    },
    gecmis_getir:function( data ){
        let pr = new Promise((resolve, reject) => {
            (async() => {
                let suan = parseInt(new Date().getTime() / 1000 );
                params = {
                    method: 'GET',
                    path: '/indexes/'+data["market_name"]+'/candles?resolution='+data["resolution"]+'&limit='+data["limit"]+'&start_time='+ ( suan - (data["ne_zamandan_itibaren"]) ) +'&end_time='+suan,
                };
                console.log( {params} );
                ftx.request(params).then(r=>{
                    let price = { aralik:data.aralik, market_name:data["market_name"], top:0, low:99999999999999999999999999 }
                    r.result.forEach((v, k) => {
                        if ( v.high > price.top ){
                            price.top = v.high;
                        }
                        if ( v.low < price.low ){
                            price.low = v.low;
                        }
                        
                    });
                    resolve( price, r.result );
                });
            })()
        });
        return pr;
    },
    dolar_getir: function(kac_dolarlik, kactan){
        return (kac_dolarlik/kactan).toFixed(6);
    },
    bakiye_getir: async() => {
        let pr = new Promise((resolve, reject) => {
            ftx.request({
                method: 'GET',
                path: '/wallet/balances',
               }).then(r=>{
                    resolve( r.result[0].total );
               });
        });
        return pr;
    },
    buy: async function( kac_dolarlik, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {

                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": this.dolar_getir(kac_dolarlik, kactan),
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                    }
                }).then(r=>{
                    resolve(r.result);
                });
        });

        return pr;
    },
    sell: async function(alinan_coin_adedi, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": alinan_coin_adedi,
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },
    short_sell: async function( kac_dolarlik, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": this.dolar_getir(kac_dolarlik, kactan),
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },    
    stop: async function(alinan_coin_adedi, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/conditional_orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "triggerPrice": kactan,
                        "size": alinan_coin_adedi,
                        "type": "stop",
                        "reduceOnly": reduceType,
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },

    get_process: async function( process_id ){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/orders/'+process_id,
                }).then(r=>{
                    resolve(r.result);
                });
        });
        return pr;
    },
    any_proces_status: async function(){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/orders?market='+process.argv[3]
                }).then(r=>{
                    if ( r.result.length > 0 ){
                        resolve(1);
                    }
                    else{
                        resolve(0);
                    }
                });
        });
        return pr;
    },
    get_price: async function(){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/markets/'+process.argv[3]
                }).then(r=>{
                   resolve( r.result.price );
                });
        });
        return pr;
    }    
}


module.exports = output;
