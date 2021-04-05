const ftx_rest = require("./ekler/ftx-rest");

/*
silinecek_coinler = ["SXP-PERP", "REEF-PERP", "ONT-PERP", "BAND-PERP"];

silinecek_coinler.forEach((v,k)=>{
    ftx_rest.emirleri_iptal_et( v ).then(r => {
        console.log( {r} );
    });
});


*/



/*
ftx_rest.gecmis_getir( {
    market_name:"BTC",
    resolution: 86400,
    limit:35,
    ne_zamandan_itibaren: (60 * 60 * 24* 30), // 24 saat
    aralik:"aylik"
} ).then(r=>{
        console.log( {r} );
});

ftx_rest.gecmis_getir( {
    market_name:"BTC",
    resolution: 86400,
    limit:35,
    ne_zamandan_itibaren: (60 * 60 * 24* 7), // 24 saat
    aralik:"haftalik"
} ).then(r=>{
        console.log( {r} );
});

*/
ftx_rest.gecmis_getir( {
    market_name:"CHZ",
    resolution: 86400,
    limit:35,
    ne_zamandan_itibaren: (60 * 60 * 24* 1), // 24 saat
    aralik:"gunluk"
} ).then(r=>{
        console.log( r );
});
