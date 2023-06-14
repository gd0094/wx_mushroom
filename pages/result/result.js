// pages/result/result.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:"",
        res_Msg:"",
        token:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '检测中',
        })
        var path = wx.getStorageSync('path')
        console.log(path)
        this.setData({
            url: path,
            token:wx.getStorageSync('token') || []
          });
        wx.uploadFile({
          filePath: path.toString(),
          name: 'file',
          header:{
              token:this.data.token
          },
          url: 'https://cvrecognition.work/mushroom/recog/quality',
          formData: {
            'user': 'test'
          },
          success: (res) => {
            console.log(res.data+"Success")
            var res_Msg = res.data
            wx.setStorageSync('res_Msg',res_Msg); 
            this.setData({
                res_Msg:res_Msg
            })
            if(JSON.parse(res.data).msg === '检测不到香菇'){
                wx.hideLoading()
                wx.showModal({
                  title: '照片中没有香菇',
                  confirmText:'重新拍摄',
                  showCancel:false,
                  success(res){
                      if(res.confirm){
                          wx.reLaunch({
                            url: '../index/index',
                          })
                      }
                  }
                })
            }
            else{
                wx.hideLoading()
                wx.showModal({
                    title: "该香菇品质为"+"   "+JSON.parse(res.data).msg,
                    confirmText:'确定',
                    showCancel:false,
                    success(res){
                        if(res.confirm){
                            wx.reLaunch({
                              url: '../index/index',
                            })
                        }
                    }
                  })
            }
          },
          fail: (res) => {
              console.log(res.data)
          },
          complete: (res) => {},
        })
        
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

    }
})