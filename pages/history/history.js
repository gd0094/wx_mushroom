// pages/history/history.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        history: [],
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (app.globalData.loginStatusCode != '') {
            console.log('loginStatusCode:' + app.globalData.loginStatusCode)
        } else {
            console.log("回调")
            app.callback = (res) => {
                console.log('loginStatusCode:' + app.globalData.loginStatusCode)
            }
        }
        this.setData({
            token: wx.getStorageSync('token') || []
        }),
            this.gethistory()

    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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

    /**
     * 获取搜索历史
     */
    gethistory() {
        wx.request({
            header: {
                token: this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/recog/history',
            method: 'GET',
            success: (res) => {
                console.log(res)
                if (res.data.code != 500) {
                    this.setData({
                        history: res.data.data
                    })
                    this.setTimeType()
                }

            }
        })
    },
    /**
     * 设置时间格式
     */
    setTimeType() {
        var i = 0
        while (i < this.data.history.length) {
            var time = "history.[" + i + "].createTime"
            var str = this.data.history[i].createTime.toString().substring(0, 16)
            this.setData({
                [time]: str
            })
            i = i + 1
        }
    },

    goToDetail(e){
        console.log('https://cvrecognition.work/mushroom/images/'+e.currentTarget.dataset.item.image)
        var path = 'https://cvrecognition.work/mushroom/images/'+e.currentTarget.dataset.item.image
        wx.setStorageSync('path', path)
        wx.navigateTo({
          url: '../recResult/recResult',
        })
    }
})