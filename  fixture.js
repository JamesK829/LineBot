const query = require('./asyncDB');

//------------------------------------------
// 由日期查詢工件數據
//------------------------------------------
var fetchfixture = async function(modified){
    //存放結果
    let result;  

    //讀取資料庫
    await query('SELECT * FROM reserved_date WHERE date(modified) = $1', [modified])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows[0];  //工件資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//匯出
module.exports = {fetchfixture};