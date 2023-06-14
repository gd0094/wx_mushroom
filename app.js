
// app.js
App({
    
  onLaunch() {
    // 展示本地存储能力
    this.login()
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.loadFontFace({
        family: 'Bitstream Vera Serif Bold',
        source: 'url("https://sungd.github.io/Pacifico.ttf")',
        success: console.log
      })
    console.log(this.globalData.token)
    //从后端首次获取登陆状态的code
    this.getStatusCode()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    token:null,
    avatarUrl:'',
    nickName:'未登录',
    loginStatusCode:''
  },

  getStatusCode(){
    if(this.globalData.token != ''){
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/postNum',
            method:'GET',
            header:{
                'token':this.globalData.token
            },
            success:(res)=>{
                this.globalData.loginStatusCode = res.data.code
                console.log(this.globalData.loginStatusCode)
                if(this.callback){
                    this.callback()
                }
            }
        })
    }
    else(this.globalData.loginStatusCode = 0)
  },
  callback(){
    wx.request({
        url: 'https://cvrecognition.work/mushroom/user/postNum',
        method:'GET',
        header:{
            'token':this.globalData.token
        },
        success:(res)=>{
            this.globalData.loginStatusCode = res.data.code
            console.log(this.globalData.loginStatusCode)
            if(this.callback){
                this.callback()
            }
        }
    })
  },
/*全局存放缓存(全局变量每次重启会被清空暂时弃用)*/
login(){
    this.globalData.avatarUrl=wx.getStorageSync('avatarUrl')
    this.globalData.nickName=wx.getStorageSync('nickName')
    this.globalData.token=wx.getStorageSync('token') || []
    //console.log(this.globalData)
},
})
