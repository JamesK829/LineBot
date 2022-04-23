const express = require('express')
const app = express()
const linebot = require('linebot');
const querystring = require('querystring');
if (process.env.NODE_ENV !== 'production') {      
 require('dotenv').config()                     
}
const bot = linebot({
 channelId: process.env.CHANNEL_ID,
 channelSecret: process.env.CHANNEL_SECRET,
 channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const linebotParser = bot.parser();

bot.on('message', function (event) {
 console.log(event);

if(event.message.text=='取消預約'){
  const config = require('./config');
  const {Client}= require('pg')
  const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
   
     ssl: {
       rejectUnauthorized: false,
          }
          })

 client.connect()

         var listMessage=[];
         var content=[]
  client.query(`SELECT date,time, username ,product FROM reservation WHERE usernum='${event.source.userId}'`
    ,(err, result) => {
            for(i=0;i<result.rows.length;i++){
              listMessage.push(
              {type:"bubble",size:"kilo",hero:{type:"box",layout:"vertical",contents:[
                {type:"text",text:`預約日期： ${result.rows[i].date}`,size:"sm",margin:"20px",align:"center"},
                {type:"text",text:`預約時段：${result.rows[i].time}`,size:"sm",margin:"10px",align:"center"},
                {type:"text",text:`預約項目：${result.rows[i].product}`,size:"sm",margin:"10px",align:"center"}]},
                body:{type:"box",layout:"vertical",contents:[{type:"box",layout:"vertical",contents:[
                  {type:"box",layout:"baseline",spacing:"sm",contents:[]}]}],spacing:"sm",paddingAll:"13px"},
                  footer:{type:"box",layout:"vertical",contents:[{type:"button",action:{type:"postback",label:"刪除",data:`id=a5&date=${result.rows[i].date}&time=${result.rows[i].time}&product=${result.rows[i].product}`}}]}}
                   
             )
            }
        for(i=0;i<listMessage.length;i++){
          content.push(
            JSON.stringify(listMessage[i])
          )
        }
        var b =   `{ "type": "flex","altText": "Flex Message","contents": {"type": "carousel","contents": [` + content.join(",") +`]}}`
        var c =b.replace("\"(\\w+)\"(\\s*:\\s*)", "$1$2")
        console.log(JSON.parse(c))
        event.reply(JSON.parse(c))

     client.end()
     })
}else if(event.message.text=='預約服務'){     
        event.reply(
          {
            type: 'template',
            
            altText: 'this is a carousel template',
            template: {
              type: 'carousel',
              columns: [{
                thumbnailImageUrl: 'https://i.ibb.co/TkN6L8R/S-38977557.jpg',
                title: 'BodyX Mind Balance',
                 text: '線上預約',
                actions: [{ 
                    type: 'postback',
                label: 'BodyX Mind Balance簡介',
                data: 'id=a2&product=預約BodyX Mind Balance',
                                
                }]},{
                  thumbnailImageUrl: 'https://i.ibb.co/w4nSq7C/S-43352124.jpg',
                  title: '身材曲線管理',
                  text: '線上預約',
                  actions: [{
                    type: 'postback',
                    label: '身材曲線管理簡介',
                    data: 'id=a4&product=身材曲線管理',
                  }]},  {
                thumbnailImageUrl: 'https://i.ibb.co/RCbcGRp/S-43360306.jpg',
                title: '團體調和課程',
                text: '線上預約',
                actions: [{
                  type: 'postback',
                  //label: '預約團體調和課程',
                  //data: 'id=a1&product=團體調和課程',
                 label:'籌備中 敬請期待',
                 data:'id ='
                }]
              }]
            }
          }
        )
        
      }
});
bot.on('postback', function (event) {
  const ts = querystring.parse(event.postback.data);
  const dt = event.postback.data;
 if(ts.id==='a1'){
  
  var today = new Date();
  var start =new Date('2021/07/30');
  var d=[];
  var weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "ㄧ";
  weekday[2] = "二";
  weekday[3] = "三";
  weekday[4] = "四";
  weekday[5] = "五";
  weekday[6] = "六";
for(i=0;i<40;i++){
  if(today<start){
    var result=new Date(start.getTime() + (i * 24 * 60 * 60 * 1000))
      if(!(weekday[(result.getDay())]=="日")){
          d.push((result.getMonth()+1),(result.getDate()),weekday[(result.getDay())])
       }
  }else{
     var result=new Date(today.getTime() + (i * 24 * 60 * 60 * 1000))
      if(!(weekday[(result.getDay())]=="日")){
          d.push((result.getMonth()+1),(result.getDate()),weekday[(result.getDay())])
       }
  }

  }
     event.reply(      
      {
        type: "template",
        altText: "this is a carousel template",
        template: {
            type: "carousel",  
            columns: [
                {
                
                  thumbnailImageUrl: 'https://i.ibb.co/RBS0GhJ/S-42573924.png',
                  title: ts.product,
                    text: "請選擇預約日期",
                    actions: [
                      {
                          type: "postback",
                          label: d[0]+'/'+d[1]+'('+d[2]+')',
                          text: `${d[0]}/${d[1]}(${d[2]})`,
                          data: `t=${d[0]+'/'+d[1]}&prd=${ts.product}&tid=t1`
                      },
                      {
                          type: "postback",
                          label: d[3]+'/'+d[4]+'('+d[5]+')',
                          text: `${d[3]}/${d[4]}(${d[5]})`,
                          data: `t=${d[3]+'/'+d[4]}&prd=${ts.product}&tid=t1`
                      },
                      {
                          type: "postback",
                          label: d[6]+'/'+d[7]+'('+d[8]+')',
                          text: `${d[6]}/${d[7]}(${d[8]})`,
                          data: `t=${d[6]+'/'+d[7]}&prd=${ts.product}&tid=t1`
                      }
                  ]
                },
                {
                  thumbnailImageUrl: 'https://i.ibb.co/RBS0GhJ/S-42573924.png',
                  title: ts.product,
                    text: "請選擇預約日期",
                    actions: [
                      {
                          type: "postback",
                          label: d[9]+'/'+d[10]+'('+d[11]+')',
                          text: `${d[9]}/${d[10]}(${d[11]})`,
                          data: `t=${d[9]+'/'+d[10]}&prd=${ts.product}&tid=t1`
                      },
                      {
                          type: "postback",
                          label: d[12]+'/'+d[13]+'('+d[14]+')',
                          text: `${d[12]}/${d[13]}(${d[14]})`,
                          data: `t=${d[12]+'/'+d[13]}&prd=${ts.product}&tid=t1`
                      },
                      {
                          type: "postback",
                          label: d[15]+'/'+d[16]+'('+d[17]+')',
                          text: `${d[15]}/${d[16]}(${d[17]})`,
                          data: `t=${d[15]+'/'+d[16]}&prd=${ts.product}&tid=t1`
                      }
                  ]
                }, {
                  thumbnailImageUrl: 'https://i.ibb.co/RBS0GhJ/S-42573924.png',
                  title: ts.product,
                    text: "請選擇預約日期",
                    actions: [
                          {
                              type: "postback",
                              label: d[18]+'/'+d[19]+'('+d[20]+')',
                              text: `${d[18]}/${d[19]}(${d[20]})`,
                              data: `t=${d[18]+'/'+d[19]}&prd=${ts.product}&tid=t1`
                            },
                          {
                              type: "postback",
                              label: d[21]+'/'+d[22]+'('+d[23]+')',
                              text: `${d[21]}/${d[22]}(${d[23]})`,
                              data: `t=${d[21]+'/'+d[22]}&prd=${ts.product}&tid=t1`
                            },
                          {
                              type: "postback",
                              label: d[24]+'/'+d[25]+'('+d[26]+')',
                              text: `${d[24]}/${d[25]}(${d[26]})`,
                              data: `t=${d[24]+'/'+d[25]}&prd=${ts.product}&tid=t1`
                            }
                      ]
                    }, {
                      thumbnailImageUrl: 'https://i.ibb.co/RBS0GhJ/S-42573924.png',
                      title: ts.product,
                        text: "請選擇預約日期",
                        actions: [
                              {
                                  type: "postback",
                                  label: d[27]+'/'+d[28]+'('+d[29]+')',
                                  text: `${d[27]}/${d[28]}(${d[29]})`,
                                  data: `t=${d[27]+'/'+d[28]}&prd=${ts.product}&tid=t1`
                                },
                              {
                                  type: "postback",
                                  label: d[30]+'/'+d[31]+'('+d[32]+')',
                                  text: `${d[30]}/${d[31]}(${d[32]})`,
                                  data: `t=${d[30]+'/'+[31]}&prd=${ts.product}&tid=t1`
                                },
                              {
                                  type: "postback",
                                  label: d[33]+'/'+d[34]+'('+d[35]+')',
                                  text: `${d[33]}/${d[34]}(${d[35]})`,
                                  data: `t=${d[33]+'/'+d[34]}&prd=${ts.product}&tid=t1`
                                }]
                        }
                    ]
        }
      }
     )}

else if(ts.id==='a2'){
  event.reply(
    {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "carousel",
        contents: [
          {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/wywQ0kt/S-42688529.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b212.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "生命根基平衡",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間90分鐘  $2600",
                              weight: "bold",
                              color:"#a9a9a9",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 情緒緊繃 呼吸短淺"
                    },
                    {
                      type: "text",
                      text: "* 消化及 氣血循環不良"
                    },
                    {
                      type: "text",
                      text: "* 下肢水腫 氣色不佳 代謝緩慢"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                contents: [
                  // {
                  //   type: "button",
                  //   style: "primary",
                  //   action: {
                  //     type :"postback",
                  //     label: "預約生命根基平衡",
                  //     data: `id=a3&prod=${ts.product}-生命根基平衡&pb=1`
                  //   },
                  //   color: "#c0c0c0"
                  // },
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "生命根基平衡簡介",
                      uri: "https://storage.googleapis.com/ashaintro/index%20b212.html"
                    },
                    color: "#c0c0c0",
                    style: "primary",
                    margin: "lg"
                  }
                  ]
                }
              }, 
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/fHKR7QS/S-42688530.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b102.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "生命和諧",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 身心疲憊"
                    }, 
                    {
                      type: "text",
                      text: "* 上身及下身不均勻過胖"
                    },
                    {
                      type: "text",
                      text: "* 全身緊繃僵硬"
                    },
                    {
                      type: "text",
                      text: "* 免疫力低落"
                    },
                    {
                      type: "text",
                      text: "* 生理功能低下"
                    },
                    {
                      type: "text",
                      text: "* 皮膚晦暗老化"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :'postback',
                    //     label: "預約生命和諧",
                    //     data: `id=a3&prod=${ts.product}+預約生命和諧&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "生命和諧簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b102.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              }, {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/tpvRQx4/S-39108618.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b142.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "靈氣自然療法",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間60分鐘",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        },                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "體驗$1500/單堂＄1880",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 改善情緒及減輕憂慮"
                    }, 
                    {
                      type: "text",
                      text: "* 幫助鬆弛 平衡心理"
                    },
                    {
                      type: "text",
                      text: "* 增強自信改善人際關係"
                    },
                    {
                      type: "text",
                      text: "* 協調人際及自我關係"
                    },
                    {
                      type: "text",
                      text: "* 減輕積存身體的負能量"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :'postback',
                    //     label: "預約靈氣自然療法",
                    //     data: `id=a3&prod=${ts.product}+預約靈氣自然療法&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "靈氣自然療法簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b142.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/CHN28Jc/S-42688522.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b42.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "情緒平衡調理",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 針對容易壓抑情緒"
                    },
                    {
                      type: "text",
                      text: "* 情緒激動"
                    },
                    {
                      type: "text",
                      text: "* 心情低落"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type: "postback",
                    //     label: "預約情緒平衡調理",
                    //     data: `id=a3&prod=${ts.product}+預約情緒平衡調理&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "情緒平衡調理簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b42.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/c8PsdCX/S-42688525.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b32.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "放鬆舒眠調理",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 失眠"
                    },
                    {
                      type: "text",
                      text: "* 無法釋壓"
                    },
                    {
                      type: "text",
                      text: "* 焦慮緊張引起消化不良便秘"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :"postback",
                    //     label: "預約放鬆舒眠調理",
                    //     data: `id=a3&prod=${ts.product}+預約放鬆舒眠調理&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "放鬆舒眠調理簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b32.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              }, 
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/sv1FhMN/S-42688527.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b112.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "耳燭淨化能量療法",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間20分鐘 $1500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 平衡顱壓改善失眠"
                    }, 
                    {
                      type: "text",
                      text: "* 緊實拉提臉部線條"
                    },
                    {
                      type: "text",
                      text: "* 強化聽力緩和耳壓"
                    },
                    {
                      type: "text",
                      text: "* 肩頸放鬆"
                    },
                    {
                      type: "text",
                      text: "~全程使用義大利植物能量保養品&"
                    },
                    {
                      type: "text",
                      text: "   OTO天然蜂蠟手工耳燭~"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :'postback',
                    //     label: "預約耳燭淨化能量療法",
                    //     data: `id=a3&prod=${ts.product}+預約耳燭淨化能量療法&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "耳燭淨化能量療法簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b112.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/2ZzXshY/S-42688524.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b52.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "腹腔淨化調理",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間100分鐘 $3000",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 針對小腹腫漲"
                    },
                    {
                      type: "text",
                      text: "* 便秘 緊張腹瀉"
                    },
                    {
                      type: "text",
                      text: "* 皮膚過敏"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type: "postback",
                    //     label: "預約腹腔淨化調理",
                    //     data: `id=a3&prod=${ts.product}+預約腹腔淨化調理&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "腹腔淨化調理簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b52.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/tJ4YZsZ/S-42688526.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b72.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "頸背結構調理",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $3200~3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 針對背部僵硬 沾黏 鬆弛 肥厚"
                    },
                    {
                      type: "text",
                      text: "* 長期腰背不適"
                    },
                    {
                      type: "text",
                      text: "* 背部皮膚易紅癢"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :"postback",
                    //     label: "頸背結構調理平衡",
                    //     data: `id=a3&prod=${ts.product}+頸背結構調理平衡&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "頸背結構調理簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b72.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                  }
                }
              ,
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/myCWSkQ/S-42688528.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b82.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "頭皮淨化舒壓",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間100分鐘 $2800",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 針對掉髮 頭皮屑"
                    },
                    {
                      type: "text",
                      text: "* 沾黏緊繃 厚實"
                    },
                    {
                      type: "text",
                      text: "* 頭壓大"
                    },
                    {
                      type: "text",
                      text: "~可加價舒緩泥膜$600~"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type: "postback",
                    //     label: "預約頭皮淨化舒壓",
                    //     data: `id=a3&prod=${ts.product}+預約頭皮淨化舒壓&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "頭皮淨化舒壓簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b82.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/2dHZ8Tz/4969680-B-5204-4-EB4-B271-BAFC40-AB5-F5-E-L0-001.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b92.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "養生護眼泥膜護理",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間100分鐘 $3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 眼內高壓 緊繃 發紅"
                    },
                    {
                      type: "text",
                      text: "* 眼部疲勞 眼周缺水皺紋"
                    },
                    {
                      type: "text",
                      text: "* 眼周水腫 眼袋 黑眼圈"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   style: "primary",
                    //   action: {
                    //     type :'postback',
                    //     label: "預約養生護眼泥膜護理",
                    //     data: `id=a3&prod=${ts.product}+預約養生護眼泥膜護理&pb=1`
                    //   },
                    //   color: "#c0c0c0"
                    // },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "養生護眼泥膜護理簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b92.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              }
            ]
          }
        }

  )}

  else if(ts.id==='a3'){
    event.reply(
      {
              type: 'template',
              altText: 'this is a buttons template',
              template: {
                
                type: 'buttons',
                title: '加價購項目',
                text: ts.prod,
                actions: [{
                  type: 'postback',
                  label: '火山泥膜',
                  data: `id=a1&product=${ts.prod}(加購)火山泥膜`
                }, {
                  type: 'postback',
                  label: '耳燭淨化能量療法',
                  data: `id=a1&product=${ts.prod}(加購)耳燭淨化能量療法`
                }, {
                  type: 'postback',
                  label: '頭皮淨化舒壓',
                  data: `id=a1&product=${ts.prod}(加購)頭皮淨化舒壓`
                }, {
                  type: 'postback',
                  label: '不加購',
                  data: `id=a1&product=${ts.prod}`
                }]
              }
            }
  )
}
else if(ts.id==='a4'){
  event.reply(
    {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "carousel",
        contents: [
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/mJkCK3P/S-43360460.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b62.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "淨化緊實體雕",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $4500~6000",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 針對身材肥腫 肩厚 "
                    },
                    {
                      type: "text",
                      text: "蝴蝶袖 蜂窩 鬆弛",
                      offsetStart: "30px"
                    },
                    {
                      type: "text",
                      text: "~應部位需求 可加療程："
                    },
                    {
                      type: "text",
                      text: "冷紮三種或敷泥膜三種～",
                      offsetStart: "30px"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      style: "primary",
                      action: {
                        type :"postback",
                        label: "預約淨化緊實體雕",
                        data: `id=a1&product=${ts.product}+預約淨化緊實體雕&pb=1`
                      },
                      color: "#c0c0c0"
                    },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "淨化緊實體雕簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b62.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              },
              {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/hd9CnLm/S-42688532.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b132.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "元氣美胸活化保健課程",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間60分鐘 $2000",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 發育中及發育後疏通保養"
                    },
                    {
                      type: "text",
                      text: "* 長期駝背造成之胸悶 呼吸短淺"
                    },
                    {
                      type: "text",
                      text: "* 身心平衡穩定"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      style: "primary",
                      action: {
                        type :'postback',
                        label: "預約元氣美胸活化保健課程",
                        data: `id=a1&product=${ts.product}+預約元氣美胸活化保健課程&pb=1`
                      },
                      color: "#c0c0c0"
                    },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "元氣美胸活化保健課程簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b132.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              }, {
                type: "bubble",
                hero: {
                  type: "image",
                  url: "https://i.ibb.co/2cGXkX4/S-42688531.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    uri: "https://storage.googleapis.com/ashaintro/index%20b122.html"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "text",
                      text: "緊緻美胸心輪活化保健課程",
                      size: "xl",
                      weight: "bold"
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "時間120分鐘 $3500",
                              color:"#a9a9a9",
                              weight: "bold",
                              margin: "sm",
                              flex: 0
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: " ",
                      wrap: true,
                      color: "#aaaaaa",
                      size: "lg"
                    },
                    {
                      type: "text",
                      text: "* 預防胸部下垂 萎縮 外擴"
                    }, 
                    {
                      type: "text",
                      text: "* 產後護理或更年期女性"
                    },
                    {
                      type: "text",
                      text: "* 活化平衡心輪 增加愛的感知力"
                    },
                    {
                      type: "text",
                      text: "* 活絡循環與肺部活力"
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      style: "primary",
                      action: {
                        type :'postback',
                        label: "預約緊緻美胸心輪活化保健課程",
                        data: `id=a1&product=${ts.product}+預約緊緻美胸心輪活化保健課程&pb=1`
                      },
                      color: "#c0c0c0"
                    },
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "緊緻美胸心輪活化保健課程簡介",
                        uri: "https://storage.googleapis.com/ashaintro/index%20b122.html"
                      },
                      color: "#c0c0c0",
                      style: "primary",
                      margin: "lg"
                    }
                  ]
                }
              }
            ]
          }
        }

  )}

