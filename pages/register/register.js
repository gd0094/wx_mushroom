// pages/register/register.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        condition: true,
        yb_name: '',
        yb_password: '',
        base64Str: ''
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
     * 微信登录
     */
    wx_login() {
        let that = this//存储外层的this状态
        //调用微信小程序的登录接口
        wx.login({
            success(e) {
                //定义一个临时的对象储存登录信息
                var x = {
                    code: '',
                    avatarUrl: '',
                    nickName: ''
                }
                console.log(e.code);
                x.code = e.code //拿到的code存储在x中
                wx.showModal({
                    title: '温馨提示',
                    content: '微信授权登录后才能正常使用小程序功能',
                    cancelText: '拒绝',
                    confirmText: '同意',
                    success(res) {
                        if (res.confirm) {
                            //调用微信小程序的获取用户信息的接口
                            wx.getUserProfile({
                                desc: '用于完善个人资料', // 声明获取用户个人信息后的用途
                                lang: 'zh_CN',
                                success: (info) => {
                                    //console.log(info)
                                    x.avatarUrl = info.userInfo.avatarUrl
                                    x.nickName = info.userInfo.nickName
                                    //把获取到的信息存储到data中的loginInfo中
                                    that.setData(
                                        {
                                            wx_loginInfo: x
                                        });
                                    //发送数据
                                    let { avatarUrl, nickName } = x//解包
                                    //把用户信息存储到storage中，方便其它地方使用
                                    wx.setStorageSync('avatarUrl', avatarUrl)
                                    wx.setStorageSync('nickName', nickName)
                                    //发送信息到后端
                                    that.handlerLogin(that.data.wx_loginInfo)
                                },
                                fail(e) {
                                    console.log('获取用户信息失败', e)
                                }
                            })
                        }
                        else {
                            console.log("取消")
                        }
                    },
                    fail() {
                        console.log("拒绝")
                    },
                    complete() { }
                })
            },
            fail(e) {
                console.log('fail', e)
                wx.showToast({
                    title: '网络异常',
                    duration: 2000
                })
                return
            }
        })
    },

    /**
     * 向后端发送信息
     * @param {*} loginInfo 
     */
    handlerLogin(loginInfo) {
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/wxlogin',
            method: 'POST',
            data: loginInfo,
            success: (res) => {
                console.log('登录成功', res)
                wx.setStorageSync('token', res.data.token)//将token储存在缓存中
                //跳转到个人中心
                wx.switchTab({
                    url: "/pages/personalCenter/personCenter"
                })
            }
        })
    },


    /**
     * 人脸登录
     */
    faceLogin() {
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed", "original"],
            sourceType: ["camera"],
            success: (res) => {
                this.getBASE64String(res.tempFilePaths[0])
            }
        })
    },

    /**
     * 图片转码，获取BASE64 String
     * @param {*} filePath 
     */
    getBASE64String: function (filePath) {
        let file = wx.getFileSystemManager();
        file.readFile({
            filePath,
            encoding: "base64",
            success: (res) => {
                // console.log(res.data);
                this.setData({
                    base64Str: res.data
                })
                this.searchFace();
            }
        })
    },

    /**
     * 向后端发送人脸信息
     */
    searchFace() {
        wx.showLoading({
            title: '识别中...',
        })
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/searchFace',
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            },
            data: {
                image: this.data.base64Str,
                image_type: "BASE64",
                group_id_list: "1"
            },
            dataType: "json",
            success: (res) => {
                wx.hideLoading()//隐藏加载框
                console.log(res.data)
                if (res.data.code == 200) {
                    wx.setStorageSync('nickName', res.data.nickName)
                    wx.setStorageSync('avatarUrl', res.data.avatarUrl)
                    wx.setStorageSync('token', res.data.token)
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '匹配用户为：' + res.data.nickName,
                        success: (res) => {
                            wx.switchTab({
                                url: "/pages/personalCenter/personCenter"
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: res.data.msg,
                        success: (res) => {

                        }
                    })
                }
            }
        })
    },

    /**
     * 易班登录
     */
    yb_login() {
        if (this.data.yb_name != 0 && this.data.yb_password!=0) {
            var y = {
                username: this.data.yb_name,
                password: this.data.yb_password,
            }
            this.setData({
                yb_loginInfo: y,
            })
            wx.request({
                url: 'https://cvrecognition.work/mushroom/user/yblogin',
                method: 'POST',
                data: this.data.yb_loginInfo,
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        let { avatarUrl, nickName, token } = res.data//解包
                        //把用户信息存储到storage中，方便其它地方使用
                        wx.setStorageSync('avatarUrl', avatarUrl)
                        wx.setStorageSync('nickName', nickName)
                        wx.setStorageSync('token', token)
                        wx.switchTab({
                            url: "/pages/personalCenter/personCenter"
                        })
                    } else {
                        wx.showModal({
                            title: '登录失败',
                            content: '账号或密码错误',
                            confirmText: '确定',
                            showCancel: false
                        })
                    }
                }
            })
        } else {
            wx.showModal({
                title: '登录失败',
                content: '账号或密码不能为空',
                confirmText: '确定',
                showCancel: false
            })
        }
    },

    /**
     * 获取输入框内容
     */
    yb_getname(e) {
        this.setData({
            yb_name: e.detail.value
        })
        //console.log(this.data.yb_name);
    },
    yb_getpassword(e) {
        this.setData({
            yb_password: e.detail.value
        })
        //console.log(this.data.yb_password);
    },
})


