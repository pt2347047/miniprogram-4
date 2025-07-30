0、要求
你是一个经验丰富的ui设计工程师
现在已经创建好了微信小程序的工作目录，不需要新建
1、总体设计
创建一个微信小程序，包含一个首页，每日幸运功能页，每日分享功能页，实用信息功能页，个人信息功能页
2、首页
首页包含上方一个图片框，展示每日幸运社的标题，中间部分有4个按钮，暂时按照每行2个，排成2行，分别对应4个核心功能，最下方是一个包含3个图标的矩形区域，第一个图标是首页，点击会会到首页，第二个图标默认是每日幸运社页面的跳转图标，如果点击会跳转到每日幸运社，如果在首页中间点击每日分享，这个图标也会变成每日分享，如果点击了实用信息，这个图标也会变成实用信息；第三个是图标是“我的”，点击会跳转到个人信息功能页
3、每日幸运页
我需要一个输入框，用户可以输入一段描述文字
一个按钮，用户输入描述文字后，点击按钮，会调用coze大模型的一个接口，返回一个字符串数组，第一项为一组双色球号码，需要设计一行7个球形区域展示，6个红色和1个蓝色。
下方是推荐理由，文本框展示。
具体的api可以参考这个
curl --location --request POST 'https://api.coze.cn/v1/workflow/run' \
--header 'Authorization: Bearer pat_7mftD5otJeN0XKpuv85UOXJKeStekGnQUrJIUdhNSf6pJDCjU5JzTtrcUEAHmywr' \
--header 'Content-Type: application/json' \
--data-raw '{
    "workflow_id": "7530299255577690153",
    "parameters": {
        "user_id":"12345",
        "user_name":"George"
    }
}'
返回示例
{
    "code": 0,
    "cost": "0",
    "data": "{\"output\":\"北京的经度为116.4074°E，纬度为39.9042°N。\"}",
    "debug_url": "https://www.coze.cn/work_flow?execute_id=741364789030728****&space_id=736142423532160****&workflow_id=738958910358870****",
    "msg": "Success",
    "token": 98
}
最下方跟首页一样的三个图标的矩形区域
4、每日分享页
会从一个接口拿到一个消息列表，每条消息包含一个用户名称，用户头像，以及分享内容，并包含一个点赞按钮和点赞数量，这个页面的接口可以moke数据。支持滚动上下翻页
同样的，下方也有跟首页一样功能的三个图标的矩形区域。
5、实用信息页
显示最近一期的双色球中奖号码，跟每日幸运页的7个圆形区域的展示一致，下方还会展示当期幸运人数，实际为左右两个展示框，左边为”幸运人数“字符串，右边为数字，帮我选取一个比较中规中矩的风格。在中奖号码上面显示一下当前的日期。
本页的所有数据从以下接口获取
接口地址
https://jisucpkj.market.alicloudapi.com/caipiao/query
curl -i -k -X ANY 'https://jisucpkj.market.alicloudapi.com/caipiao/query?caipiaoid=11&issueno=2025001'  -H 'Authorization:0b6c35c2eb9f41889ea47c285dd20f87' 
响应为
{
  "status": 0,
  "msg": "ok",
  "result": {
    "caipiaoid": 11,
    "issueno": "2025001",
    "number": "02 03 17 18 22 33",
    "refernumber": "16",
    "opendate": "2025-01-02",
    "deadline": "2025-03-02",
    "saleamount": 404437376,
    "totalmoney": "1792900594.00",
    "prize": [
      {
        "prizename": "一等奖",
        "require": "中6+1",
        "num": 108,
        "singlebonus": 5234395
      },
      {
        "prizename": "二等奖",
        "require": "中6+0",
        "num": 204,
        "singlebonus": 155114
      },
      {
        "prizename": "三等奖",
        "require": "中5+1",
        "num": 1506,
        "singlebonus": 3000
      },
      {
        "prizename": "四等奖",
        "require": "中5+0/4+1",
        "num": 85935,
        "singlebonus": 200
      },
      {
        "prizename": "五等奖",
        "require": "中4+0/3+1",
        "num": 1512786,
        "singlebonus": 10
      },
      {
        "prizename": "六等奖",
        "require": "中2+1/1+1/0+1",
        "num": 6953598,
        "singlebonus": 5
      }
    ]
  }
}
其中number和refernumber表示红蓝球中奖号码，prizename为一等奖的项，num为人数，替换幸运人数的数字
同样的，下方也有跟首页一样功能的三个图标的矩形区域。
6、个人信息
展示一个用户名字以及用户头像，以及加入时间，先使用moke数据
同样的，下方也有跟首页一样功能的三个图标的矩形区域。


