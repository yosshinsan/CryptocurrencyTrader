$(function(){ 

    //GiveUpボタンクリックイベント
    $('#y-start_button').click(function(){       
    
        let url = 'https://api.zaif.jp/api/1/currencies/btc';
        fetch(url ,{
            mode: 'no-cors'
          }) 
        .then(function(data){
            return data.json();
        })
        .then(function(json){
            let isSuccess = json[0].success;
            $('#y-start_button').text(isSuccess);
        });

    })


    

})