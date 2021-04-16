const ftx_rest= require("./ekler/ftx-rest");
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: 'L0vSbia0FinQCHzqCEwjtdvpUoGm4ELkmJnhJa6yNrdiENvecvsb8k4V6EZugQ40',
    APISECRET: 'zVsB8DtrCMsAdJQuWoy8u5bnSo0XQPF7rElgJe1FVQ0r5fDo1vP2GlgE8az4HETH'
});

let WebSocket = require("ws");
let ws = new WebSocket("wss://ftx.com/ws/");
var beep = require('beepbeep')

var coins = [
    'ADA-PERP','1INCH-PERP','AAVE-PERP','ALGO-PERP','ALPHA-PERP','ALT-PERP','AMPL-PERP','AR-PERP','ATOM-PERP','AVAX-PERP','BADGER-PERP','BAND-PERP','BAO-PERP','BAT-PERP','BCH-PERP','BNB-PERP',
    'BNT-PERP','BRZ-PERP','BSV-PERP','BTC-PERP','BTMX-PERP','BTT-PERP','CAKE-PERP','CHZ-PERP','COMP-PERP','CREAM-PERP','CRO-PERP','CRV-PERP','DASH-PERP','DEFI-PERP','DMG-PERP','DOT-PERP','DRGN-PERP',
    'EGLD-PERP','ENJ-PERP','EOS-PERP','ETH-PERP','EXCH-PERP','FIDA-PERP','FIL-PERP','FLM-PERP','FLOW-PERP','FTM-PERP','FTT-PERP','GRT-PERP','HOLY-PERP','HOT-PERP','HT-PERP','KAVA-PERP',
    'KIN-PERP','KNC-PERP','KSM-PERP','LEO-PERP','LINA-PERP','LINK-PERP','LRC-PERP','LTC-PERP','LUNA-PERP','MAPS-PERP','MATIC-PERP','MID-PERP','MKR-PERP','MTA-PERP','NEAR-PERP','NEO-PERP','NPXS-PERP',
    'OKB-PERP','OMG-PERP','ONT-PERP','OXY-PERP','PAXG-PERP','PERP-PERP','PRIV-PERP','QTUM-PERP','RAY-PERP','REEF-PERP','REN-PERP','ROOK-PERP','RSR-PERP','RUNE-PERP','SAND-PERP','SC-PERP','SHIT-PERP',
    'SNX-PERP','SOL-PERP','SRM-PERP','SUSHI-PERP','SXP-PERP','THETA-PERP','TOMO-PERP','TRU-PERP','TRX-PERP','UNI-PERP','UNISWAP-PERP','VET-PERP','WAVES-PERP','XAUT-PERP','XLM-PERP',
    'XMR-PERP','XRP-PERP','XTZ-PERP','ZEC-PERP','ZIL-PERP','ZRX-PERP'
];

coin_dip_havuzu = {}
oynanan_coinler = [];

takibe_al = (ws, dizi) => {
    if ( dizi && dizi.length > 0 ) {
        dizi.forEach((market, k) => {
            ws.send( JSON.stringify( {'op': 'subscribe', 'channel': 'trades', 'market': market} ) );
        });
    }
}



while_process_false = () => {
    //Just no process. We should get price
    data = {};
    ftx_rest.get_price().then( price => {
        data["price"] = price;
        if ( process.argv[2] == "LONG" ){
            data["peak_point"] = price+((price/100)*parseFloat(process.argv[4]));
            console.log( data );
            ftx_rest.buy( process.argv[5], data["peak_point"].toFixed(6), "buy", false).then(bought => {
                setTimeout(() => {
                    data["process_id"] = bought.id;
                    ftx_rest.get_process(data["process_id"]).then(get_process => {
                        data["process_size"] = get_process.size;
                        data["process_price"] = get_process.avgFillPrice;
                        data["process_top_price"] = get_process.avgFillPrice+((get_process.avgFillPrice/100)*(process.argv[4]));
                        data["process_bottom_price"] = get_process.avgFillPrice-((get_process.avgFillPrice/100)*(process.argv[4]));
                                                
                        ftx_rest.sell( data["process_size"], data["process_top_price"].toFixed(6), "sell", true ).then(sell=>{
                            ftx_rest.stop( data["process_size"], data["process_bottom_price"].toFixed(6), "sell", true ).then(stop=>{
                                console.log( {stop} );
                            });
                        });               
                    });
                },5000);
            });
        }
        else if (  process.argv[2] == "SHORT" ){
            console.log("Short pozisyon açılıyor.. ");
            data["peak_point"] = price-((price/100)*parseFloat(process.argv[4]));
            console.log( {peak_point: data["peak_point"] } );
    
            let alinan_coin_adedi = ftx_rest.dolar_getir( process.argv[5], data["peak_point"].toFixed(6));
            ftx_rest.short_sell(process.argv[5], data["peak_point"].toFixed(6), "sell", false).then(selled => {
                setTimeout(() => {
                    data["process_id"] = selled.result.id;
                    console.log( {selled} );
                        data["process_size"] = selled.result.size;
                        data["process_price"] = data["price"];
                        data["process_top_price"] = data["process_price"]+((data["process_price"]/100)*(process.argv[4]));
                        data["process_bottom_price"] = data["process_price"]-((data["process_price"]/100)*(process.argv[4]));

                        console.log( {data} );
                                
                        ftx_rest.buy( data["process_size"], data["process_bottom_price"].toFixed(6), "buy", true ).then(sell=>{
                            console.log("Short buy:");
                            ftx_rest.stop( data["process_size"], data["process_top_price"].toFixed(6), "buy", true ).then(stop=>{
                                console.log("Short buy:");
                                console.log( {stop} );
                            });
                        });          
                },5000);
            });
        } 
    })
}

