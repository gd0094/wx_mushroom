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
        wx.showToast({
            title: '检测中',
            icon:"loading"
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
          url: 'https://cvrecognition.work/mushroom/recog/growth',
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
                wx.showModal({
                  title: '照片中没有香菇',
                  confirmText:'重新拍摄',
                  showCancel:false,
                  success(res){
                      if(res.confirm){
                          wx.reLaunch({
                            url: '../index1/index',
                          })
                      }
                  }
                })
            }
            else if(JSON.parse(res.data).body === '6-7天')
            {
                wx.showModal({
                    title: "香菇已经到达成型期\n已出菇"+JSON.parse(res.data).msg+"，快成熟了^ ^",
                    confirmText:'确定',
                    showCancel:false,
                    success(res){
                        if(res.confirm){
                            wx.reLaunch({
                              url: '../index1/index',
                            })
                        }
                    }
                  })
            }
            else if(JSON.parse(res.data).msg === '褐变期')
            {
                wx.showModal({
                    title: "香菇处于褐变期",
                    confirmText:'确定',
                    showCancel:false,
                    success(res){
                        if(res.confirm){
                            wx.reLaunch({
                              url: '../index1/index',
                            })
                        }
                    }
                  })
            }
            else {
                wx.showModal({
                    title: "香菇已经到达成型期\n已出菇"+JSON.parse(res.data).msg,
                    confirmText:'确定',
                    showCancel:false,
                    success(res){
                        if(res.confirm){
                            wx.reLaunch({
                              url: '../index1/index',
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