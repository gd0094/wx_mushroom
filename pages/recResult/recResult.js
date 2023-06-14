Page({
    data: {
        result:'',
        imgUrl:'',
        token:''
    },

    onLoad(options) {
        wx.showLoading({
          title: '识别中',
        })
        //设置识别结果并且传递图片
        this.setData({
            imgUrl: wx.getStorageSync('path').toString(),
            token:wx.getStorageSync('token') || []
        })
        console.log(this.data.imgUrl)
        wx.uploadFile({
          filePath: this.data.imgUrl,
          name: 'file',
          header:{
            token:this.data.token
        },
          url: 'https://cvrecognition.work/mushroom/recog/kind',
          success: (res)=>{
              wx.hideLoading({
                success: (res) => {
                    wx.showToast({
                      title: '识别完成',
                      icon:'success'
                    })
                },
              })
              console.log(JSON.parse(res.data))
              const msg = JSON.parse(res.data).msg
              if(msg == '检测不到香菇'){
                this.setData({
                    remind_msg:'抱歉,系统没有检测到蘑菇',
                    result:'抱歉,系统没有检测到蘑菇'
                })
              }
              else{
                  this.setData({
                      remind_msg:'该蘑菇的种类最接近：'+msg,
                      result:msg
                  })
              }

              
          }
        })
    },
    /**
     * 回到首页
     */
    goToHomePage(){
        wx.switchTab({
          url: '../homepage_new/homepage_new',
        })
    },
    /**
     * 跳转蘑菇介绍页面
     */
    getToIntrodution(){
        wx.setStorageSync('result', this.data.result)
        wx.navigateTo({
          url: "../introduction/introduction?x=1",
        })
    },
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

    }
})