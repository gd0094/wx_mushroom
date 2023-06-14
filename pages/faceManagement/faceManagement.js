// pages/faceManagement/faceManagement.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        faceList: '',
        imageSrc: "",
        face_list: "",
        ratio: 1,
        base64Str: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getprompt()
        this.getFaceInfo();
    },

    /**
     * 选择图片
     */
    handleClick: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed", "original"],
            sourceType: ["album", "camera"],
            success: (res) => {
                wx.showLoading({
                    title: '添加中...',
                })
                // 把图片路径展示到页面上
                const imageSrc = res.tempFilePaths[0]
                this.setData({
                    imageSrc
                })
                wx.getImageInfo({
                    src: imageSrc,
                    success: (res) => {
                        console.log(300 / res.width);
                        this.setData({
                            ratio: 300 / res.width
                        })
                        // 获取base64 编码
                        //this.getBASE64String(imageSrc);
                        this.uploadFace();
                    }
                })
            }
        })
    },

    //上传图片
    uploadFace() {
        wx.uploadFile({
            filePath: this.data.imageSrc,
            name: 'file',
            url: 'https://cvrecognition.work/mushroom/user/addFace',
            formData: {
                'group_id_list': '1',
                'image_type': 'BASE64'
            },
            header: {
                'token': wx.getStorageSync('token')
            },
            success: (res) => {
                wx.hideLoading()
                console.log(res)
                const data = JSON.parse(res.data);
                if (data.code == 200) {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '添加成功',
                        success: (res) => {
                            this.getFaceInfo()
                        }
                    })
                    this.setData({
                        face_list: data.result
                    })
                } else if (data.code == 223105) {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '人脸库已存在该人脸',
                        success: (res) => {

                        }
                    })
                } else {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '添加失败',
                        success: (res) => {

                        }
                    })
                }
            }
        })
    },

    /**
     * 获取人脸信息
     */
    getFaceInfo() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/user/getFaceInfo',
            header: {
                'token': wx.getStorageSync('token')
            },
            success: (res) => {
                console.log(res)
                if (res.data.code == 200) {
                    this.setData({
                        faceList: res.data.list
                    })
                } else {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '人脸库中未查询到人脸信息',
                        success: (res) => {

                        }
                    })
                }

            }
        })
    },

    /**
     * 删除人脸
     * @param {}} e 
     */
    delFace(e) {
        console.log(e)
        wx.showModal({
            title: '温馨提示',
            content: '是否删除该人脸？',
            confirmText: '是',
            cancelText: '否',
            success: (res) => {
                if (res.confirm) {
                    const faceToken = e.currentTarget.dataset.item;
                    wx.request({
                        url: 'https://cvrecognition.work/mushroom/user/delFace',
                        header: {
                            'token': wx.getStorageSync('token'),
                            "content-type": "application/x-www-form-urlencoded",
                        },
                        data: {
                            'face_token': faceToken
                        },
                        success: (res) => {
                            console.log(res)
                            if (res.data.code == 200) {
                                wx.showModal({
                                    showCancel: false,
                                    title: '提示',
                                    content: '删除成功',
                                    success: (res) => {
                                        this.getFaceInfo()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })

    },
    /**
     * 页面提示框
     */
    getprompt() {
        wx.showModal({
            showCancel: false,
            title: '温馨提示',
            content: "录入的人脸信息将绑定于当前账号，使用于人脸登录",
            success: (res) => {
            }
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