$(function(){ 

    const proxy = "https://cors-anywhere.herokuapp.com/"; 
    let ch = new ccxt.coincheck({ proxy: proxy });
    let apiKey = '';
    let secretKey = '';

    //Startボタンクリック
    $('#yoshi_start_button').click(function(){       
    
        alert('起動OK');
        apiKey = $('#api-key').val();
        secretKey = $('#secret-key').val();
        
        alert(apiKey);
        alert(secretKey);
        //const proxy = "https://cors-anywhere.herokuapp.com/"; 
        //let ch = new ccxt.coincheck({ proxy: proxy });
        
        //ch.apiKey='';
        //ch.secret='';
        
        console.log(ch.has);
        
//                ch.createLimitBuyOrder('BTC/JPY',0.01,1800000).then((ticker) => {
//                   const text = JSON.stringify(ticker);
//                    console.log(typeof(text))
//                    //document.getElementById("result").innerHTML = ticker.bids[0][0];
//                    document.getElementById("result").innerHTML = text;
//                })
//                .catch((e) => {
//                    document.getElementById("result").innerHTML = e;
//                });
    })

    //注文残の確認

        //注文残があればなにもしない

        //注文残がない場合
            //最後の約定が買いの場合
                //売り注文を入れる
                    //最後の取得価格、取得量を取得
                    //最後の取得価格+円で売り注文
            //最後の約定が売りの場合
                //買い注文を入れる
                    //現在の価格を取得
                    //現在の価格マイナス?円で買い注文
                    //注文量は日本円残高から計算



})