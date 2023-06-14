// pages/forum/forum.js
var app = getApp();
Page({
    data: {
        postList: [], //论坛列表
        token: '',
        loginStatusCode: 0,
        currentPage: 1,
        isloading: '',
        title: '',
        perviewImgList: []
    },
    onLoad() {
        this.getPostsList()
        this.data.token = wx.getStorageSync('token') || []
    },

    /**
     * 设置时间显示格式
     */
    setTimeType() {
        var i = 0
        while (i < this.data.postList.length) {
            var time = "postList.[" + i + "].createTime"
            var str = this.data.postList[i].createTime.toString().substring(0, 16)
            this.setData({
                [time]: str
            })
            i = i + 1
        }
    },
    onShow() {},

    //监听下拉刷新
    onPullDownRefresh() {
        this.setData({
            currentPage: 1,
            postList: [],
            title: ''
        })

        setTimeout(() => {
            this.getPostsList()
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //得到数据后停止下拉刷新
        }, 400)
    },

    //监听上拉触底
    onReachBottom() {
        if (this.data.isloading) return
        this.setData({
            currentPage: this.data.currentPage + 1,
            isloading: true
        })

        wx.request({
            header: {
                'token': wx.getStorageSync('token') || []
            },
            url: 'https://cvrecognition.work/mushroom/post/all',
            method: 'GET',
            data: {
                currentPage: this.data.currentPage
            },
            success: (res) => {
                console.log(res)
                if (res.data.data.length != 0) {
                    this.setData({
                        postList: [...this.data.postList, ...res.data.data],
                    })
                    var i = 0
                    if (this.data.postList[i].images != null) {
                        while (i < this.data.postList.length) {
                            this.setData({
                                ['perviewImgList[' + i + ']']: 'https://cvrecognition.work/mushroom/images/' + this.data.postList[i].images.substring(0, 40),
                            })
                            i = i + 1
                        }
                    }
                    this.setTimeType()
                } else {
                    console.log("到底了")
                }
            },
            complete: () => {
                this.setData({
                    isloading: false
                })
            }
        })
    },

    /**
     * 跳转到发布帖子
     */
    goToPost() {
        this.setData({
            loginStatusCode: wx.getStorageSync('loginStatusCode'),
        })
        console.log(app.globalData.loginStatusCode)
        //判断登陆状态
        if (app.globalData.loginStatusCode == 200) {
            console.log("已登录")
            wx.navigateTo({
                url: '../post/post',
            })
        } else if (app.globalData.loginStatusCode == 500) {
            console.log("未登录")
            wx.showModal({
                title: '温馨提示',
                content: '请登陆后发表帖子',
                confirmText: '登录',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/register/register"
                        })
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: "/pages/forum/forum",
                        })
                    }
                }

            })
        } else {
            if (this.data.token == null) {
                this.past_modal() //调用提示框  
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '请登陆后发表帖子',
                    confirmText: '登录',
                    cancelText: '取消',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: "/pages/register/register"
                            })
                        } else if (res.cancel) {
                            wx.switchTab({
                                url: "/pages/forum/forum",
                            })
                        }
                    }
                })
            }
        }
        //  if(this.data.loginStatusCode==200){            
        //     if(this.data.token!=''){
        //         console.log("已登录")
        //         wx.navigateTo({
        //             url: '../post/post',
        //           })
        //     }else{
        //         console.log("未登录")
        //         wx.showModal({
        //             title: '温馨提示',
        //             content: '请登陆后发表帖子',
        //             confirmText: '登录',
        //             cancelText:'取消',
        //             success (res) {
        //                 if (res.confirm) {
        //                     wx.navigateTo({
        //                         url: "/pages/register/register"
        //                     })
        //                 } else if (res.cancel) {
        //                     wx.switchTab({
        //                         url: "/pages/forum/forum",
        //                     })
        //                 }
        //               }

        //         })
        //     }
        // }
        // else{
        //     this.past_modal()//调用提示框
        // }
    },

    /**
     * 判断是否登录
     */
    regiser() {
        if (this.data.token != '') {
            console.log("已登录")
        } else {
            console.log("未登录")
            wx.showModal({
                title: '温馨提示',
                content: '登录后才能正常使用论坛以及搜索功能',
                confirmText: '登录',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/register/register"
                        })
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: "/pages/forum/forum",
                        })
                    }
                }

            })
        }
    },

    /**
     * 获取列表数据
     */
    getPostsList() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/post/all',
            method: 'GET',
            success: (res) => {
                console.log(res)
                console.log(app.globalData.loginStatusCode)
                this.setData({
                    postList: res.data.data,
                    currentPage: 1
                })
                this.setTimeType()
                var i = 0
                if (this.data.postList[i].images != null) {
                    //多张图片需要分割
                    while (i < this.data.postList.length) {
                        this.setData({
                            ['perviewImgList[' + i + ']']: 'https://cvrecognition.work/mushroom/images/' + this.data.postList[i].images.substring(0, 40),
                        })
                        i = i + 1
                    }
                }
            }
        })
    },

    /**
     * 搜索
     */
    search() {
        this.regiser()
        wx.request({
            header: {
                token: this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/post/search',
            method: "get",
            data: {
                title: this.data.title
            },
            success: (res) => {
                console.log(res)
                this.setData({
                    postList: res.data.data,
                    currentPage: 1,
                    isloading: true
                })
                this.setTimeType()
            }
        })
    },

    //获取搜索文本
    getsearchtitle(e) {
        this.setData({
            title: e.detail.value
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
                        url: "/pages/forum/forum",
                    })
                }
            },
            fail() {
                console.log("拒绝")
            }
        })
    },

    /**
     * 跳转帖子详情
     */
    goToDetail(e) {
        console.log(e.currentTarget.dataset.item)
        wx.setStorageSync('post', e.currentTarget.dataset.item) //缓存帖子主体
        wx.navigateTo({
            url: '../detailPage/detailPage',
        })

    },

})