var app = getApp()
var util = require('../../utils/util.js')
Page({
    /**
   * 页面的初始数据
   */
    data: {
        images: [],
        content: '',
        title: '',
        token: '',
        images_upload: '',
        loginStatusCode: 0,
        images_1: []
    },
    onShow: function () {
        this.setData({
            loginStatusCode: wx.getStorageSync('loginStatusCode'),
            token: wx.getStorageSync('token') || []
        })
        if (app.globalData.loginStatusCode == 200) { }
        else {
            this.past_modal()//调用提示框
        }
    },
    /*登录过期提示框*/
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
    titleInput: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    contentInput: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    chooseImage: function (e) {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                //console.log(res)
                //const images = this.data.images.concat(res.tempFilePaths)
                //this.setData({
                // images: images,
                // images_upload:''
                //})
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


    removeImage(e) {
        const idx = e.target.dataset.idx;//照片索引  
        this.setData({
            delete_img: this.data.images_1[idx],//删除图片名称

        })
        this.data.images.splice(idx, 1)
        this.data.images_1.splice(idx, 1)
        var del_image = this.data.images;
        this.setData({
            images: del_image,
        })
        /* 
        if(this.data.images.length>0){  
            let upload=this.data.images_upload.split(',')//将字符串分割成数组对象  
            var upload_image=upload[idx]  
            upload.splice(idx,1)//删除指定对象  
            //拼接  
            var splice_string=''  
            for(var i=0;i<upload.length;i++){  
                if(upload[i]==''){  
                    continue  
                }else{  
                    if(splice_string==''){  
                        splice_string=upload[i]  
                    }else{  
                        splice_string=splice_string +','+upload[i]  
                    }  
                }  
            }  
            console.log(upload)  
            this.setData({  
                images_upload:splice_string,//删除后字符串  
                delete_img:upload_image//删除的图片  
            })  
                
        }else{  
            this.setData({  
                delete_img:this.data.images_upload,//删除图片  
                images_upload:''//删除后字符串  
            })  
        }  
        */
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
    handleImagePreview(e) {
        const idx = e.target.dataset.idx
        const images = this.data.images
        wx.previewImage({
            current: images[idx], //当前预览的图片
            urls: images, //所有要预览的图片
        })
    },
    formSubmit: function (e) {
        this.upload(e)
    },
    upload: function (e) {
        if (this.data.images[0] == null) {
            if (this.data.title != '' && this.data.content != '') {
                wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '提示',
                    content: '确认发布？',
                    cancelText: '取消',
                    confirmText: '发布',
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
                                url: 'https://cvrecognition.work/mushroom/post/save',
                                method: 'POST',
                                data: {
                                    'title': this.data.title,
                                    'content': this.data.content,
                                    'images': this.data.images_upload
                                },
                                success: (res) => {
                                    console.log("纯文本成功")
                                    console.log(res)
                                    wx.showModal({
                                        showCancel: false,
                                        title: '提示',
                                        content: '发布成功，等待审核',
                                        success: (res) => {
                                            if (res.confirm) {
                                                wx.switchTab({
                                                    url: '../forum/forum',
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
                    content: '请填写必填字段!',
                })
            }
        }
        else {
            if (this.data.title != '' && this.data.content != '') {
                wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '提示',
                    content: '确认发布？',
                    cancelText: '取消',
                    confirmText: '发布',
                    success: (res) => {
                        if (res.confirm) {
                            for (var i = 0; i < this.data.images_1.length; i++) {
                                if (this.data.images_upload != '') {
                                    this.setData({
                                        images_upload: this.data.images_upload + ',' + this.data.images_1[i]
                                    })
                                } else {
                                    this.setData({
                                        images_upload: this.data.images_1[i]
                                    })
                                }
                            }
                            wx.request({
                                header: {
                                    'token': this.data.token
                                },
                                url: 'https://cvrecognition.work/mushroom/post/save',
                                method: 'POST',
                                data: {
                                    'title': this.data.title,
                                    'content': this.data.content,
                                    'images': this.data.images_upload
                                },
                                success: (res) => {
                                    console.log(res)
                                    wx.showModal({
                                        showCancel: false,
                                        title: '提示',
                                        content: '发布成功，等待审核',
                                        success: (res) => {
                                            if (res.confirm) {
                                                wx.switchTab({
                                                    url: '../forum/forum',
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
                    content: '请填写必填字段!',
                })
            }
        }
    }
})