var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:'',
        token:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            token: wx.getStorageSync('token') || []
        })
        if(app.globalData.loginStatusCode != ''){
            console.log('loginStatusCode:'+app.globalData.loginStatusCode)
        }
        else{
            console.log("回调")
            app.callback=(res)=>{
                console.log('loginStatusCode:'+app.globalData.loginStatusCode)
            }
        }
    },

    onShow(){
        if(app.globalData.loginStatusCode != ''){
            console.log('onshow:'+app.globalData.loginStatusCode)
        }
        else{
            console.log("回调")
            app.callback=(res)=>{
                console.log('onshow:'+app.globalData.loginStatusCode)
            }
        }
    },
    onReady(){
        console.log(app.globalData.loginStatusCode)
    },
    introduce(){
        wx.navigateTo({
          url: "../baike/baike"
        })
    },
    howToSort(){
        wx.navigateTo({
          url: '../howToSort/index',
        })
    },
    goToType(){
        wx.navigateTo({
          url:'../typeRec/typeRec',
        })
    },
    goToQuality(){
        wx.navigateTo({
          url: '../index/index',
        })
    },
    goToIntroduction(){
        wx.navigateTo({
          url: '../introduction/introduction?x=0',
        })
    },
    goToCondition(){
        wx.navigateTo({
          url: '../index1/index',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // this.ifLoginfail()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    //轮播图跳转
    swiper1(){
        this.setData({
            title:'香菇品质分类标准'
        })
        wx.request({
            header:{
                token:this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/post/search',
            method:"get",
            data:{
                title:this.data.title
            },
            success:(res)=>{
                console.log(res)
                wx.setStorageSync('post', res.data.data[0])//缓存帖子主体
                wx.navigateTo({
                    url: '../detailPage/detailPage',
                  })
            }
        })
    },
    swiper2(e){
        console.log(e.detail)
        this.setData({
            title:'香菇生长过程'
        })
        wx.request({
            header:{
                token:this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/post/search',
            method:"get",
            data:{
                title:this.data.title
            },
            success:(res)=>{
                console.log(res)
                wx.setStorageSync('post', res.data.data[0])//缓存帖子主体
                wx.navigateTo({
                    url: '../detailPage/detailPage',
                  })
            }
        })
    },
    //判断是否登录失效
    // ifLoginfail(){
    //     wx.request({
    //         url: 'https://cvrecognition.work/mushroom/user/postNum',
    //         method:'GET',
    //         header:{
    //         'token':this.data.token
    //         },
    //         success: (res) =>{
    //             console.log(res.data.code)
    //             //判断是否登录失效
    //             wx.setStorageSync('loginStatusCode', res.data.code)
    //             app.globalData.loginStatusCode = res.data.code
    //         }
    //     })
    // }
})