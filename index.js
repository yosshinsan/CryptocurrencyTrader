$(function(){ 

    const proxy = "https://cors-anywhere.herokuapp.com/"; 
    let ch = new ccxt.coincheck({ proxy: proxy });
    let apiKey = '';
    let secretKey = '';
    let intervalProcessing;
    let intervalMilliSecond = 5000;
    let pairToTrade = 'BTC/JPY'

    //Startボタンクリック
    $('#yoshi_start_button').click(async() => {       
    
        alert('起動OK');
        apiKey = $('#api-key').val();
        secretKey = $('#secret-key').val();
        
        const proxy = "https://cors-anywhere.herokuapp.com/"; 
        let ch = new ccxt.coincheck({ proxy: proxy });
        
        ch.apiKey = apiKey;
        ch.secret = secretKey;
    
        let val = await fetchNumberOfOpenOrders(pairToTrade);
        console.log(val);
/*         console.log(ch.has);

        intervalProcessing = setInterval(async() => {
            
            document.getElementById("yoshi_message").innerHTML = '処理中です';

            await fetchLastContractPrice(pairToTrade).then(function(value){
                document.getElementById("result").innerHTML = value;
            });
    
            document.getElementById("yoshi_message").innerHTML = '繰り返します';
        
        }, intervalMilliSecond); */
        
        

        
        /**
         *最後の約定価格を取得する
         *
         * @param {String} pair 価格を取得するペア(ex:'BTC/JPY')
         * @returns {Object} 成功した場合：価格　失敗した場合：exception
         */
        function fetchLastContractPrice(pair) {
            return new Promise((resolve,reject) => {
                ch.fetchTicker(pair).then((ticker) => {
                    resolve(ticker.last);
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }

        /**
         *最後の約定価格を取得する
         *
         * @param {String} pair 価格を取得するペア(ex:'BTC/JPY')
         * @returns {Object} 成功した場合：価格　失敗した場合：exception
         */
        function fetchNumberOfOpenOrders(pair) {
            return new Promise((resolve,reject) => {
                ch.fetchOpenOrders(pair).then((ticker) => {
                    resolve(ticker);
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }



    })

    $('#yoshi_stop_button').click(async() => {    
        clearInterval(intervalProcessing);
    });

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