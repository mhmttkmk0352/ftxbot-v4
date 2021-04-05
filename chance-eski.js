require("dotenv").config();
const ftx_rest= require("./ekler/ftx-rest");
const mail = require("./ekler/mail");

let info = {
    my_balance: 0,
    win_status: -1,
    type: "",
    coin: "",
    percent: 3,
    dolar: 5,
    process_status_query_time: 10000
}


while_process_true = () => {
    console.log("Already process !");
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
            

            
            let alinan_coin_adedi = ftx_rest.dolar_getir( info.dolar, data["peak_point"].toFixed(6));
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


process_control = () => {
    console.log("process_control func:");
    ftx_rest.any_proces_status().then(process_status => {
        if ( process_status == 0 ) {

            ftx_rest.bakiye_getir().then( current_balance=> {
                if ( current_balance == info.my_balance ){
                    console.log("Equal");
                    info.type = process.argv[2];
                    info.coin = process.argv[3];
                    info.percent = process.argv[4];
                    info.dolar = process.argv[5];
                    console.log( info );
                    while_process_false();
                }
                else if (current_balance > info.my_balance){
                    console.log("Win");
                    console.log({
                        current_balance:current_balance,
                        my_balance:info.my_balance
                    });
                    while_process_false();
                }
                else if (current_balance < info.my_balance){
                    console.log("Loss");
                    console.log({
                        current_balance:current_balance,
                        my_balance:info.my_balance
                    });
                }
            });
        }
        else{
            console.log("There is existing transaction");
        }
    });
}


process_status_query = () => {
    process_control();
    timer = setInterval(() => {
        process_control();
        
    }, info.process_status_query_time);
}




startApp = () => {
    if ( !process.argv[5]) {
        console.log("Kullanım:\nnode chance.js LONG BTC-PERP 3(yüzde kaç) 5(Kaç dolarlık)\n");
        return false;
    }
    else{
        ftx_rest.bakiye_getir().then(current_balance => {
            info.my_balance = current_balance;
            process_status_query();
        });
    }


}


startApp();