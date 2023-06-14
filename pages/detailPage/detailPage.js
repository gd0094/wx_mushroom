// pages/detailPage/detailPage.js
var app = getApp()
Page({
    data: {
        token: 0,
        post: '',
        img_show: true,
        imgUrl: [],
        like_icon: [],
        likeCount: 0,
        collectIcon: '../images/collect_num.png',
        collectCount: 0,
        postTime: '',
        commentUrl: 'https://cvrecognition.work/mushroom/comments/all/',
        placeholder: '',
        commentText: '',
        //发送评论所需要的
        commentContent: '',
        answerid: 0,
        parentid: 0,
        issend: '',
        //postId可以直接读取所以不设置

        commentList: [],
        singlecomment: [],
        focus: false,
        index: ''
    },
    onLoad() {
        this.setData({
            post: wx.getStorageSync('post'),
            token: wx.getStorageSync('token'),
        })
        if (this.data.post.images != '') {
            var imgArr = this.data.post.images.split(',')
            var j = 0
            //当帖子有多张图片时需要分割
            while (j < imgArr.length) {
                this.setData({
                    ['imgUrl[' + j + ']']: 'https://cvrecognition.work/mushroom/images/' + imgArr[j],
                })
                j = j + 1
            }
        }
        //获取帖子链接
        this.setData({
            commentUrl: this.data.commentUrl + this.data.post.id
        })
        this.setTimeType()
        this.showCollect()
        this.showLike()
    },
    onShow() {
        this.getComment()
    },

    /**
     * 设置发送的评论内容
     */
    setCommentContent: function (e) {
        this.setData({
            commentContent: e.detail,
            focus: true
        })
    },
    /**
     * 获取评论
     */
    getComment: function () {
        wx.request({
            header: {
                'token': this.data.token
            },
            url: this.data.commentUrl,
            method: 'GET',
            success: (res) => {
                console.log('获取成功')
                this.setData({
                    commentList: res.data.data
                })
                console.log(this.data.commentList)
                //以下是加载点赞图标的代码
                var i = 0
                while (i < this.data.commentList.length) {
                    if (this.data.commentList[i].isLiked == 1) {
                        this.setData({
                            ['like_icon[' + i + ']']: '../images/like_bright.png'
                        })
                    } else {
                        this.setData({
                            ['like_icon[' + i + ']']: '../images/like.png'
                        })
                    }
                    i = i + 1
                }
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },
    /**
     * 设置时间显示格式
     */
    setTimeType() {
        var str = this.data.post.createTime.toString().substring(0, 16)
        this.setData({
            postTime: str
        })
        var i = 0
        while (i < this.data.commentList.length) {
            var time = "commentList.[" + i + "].createTime"
            var str = this.data.commentList[i].createTime.toString().substring(0, 16)
            this.setData({
                [time]: str
            })
            i = i + 1
        }
    },
    /**
     * 失去焦点
     */
    bindblur() {
        this.setData({
            answerid: 0,
            parentid: 0,
            placeholder: '',
            focus: false
        })
        console.log('失去焦点')
    },

    /**
     * 点击图片放大
     */
    showPic: function (e) {
        var current = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.imgUrl[current],
            urls: this.data.imgUrl
        })
    },

    /**
     * 帖子点赞
     */
    like() {
        this.ifLoginfail()
        if (this.data.likeIcon == '../images/like.png') {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/post/like/' + this.data.post.id,
                method: 'get',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '点赞成功',
                            icon: 'none'
                        })

                        this.setData({
                            likeIcon: '../images/like_bright.png',
                            'post.liked': this.data.post.liked + 1
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/post/like/' + this.data.post.id,
                method: 'delete',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '取消点赞',
                            icon: 'none'
                        })
                        this.setData({
                            likeIcon: '../images/like.png',
                            'post.liked': this.data.post.liked > 0 ? this.data.post.liked - 1 : 0
                        })
                    }
                }
            })
        }

    },

    /**
     * 帖子点赞按钮显示
     */
    showLike() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/post/one/' + this.data.post.id,
            method: 'GET',
            header: {
                'token': this.data.token
            },
            success: (res) => {
                console.log(res)
                if (res.data.code == 200) {
                    if (res.data.likeCount == 0) {
                        this.setData({
                            likeIcon: '../images/like.png'
                        })
                    } else {
                        this.setData({
                            likeIcon: '../images/like_bright.png'
                        })
                    }
                } else {
                    this.setData({
                        likeIcon: '../images/like.png'
                    })
                }
            }
        })
    },

    /**
     * 帖子收藏
     */
    collet() {
        this.ifLoginfail()
        if (this.data.collectIcon == '../images/collect_num.png') {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/post/collect/' + this.data.post.id,
                method: 'get',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'none'
                        })
                        this.setData({
                            collectIcon: '../images/collect_num1.png',
                            'post.collected': this.data.post.collected + 1
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/post/collect/' + this.data.post.id,
                method: 'delete',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '取消收藏',
                            icon: 'none'
                        })
                        this.setData({
                            collectIcon: '../images/collect_num.png',
                            'post.collected': this.data.post.collected - 1 > 0 ? this.data.post.collected - 1 : 0
                        })
                    }
                }
            })
        }
    },
    /**
     * 帖子收藏按钮显示
     */
    showCollect() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/post/one/' + this.data.post.id,
            method: 'GET',
            header: {
                'token': this.data.token
            },
            success: (res) => {
                console.log(res)
                if (res.data.code == 200) {
                    if (res.data.collectCount == 0) {
                        this.setData({
                            collectIcon: '../images/collect_num.png'
                        })
                    } else {
                        this.setData({
                            collectIcon: '../images/collect_num1.png'
                        })
                    }
                } else {
                    this.setData({
                        collectIcon: '../images/collect_num.png'
                    })
                }
            }

        })
    },

    /**
     * 获取评论信息
     */
    getCommentinfo(e) {
        let data = this.data.commentList[e.currentTarget.dataset.categoryindex] //精确定位当前评论
        this.setData({
            index: e.currentTarget.dataset.categoryindex,
            singlecomment: data,
        })
        console.log(this.data.singlecomment)
    },

    /**
     * 评论点赞
     */
    commentlike() {
        this.ifLoginfail()
        // 判断条件：绑定后端的icon
        if (this.data.like_icon[this.data.index] == '../images/like.png') {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/comments/like/' + this.data.singlecomment.id,
                method: 'get',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '点赞成功',
                            icon: 'none'
                        })
                        //点赞成功变换点赞图标
                        this.setData({
                            ['like_icon[' + this.data.index + ']']: '../images/like_bright.png',
                        })
                    }
                    wx.request({
                        url: this.data.commentUrl,
                        method: 'GET',
                        success: (res) => {
                            console.log(res)
                            console.log('获取成功')
                            this.setData({
                                commentList: res.data.data
                            })
                        }
                    })
                }
            })
        } else if (this.data.like_icon[this.data.index] == '../images/like_bright.png') {
            wx.request({
                url: 'https://cvrecognition.work/mushroom/comments/like/' + this.data.singlecomment.id,
                method: 'delete',
                header: {
                    'token': this.data.token
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '取消点赞',
                            icon: 'none'
                        })
                        this.setData({
                            ['like_icon[' + this.data.index + ']']: '../images/like.png'
                        })

                    }
                    wx.request({
                        url: this.data.commentUrl,
                        method: 'GET',
                        success: (res) => {
                            console.log('获取成功')
                            this.setData({
                                commentList: res.data.data
                            })
                        }
                    })
                }
            })

        }
    },

    /**
     * 回复评论
     */
    replyCommentAction() {
        console.log('评论的回复')
        this.setData({
            placeholder: '回复@ ' + this.data.singlecomment.nickName,
            parentid: this.data.singlecomment.id,//一级评论id
            focus: true
        })
        console.log(this.data.singlecomment)
    },

    /**
     * 回复的回复
     */
    replyReplyAction(e) {
        console.log(e.currentTarget.dataset.item.nickName)
        console.log('回复的回复')
        this.setData({
            placeholder: '回复@ ' + e.currentTarget.dataset.item.nickName,
            parentid: e.currentTarget.dataset.item.parentid,
            answerid: e.currentTarget.dataset.item.id,//二级评论id
            focus: true
        })
        console.log('回复的回复',this.data.singlecomment)
    },

    /**
     * 发送评论
     */
    send: function () {
        this.ifLoginfail()
        if (this.data.commentContent != '') {
            this.setData({
                issend: true
            })
            if (this.data.issend) {
                wx.request({
                    header: {
                        'token': this.data.token
                    },
                    url: 'https://cvrecognition.work/mushroom/comments/save',
                    method: 'POST',
                    data: {
                        postid: this.data.post.id,
                        parentid: this.data.parentid,
                        answerid: this.data.answerid,
                        content: this.data.commentContent
                    },
                    success: (res) => {
                        console.log(res.data)
                        if (res.data.code == 200) {
                            wx.showToast({
                                title: '评论成功',
                            })
                            this.setData({
                                focus: false,
                                placeholder: '',
                                commentText: '',
                                commentContent: '',
                                issend: false
                            })
                            this.onShow()
                        }
                    }
                })
            }
        } else {
            wx.showToast({
                title: '请输入评论内容',
                icon: 'error'
            })
        }
    },

    /**
     * 判断登陆是否失效
     */
    ifLoginfail() {
        var logCode = app.globalData.loginStatusCode
        console.log('登录代码:' + logCode)
        if (logCode == 200) {} else {
            wx.showModal({
                title: '温馨提示',
                content: '登录后才可使用评论或点赞功能',
                cancelText: '取消',
                confirmText: '登录',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/register/register"
                        })
                    }
                },
                fail() {
                    console.log("拒绝")
                },
                complete() {}
            })
        }
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
                content: '登录后才能正常使用点赞及评论功能',
                confirmText: '登录',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/register/register"
                        })
                    }
                }

            })
        }
    },
    onReady: function () {},
    onScrollLoad: function () {},
})