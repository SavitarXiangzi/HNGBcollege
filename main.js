// ==UserScript==
// @name         HNGBcollege
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       xiangzi
// @match        https://www.hngbwlxy.gov.cn/
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// ==/UserScript==


'use strict';

let myAccount, accName,
    //已获学时
    mySumCredit,
    //课程列表
    myCurrListData,
    //今日已获学时
    todayCredit
    ;

let newWind;

let personalCenter = 'https://www.hngbwlxy.gov.cn/#/personalCenter';

//POST请求头
let myReqHeaders = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
}
let myReqHeaders1 = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}


//获取登录状态
function isLogin() {
    let islogin = false;
    $.ajax({
        type: "POST",
        url: 'https://www.hngbwlxy.gov.cn/api/Page/LoginLong',
        headers: myReqHeaders,
        async: false,
        success: function (data) {
            myAccount = data.Data.Model.Account
            accName = data.Data.Model.Name
            mySumCredit = data.Data.Model.SumCredit
            if (myAccount && accName) {
                islogin = true;
            } else {
                console.log('请重新登陆')
                islogin = false
            }
        },
        error: function () {
            console.log('登陆状态请求失败！')
        }
    })
    return islogin;
}

//获取选课列表
//直接获取后100条数据，简单粗暴
function myCurriculum() {
    myCurrListData = new Array()
    $.ajax({
        type: "POST",
        url: 'https://www.hngbwlxy.gov.cn/api/Page/MyCenter',
        headers: myReqHeaders,
        async: false,
        data: { page: 1, rows: 100, sort: 'BrowseScore', order: 'desc', titleNav: '个人中心', courseType: 'Unfinish' },
        success: function (data) {
            let len = data.Data.ListData.UnfinishModel.length
            let dataList = data.Data.ListData.UnfinishModel
            for (var i = 0; i < len; i++) {
                if (myCurrListData.indexOf(dataList[i]) === -1) {
                    myCurrListData.push(dataList[i])
                }
            }
        },
        error: function () {
            myCurrListData = null
        }
    })
}


//打开课程
// function openPlay() {
//     //拼接视频url
//     let playUrl = 'https://www.hngbwlxy.gov.cn/#/play/play?Id=' + myCurrListData[0].Id
//     newWind = GM_openInTab(playUrl, { active: true, insert: true, setParent: true })
//     // if (document.querySelector('.msConfirm')) {
//     //     document.querySelector('.msConfirm').click()
//     // }
//     // window.open(playUrl, '_blank')
// }

// 播放状态是：visibility: visible
{/* <span class="jwvideo" style="visibility: hidden;opacity: 0;"> */ }

//视频时常
// document.querySelector('#myplayer_controlbar_duration').innerText




//判断是否登录
if (isLogin()) {
    myCurriculum()

    let myUrl = window.location.href
    let myHref

    if (myUrl === personalCenter) {
        setTimeout(() => {
            myHref = document.querySelector('.p-play').href
            document.querySelector('.p-play').click()
            myUrl = window.location.href

        }, 2000)
    }
     if (myUrl === myHref) {
        document.querySelector('.continue-play').click()
    }
} else {
    alert('请先登录账号！')
}

//不加window.onload 就会无限循环打开，不清楚什么原因
// window.onload = ()=> { openPlay() }