gunlugu_getir = async() => {
    let pr = new Promise( (resolve, reject) => {
        (async() => {
            binance.futuresDaily().then(gunluk_dipler => {
                for(coin in gunluk_dipler){
                    let cname = (gunluk_dipler[coin].symbol).replace("USDT", "-PERP");
                    let coin_listemde_var_mi =  coins.includes(cname);
                    if( coin_listemde_var_mi == true ){
                        if( !coin_dip_havuzu[ cname ] ){
                            let dip_alim_siniri = gunluk_dipler[coin].lowPrice/1000000*1000001;
                            let tepe_satim_siniri = gunluk_dipler[coin].highPrice/1000000*999999;
                            coin_dip_havuzu[ cname ] = { 
                                btc_fiyat:"",
                                dip:gunluk_dipler[coin].lowPrice,
                                dip_alim_siniri:dip_alim_siniri,
                                tepe:gunluk_dipler[coin].highPrice,
                                tepe_satim_siniri:tepe_satim_siniri
                            }
                        }
                    }
                }
                resolve( coin_dip_havuzu );
            });
        })()
    });
    return pr;
}

coin_dip_alim_noktasinda_mi = async( anlik ) => {
    if ( anlik && anlik.data && anlik.data.length > 0 ){
        
        let pr = new Promise( (resolve, reject) => {
            (async () => {
                let anlik_fiyat = anlik.data[0].price;
                if ( coin_dip_havuzu && Object.keys( coin_dip_havuzu ).length > 0 ){

                    if ( anlik.market == "BTC-PERP" ){
                        coin_dip_havuzu["BTC-PERP"].btc_fiyat = anlik_fiyat;
                    }
                    
                    /*
                    console.log({
                        market:"BTC-PERP",
                        fiyat: coin_dip_havuzu["BTC-PERP"].btc_fiyat,
                        gercek_dip:coin_dip_havuzu["BTC-PERP"].dip,
                        gercek_tepe:coin_dip_havuzu["BTC-PERP"].tepe,
                        data:new Date()
                    });
                    */
                    

                    for ( cname in coin_dip_havuzu ){
                        console.log( {oynanan_coinler} );
                        if ( oynanan_coinler.indexOf( anlik.market ) < 0 ){
                            if ( anlik.market == cname && anlik_fiyat >= coin_dip_havuzu[cname].dip && anlik_fiyat <= coin_dip_havuzu[cname].dip_alim_siniri ){
                                    ftx_rest.any_proces_status(anlik.market).then(r=>{
                                        if ( r == 0  ){
                                            console.log("AL ->");
                                            
                                            console.log( {
                                                market:anlik.market,
                                                alim_fiyati: anlik_fiyat,
                                                gercek_dip:coin_dip_havuzu[cname].dip,
                                                gercek_tepe:coin_dip_havuzu[cname].tepe,
                                                data:new Date()
                                            });
                                            process.argv[2] = "LONG";
                                            process.argv[3] = anlik.market;
                                            oynanan_coinler.push( anlik.market );
                                            console.log(  process.argv );
                                            //while_process_false();
                                            beep();
                                        }
                                });
                            }
                            else if ( anlik.market == cname && anlik_fiyat >= coin_dip_havuzu[cname].tepe_satim_siniri && anlik_fiyat <= coin_dip_havuzu[cname].tepe ){
                                ftx_rest.any_proces_status(anlik.market).then(r=>{
                                    if ( r == 0 ){                      
                                        console.log("SAT ->");
                                        console.log( {market:anlik.market, satim_fiyati: anlik_fiyat, gercek_tepe:coin_dip_havuzu[cname].tepe, data:new Date()} );
                                        process.argv[2] = "SHORT";
                                        process.argv[3] = anlik.market;
                                        oynanan_coinler.push( anlik.market );
                                        console.log(  process.argv );
                                        //while_process_false();
                                        
                                    }
                                });
                                
                                

                            }
                        }
                    }
                }
                resolve(1);
            })()
        });
        return pr;
    }
}


ws.on("open", data => {
    console.log("WebSocket Bağlantısı Başarılı");
    takibe_al(ws, coins);
});


if ( !process.argv[5]) {
    console.log("Kullanım:\nnode chance.js LONG BTC-PERP 3(yüzde kaç) 5(Kaç dolarlık)\n");
    return false;
}
else{
    gunlugu_getir().then(r=>{
        ws.on("message", data => {
            if ( data && data != "") {
                let anlik = JSON.parse( data );
                coin_dip_alim_noktasinda_mi( anlik ).then().catch(err=>{console.log({err})});
            }
        });
        
    });
    
}

