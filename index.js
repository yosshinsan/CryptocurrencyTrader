$(function(){ 

    const proxy = "https://cors-anywhere.herokuapp.com/"; 
    let ch = new ccxt.coincheck({ proxy: proxy });
    let apiKey = '';
    let secretKey = '';
    let intervalProcessing;
    let intervalMilliSecond = 30000;
    let pairToTrade = 'BTC/JPY'
    let pairToTradeOnExchange = 'btc_jpy'
    let sideBuy = 'buy';
    let sideSell = 'sell';
    let addPrice = 1000;
    let subtractPrice = 1000;
    let excludeJpyBalance = 30000;
    let tradeAmount = 0.01; //取引量を固定する　注文が複数回に分かれて整理するためlastで正確な量が取得できないため

    //Startボタンクリック
    $('#yoshi_start_button').click(async() => {       
    
        alert('起動OK');
        apiKey = $('#api-key').val();
        secretKey = $('#secret-key').val();
        
        const proxy = "https://cors-anywhere.herokuapp.com/"; 
        let ch = new ccxt.coincheck({ proxy: proxy });
        
        ch.apiKey = apiKey;
        ch.secret = secretKey;

        let isError;

        intervalProcessing = setInterval(async() => {
            
            console.log('開始');
            console.log(getDateTimeDisp());
            


            isError = false;

            //未決済注文を取得
            //let openOrders = 
            console.log('未決済注文の取得');
            console.log(getDateTimeDisp());
            await fetchOpenOrders()
                    .then(async(openOrders) => {
                        
                        //未決済注文がなければ処理を行うvvvvv
                        if(openOrders.length === 0){
                            console.log('最後の約定注文取得');
                            console.log(getDateTimeDisp());                            
                            //最後に約定した注文を取得する
                            let lastOrder = await fetchLastOrder(pairToTradeOnExchange)
                                                    .catch((e) => {
                                                        isError = true;
                                                        console.log(e);});
                            
                            if(!isError){
                                
                                let lastSide = lastOrder.side;
                            
                                //最後の約定が買いの場合
                                if(lastSide === sideBuy){
                                    console.log('売り注文を入れる');
                                    console.log(getDateTimeDisp());
                                    
                                    //売り注文を入れる
                                        //最後の取得価格、取得量を取得
                                        //最後の取得価格+円で売り注文   
                                    let lastPrice = lastOrder.rate;
                                    //let lastAmount = lastOrder.funds.btc;
                                    let lastAmount = tradeAmount;
                                    let orderPrice = Math.floor(lastPrice);
                                    orderPrice = orderPrice + addPrice;
                                    await createLimitSellOrder(pairToTrade,lastAmount,orderPrice).catch((e) => {console.log(e)});
                                }
    
                                //最後の約定が売りの場合
                                if(lastSide === sideSell){
                                    console.log('買い注文を入れる');
                                    console.log(getDateTimeDisp());                                  
                                    
                                    //買い注文を入れる
                                        //現在の価格を取得
                                        //現在の価格-円で買い注文
                                        //注文量は日本円残高から計算
                                    let lastPrice = await fetchLastContractPrice(pairToTrade)
                                                            .catch((e) => {
                                                                isError = true;
                                                                console.log(e);});
                                    
                                    if(!isError){
                                        await fetchJpyBalance()
                                                .then(async(jpyBalance) => {
                                                    let orderPrice = lastPrice - subtractPrice;
                                                    jpyBalance = jpyBalance - excludeJpyBalance;
                                                    //let orderAmount = jpyBalance / orderPrice;
                                                    //orderAmount = Math.floor(orderAmount * 1000) / 1000;
                                                    let orderAmount = tradeAmount;
                                                    await createLimitBuyOrder(pairToTrade,orderAmount,orderPrice).catch((e) => {console.log(e)});
                                                })
                                                .catch((e) => {
                                                    isError = true;
                                                    console.log(e);});
                                    }
                                }
                            }
                        }

                    })
                    .catch((e) => {
                        console.log(e);
                    });
                    
                    console.log(getDateTimeDisp());
                    console.log('終了');

                }, intervalMilliSecond);



/*         //未決済注文を取得
        let openOrders = await fetchOpenOrders();

        //未決済注文がなければ処理を行う
        if(openOrders.length === 0){
            //最後に約定した注文を取得する
            let lastOrder = await fetchLastOrder(pairToTradeOnExchange);
            console.log(lastOrder);    

            let lastSide = lastOrder.side;
            
            //最後の約定が買いの場合
            if(lastSide === sideBuy){
                //売り注文を入れる
                    //最後の取得価格、取得量を取得
                    //最後の取得価格+円で売り注文   
                let lastPrice = lastSide.rate;
                let lastAmount = lastSide.funds.btc;
                let orderPrice = lastPrice + addPrice;
                //await createLimitSellOrder(pairToTrade,lastAmount,orderPrice);
            }

            //最後の約定が売りの場合
            if(lastSide === sideSell){
                //買い注文を入れる
                    //現在の価格を取得
                    //現在の価格-円で買い注文
                    //注文量は日本円残高から計算
                let lastPrice = await fetchLastContractPrice(pairToTrade);
                let orderPrice = lastPrice - subtractPrice;
                let jpyBalance = await fetchJpyBalance();
                jpyBalance = jpyBalance - excludeJpyBalance;
                let orderAmount = jpyBalance / orderPrice;
                orderAmount = Math.floor(orderAmount * 1000) / 1000;
                //await createLimitBuyOrder(pairToTrade,orderAmount,orderPrice);
                console.log(orderAmount);
            }


        }
 */
        //let val = await fetchLastOrder(pairToTradeOnExchange);
        //document.getElementById("result").innerHTML = val;
        //console.log(val);
/*         console.log(ch.has);

        intervalProcessing = setInterval(async() => {
            
            document.getElementById("yoshi_message").innerHTML = '処理中です';

            await fetchLastContractPrice(pairToTrade).then(function(value){
                document.getElementById("result").innerHTML = value;
            });
    
            document.getElementById("yoshi_message").innerHTML = '繰り返します';
        
        }, intervalMilliSecond); */
        
        
        /**
         *買い注文する
         *
         * @param {String} pair 価格を取得するペア(ex:'BTC/JPY')
         * @returns {Object} 成功した場合：価格　失敗した場合：exception
         */
        function createLimitBuyOrder(pair,amount,price) {
            return new Promise((resolve,reject) => {
                ch.createLimitBuyOrder(pair,amount,price).then((result) => {
                    resolve(result);
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }

                /**
         *uri注文する
         *
         * @param {String} pair 価格を取得するペア(ex:'BTC/JPY')
         * @returns {Object} 成功した場合：価格　失敗した場合：exception
         */
        function createLimitSellOrder(pair,amount,price) {
            return new Promise((resolve,reject) => {
                ch.createLimitSellOrder(pair,amount,price).then((result) => {
                    resolve(result);
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
         *未決済注文を取得する
         *未決済注文がない場合、リターンするオブジェクトは空(Length=0)となる
         * @returns {Object} 成功した場合：未決済注文情報　失敗した場合：exception
         */
        function fetchOpenOrders() {
            return new Promise((resolve,reject) => {
                ch.fetchOpenOrders().then((ticker) => {
                    resolve(ticker);
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }

        /**
         *最後の取引データを取得する
         *
         * @returns {Object} 成功した場合：最後の取引データ　失敗した場合：exception
         */
        function fetchLastOrder(pairOnExchange) {
            return new Promise((resolve,reject) => {
                ch.private_get_exchange_orders_transactions().then((ticker) => {
                    resolve(ticker.transactions.find(tran => tran.pair === pairOnExchange));
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }

        /**
         *nihonen no zandaka wo syutoku suru
         *
         * @returns {Object} 成功した場合：最後の取引データ　失敗した場合：exception
         */
        function fetchJpyBalance() {
            return new Promise((resolve,reject) => {
                ch.private_get_accounts_balance().then((balance) => {
                    resolve(balance.jpy);
                })
                .catch((e) => {
                    reject(e);
                });
            });
        }

        function getDateTimeDisp(){
            return window.Date().toLocaleString();
        }


    })




    $('#yoshi_stop_button').click(async() => {    
        clearInterval(intervalProcessing);
        console.log('Stopしました。')
    });




})