else if(ts.tid==='t1'){
    event.reply(
            {
                    type: 'template',
                    altText: 'this is a buttons template',
                    template: {
                      type: 'buttons',
                      title: '請選擇預約時段',
                      text: ts.prd,
                      actions: [{
                        type: 'postback',
                        label: '14:00~16:00',
                        text:'14:00~16:00',
                        data: `date=${ts.t}&time=14-16&j=k&prod=${ts.prd}`
                      }, {
                        type: 'postback',
                        label: '16:00~18:00',
                        text:'16:00~18:00',
                        data: `date=${ts.t}&time=16-18&j=k&prod=${ts.prd}`
                      }, {
                        type: 'postback',
                        label: '18:00~20:00',
                        text:'18:00~20:00',
                        data: `date=${ts.t}&time=18-20&j=k&prod=${ts.prd}`
                      }]
                    }
            }
                )
}
else if(ts.j==='k'){
  
  event.source.profile().then(function (profile) {
    event.reply( {
        type: "template",
        altText: "Example confirm template",
        template: {
            type: "confirm",
            text: `${profile.displayName}`+`${ts.prod}`+'  預約日期：'+`${ts.date}`+'  預約時段:'+`${ts.time}`,
            actions: [
                {
                    type: "postback",
                    label: "Yes",
                   // text: '感謝您的預約'+'預約項目：'+`${ts.prod}`+'預約日期：'+`${ts.date}`+'預約時段:'+`${ts.time}`,
                    data:`content=${ts.prod},${ts.date},${ts.time}&confirm=yes&user=${profile.displayName}`

                },
                {
                    type: "message",
                    label: "No",
                    text: "請重新選擇服務項目"
                }
            ]
        }
    }
    )

}
     ).catch((err) => {
       callback(err, null);
   })
  }
  else if(ts.id==='a5'){
    event.reply(
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
        {type: "bubble",
        body: {type: "box",layout: "vertical", contents: [
            {type: "text",text: "取消預約",weight: "bold",size: "xl"},
            {type: "box",layout: "vertical",margin: "lg",spacing: "sm",contents: [
                {type: "box",layout: "baseline",spacing: "sm",contents: [{type: "text",text: "取消項目：",color: "#aaaaaa",size: "md",flex: 1}]},
                {type: "box",layout: "baseline",spacing: "sm",contents: [{type: "text",text: `${ts.product}`,wrap: true,color: "#666666",size: "md",flex: 5}
                  ]
                },
                {type: "box",layout: "vertical",margin: "lg",spacing: "sm",contents: [{type: "box",layout: "baseline",spacing: "sm",contents: [
                {type: "text",text: "預約日期：",color: "#aaaaaa",size: "md",flex: 1}]},
                {type: "box",layout: "baseline",spacing: "sm",contents: [{type: "text",text: `${ts.date}`,wrap: true,color: "#666666",size: "md",flex: 5}]}]},
                {type: "box",layout: "vertical",margin: "lg",spacing: "sm",contents: [{type: "box",layout: "baseline",spacing: "sm",contents: [{type: "text",text: "預約時段：",color: "#aaaaaa",size: "md",flex: 1}]},
                {type: "box",layout: "baseline",spacing: "sm",contents: [{type: "text",text: `${ts.time}`,wrap: true,color: "#666666",size: "md",flex: 5}
                      ]}]}]}]},
        footer: {type: "box",layout: "vertical",spacing: "sm",contents: [
            {type :"button",style: "link",height: "sm",action: {type: "postback",label: "YES",data: `content=${ts.product},${ts.date},${ts.time}&confirm=delete`}},
            {type: "button",style: "link",height: "sm",action: {type: "message",label: "NO",text: "請重新選擇服務項目"}},
            {type: "spacer",size: "sm"}],flex: 0
}
     
    }]}}
    )

    }
