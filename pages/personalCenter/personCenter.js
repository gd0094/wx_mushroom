// pages/personalCenter/personCenter.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '',
        nickName: '未登录',
        token: '',
        myposts: '0',//我的贴子数量
        favoriteposts: '0'//收藏贴子数量
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        this.regiser()
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
     * 跳转到“我的帖子”
     */
    goToMyArticle() {
        wx.navigateTo({
            url: '../myArticle/myArticle'
        })
    },
    /**
     * 跳转到“收藏文章”
     */
    goToMyCollect() {
        wx.navigateTo({
            url: '../myCollect/myCollect',
        })
    },
    /**
     * 跳转到“帮助反馈”
     */
    goToHelp() {
        wx.navigateTo({
            url: '../help/help',
        })
    },
    /**
     * 跳转到“识别记录”
     */
    goToHistory() {
        wx.navigateTo({
            url: '../history/history',
        })
    },
    /**
     * 跳转到“人脸管理”
     */
    goToFaceManage() {
        wx.navigateTo({
            url: '../faceManagement/faceManagement'
        })
    },

    /**
     * 判断是否登录并获取信息
     */
    regiser() {
        var token = wx.getStorageSync('token') || []
        if (token != '') {
            console.log("已登录")
            this.getUserInfo()//获取个人信息
            this.getmyposts()//获取我的贴子数量
            this.getfavoriteposts()//获取收藏文章的数量
        } else {
            console.log("未登录")
            this.login_modal()//调用弹出框
        }
    },

    /**
     * 获取个人信息
     */
    getUserInfo() {
        this.setData({
            nickName: wx.getStorageSync('nickName'),
            avatarUrl: wx.getStorageSync('avatarUrl'),
            token: wx.getStorageSync('token') || []
        })
    },

    //获取我的贴子数量
    getmyposts() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/postNum',
            method: 'GET',
            header: {
                'token': this.data.token
            },
            success: (res) => {
                console.log(res)
                app.globalData.loginStatusCode = res.data.code//将登录状态储存到全局变量
                console.log('loginStatusCode' + app.globalData.loginStatusCode)
                //判断是否登录失效
                if (res.data.code == 200) {
                    if (res.data.msg == null) {
                        this.setData({
                            myposts: 0//没有贴子
                        })
                    } else {
                        this.setData({
                            myposts: res.data.msg
                        })
                    }
                } else {
                    this.past_modal()//调用提示框
                }
            },
            fail: (res) => {
                app.globalData.loginStatusCode = res.data.code
                console.log('loginStatusCode' + app.globalData.loginStatusCode)
            }
        })
    },

    /**
     * 获取我的收藏数量
     */
    getfavoriteposts() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/collect',
            method: 'get',
            header: {
                'token': this.data.token
            },
            success: (res) => {
                console.log(res)
                if (res.data.code == 500) {
                    this.setData({
                        favoriteposts: 0
                    })
                } else {
                    this.setData({
                        favoriteposts: res.data.data.length
                    })
                }
            }
        })
    },

    /**
     * 登录弹出框
     */
    login_modal() {
        wx.showModal({
            title: '温馨提示',
            content: '登录后才能正常使用个人中心',
            cancelText: '取消',
            confirmText: '登录',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: "/pages/register/register"
                    })
                } else {
                    wx.switchTab({
                        url: "/pages/homepage_new/homepage_new",
                    })
                }
            },
            fail() {
                console.log("拒绝")
            }
        })
    },

    /**
     * 登录过期提示框
     */
    past_modal() {
        wx.showModal({
            title: '温馨提示',
            content: '登录已失效，请重新登录',
            cancelText: '取消',
            confirmText: '登录',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: "/pages/register/register"
                    })
                } else {
                    wx.switchTab({
                        url: "/pages/homepage_new/homepage_new",
                    })
                }
            },
            fail() {
                console.log("拒绝")
            }
        })
    },

  /**
   * 退出登录
   */
    quit() {
        wx.showModal({
            title: '温馨提示',
            content: '是否退出登录',
            cancelText: '否',
            confirmText: '是',
            success: (res) => {
                if (res.confirm) {
                    wx.clearStorage()//清空缓存
                    this.setData({
                        nickName: '未登录',
                        avatarUrl: null,
                        myposts: 0,
                        favoriteposts: 0
                    })
                    app.globalData.loginStatusCode = 0
                    wx.switchTab({
                        url: "/pages/homepage_new/homepage_new",
                    })
                }
            }
        })
    }
})