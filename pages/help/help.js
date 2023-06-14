var app = getApp()
var util = require('../../utils/util.js')
// pages/help/help.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        token: '',
        images: [],
        images_1: [],
        content: '',
        token: '',
        delete_img1: '',
        images_upload: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            nickName: wx.getStorageSync('nickName'),
            avatarUrl: wx.getStorageSync('avatarUrl'),
            token: wx.getStorageSync('token') || [],
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

    },

    /**
     * 获取输出内容
     * @param {} e 
     */
    contentInput: function (e) {
        this.setData({
            content: e.detail.value
        })
    },

    /**
     * 选择图片
     * @param {*} e 
     */
    chooseImage: function (e) {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                const images = res.tempFilePaths
                var that = this
                this.setData({
                    images: that.data.images.concat(images)
                })
                var token = wx.getStorageSync('token') || []
                for (var i = 0; i < images.length; i++) {
                    wx.uploadFile({
                        header: {
                            'token': token
                        },
                        url: 'https://cvrecognition.work/mushroom/post/upload',
                        filePath: images[i],
                        name: 'file',
                        success: function (res) {
                            that.setData({
                                images_1: that.data.images_1.concat(JSON.parse(res.data).fileList)
                            })
                            console.log("图片成功")
                            console.log(that.data.images_1)
                        },
                        fail: function (error) {
                            console.log("图片失败"),
                                console.log(error)
                        }
                    })
                }
            }
        })
    },

    /**
     * 删除照片
     * @param {*} e 
     */
    removeImage(e) {
        const idx = e.target.dataset.idx;//照片索引  
        this.setData({
            delete_img: this.data.images_1[idx]//删除图片名称
        })
        //删除特定下标的图片
        this.data.images.splice(idx, 1)
        this.data.images_1.splice(idx, 1)
        var del_image = this.data.images;
        this.setData({
            images: del_image,
        })
        wx.request({
            header: {
                "content-type": "application/x-www-form-urlencoded",
                'token': this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/post/upload',
            method: 'delete',
            data: {
                'fileName': this.data.delete_img
            },
            success: (res) => {
                console.log(res)
            }
        })
    },

    /**
     * 点击放大图片
     * @param {*} e 
     */
    handleImagePreview(e) {
        var current = e.currentTarget.dataset.idx;
        wx.previewImage({
            current: this.data.images[current],
            urls: this.data.images
        })
    },

    /**
     * 提交按钮
     * @param {*} e 
     */
    formSubmit: function (e) {
        this.upload(e)
    },
    upload: function (e) {
        //没图片
        if (this.data.images[0] == null) {
            if (this.data.content != '') {
                wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '提示',
                    content: '确认提交',
                    cancelText: '取消',
                    confirmText: '提交',
                    success: (res) => {
                        if (res.confirm) {
                            for (var i = 0; i < this.data.images_1.length; i++) {
                                this.setData({
                                    images_upload: this.data.images_upload + ',' + this.data.images_1[i]
                                })
                            }
                            wx.request({
                                header: {
                                    'token': this.data.token
                                },
                                url: 'https://cvrecognition.work/mushroom/user/feedback',
                                method: 'POST',
                                data: {
                                    'content': this.data.content,
                                    'images': this.data.images_upload
                                },
                                success: (res) => {
                                    console.log("纯文本成功")
                                    console.log(res)
                                    wx.showModal({
                                        showCancel: false,
                                        title: '提交成功',
                                        content: '感谢您提出宝贵的建议',
                                        success: (res) => {
                                            if (res.confirm) {
                                                wx.switchTab({
                                                    url: '../help/help',
                                                })
                                            }
                                        }
                                    })
                                },
                                fail: (res) => {
                                    console.log("文本失败")
                                    console.log(res)
                                }
                            })
                        }
                    }
                })
            }
            else {
                wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '请填写信息!',
                })
            }
        }
        //有图片
        else {
            if (this.data.content != '') {
                wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '提示',
                    content: '确认提交？',
                    cancelText: '取消',
                    confirmText: '提交',
                    success: (res) => {
                        for (var i = 0; i < this.data.images_1.length; i++) {
                            this.setData({
                                images_upload: this.data.images_upload + ',' + this.data.images_1[i]
                            })
                        }
                        if (res.confirm) {
                            wx.request({
                                header: {
                                    'token': this.data.token
                                },
                                url: 'https://cvrecognition.work/mushroom/user/feedback',
                                method: 'POST',
                                data: {
                                    'content': this.data.content,
                                    'images': this.data.images_upload
                                },
                                success: (res) => {
                                    console.log(res)
                                    wx.showModal({
                                        showCancel: false,
                                        title: '提交成功',
                                        content: '感谢您提出宝贵的建议',
                                        success: (res) => {
                                            if (res.confirm) {
                                                wx.switchTab({
                                                    url: '../help/help',
                                                })
                                            }
                                        }
                                    })
                                },
                                fail: (res) => {
                                    console.log("文本失败")
                                    console.log(res)
                                }
                            })
                        }
                    }
                })
            }
            else {
                wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '请填写信息!',
                })
            }
        }
    }
})