else if (ts.confirm==='yes'){
  const {Client}= require('pg')
  const con = require('./asyncDB');
  const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
   
     ssl: {
       rejectUnauthorized: false,
          }
          })
  //var env = process.env.NODE_ENV || 'db';
 // var client = require('./config')[env];

 client.connect()
  client.query(`SELECT * FROM reservation 
    WHERE date='${ts.content.split(',')[1]}' AND time='${ts.content.split(',')[2]}'`,(err, result) => {
    if(result.rows.length === 0){client.query(`INSERT INTO reservation (date, time, product,usernum,username) 
           select '${ts.content.split(',')[1]}','${ts.content.split(',')[2]}','${ts.content.split(',')[0]}','${event.source.userId}','${ts.user}'
           `)
           event.reply(`預約成功  感謝${ts.user}${ts.content.split(',')[0]} 服務， 日期：${ts.content.split(',')[1]} ，時段：${ts.content.split(',')[2]}`)
           client.end()
          }
    else{client.query(`SELECT * FROM reservation 
            WHERE date='${ts.content.split(',')[1]}' AND time='${ts.content.split(',')[2]}' AND usernum='${event.source.userId}'`,(err, result) => {
          if(result.rows.length === 0){
            event.reply('此時段已被預約')
            client.end()}
          else{
            event.reply('您已預約此時段')
            client.end()}    
        })
        }
})
}
else if (ts.confirm==='delete'){
  const {Client}= require('pg')
  const con = require('./asyncDB');
  const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
   
     ssl: {
       rejectUnauthorized: false,
          }
          })
  //var env = process.env.NODE_ENV || 'db';
 // var client = require('./config')[env];

 client.connect()
  client.query(`DELETE FROM reservation 
    WHERE date='${ts.content.split(',')[1]}' AND time='${ts.content.split(',')[2]}' AND product='${ts.content.split(',')[0]}'AND usernum='${event.source.userId}'`,(err, result) => {

           event.reply(` 取消預約：${ts.content.split(',')[0]} 服務， 日期：${ts.content.split(',')[1]} ，時段：${ts.content.split(',')[2]} 成功`)
           client.end()

})
}
})
app.post('/', linebotParser);app.listen(process.env.PORT || 3000, () => {
 console.log('Express server start')
});


