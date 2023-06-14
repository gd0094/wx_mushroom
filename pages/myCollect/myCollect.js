// pages/myCollect/myCollect.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collectList:[],//文章列表
        token:'',
        post:'',
        perviewImgList:[]
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
        this.setData({
            token:wx.getStorageSync('token')|| []
        })
        this.getcollectList()
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
     * 获取我的文章
     */
     getcollectList(){
        wx.request({
            header:{
                'token':this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/user/collect',
            method:'GET',
            success:(res)=>{
                console.log(res)
                if(res.data.code==200){
                    this.setData({
                        collectList:res.data
                    })
                    this.setTimeType()//修改时间格式
                    //设置预览图
                    var i = 0
                    while(i < this.data.collectList.data.length){
                      this.setData({
                          ['perviewImgList['+i+']']:'https://cvrecognition.work/mushroom/images/'+this.data.collectList.data[i].images.substring(0,40),
                      })  
                      i = i + 1
                    }
                }else{
                    wx.showModal({
                        title: '该账号没有收藏文章',
                        content: '快去论坛看看有没有值得收藏的文章吧',
                        confirmText: '确定',
                        showCancel:false,
                        success(res){
                                wx.switchTab({
                                    url: '../personalCenter/personCenter',
                                  })
                                
                        }   
                    })
                }
            }
        })
    },

    /**
     * 存储帖子详情
     * @param {*} e 
     */
    detail(e){
        //console.log(e.currentTarget.dataset.item)
        wx.setStorageSync('post', e.currentTarget.dataset.item)//缓存帖子主体
        this.setData({
            post: wx.getStorageSync('post'),
        })
    },
    
    /**
     * 跳转到帖子详情
     */
    goToDetail(){
        wx.navigateTo({
            url: '../detailPage/detailPage',
          })
    },

    /**
     * 更多按钮
     */
    more(){
        wx.showModal({
            title: '温馨提示',
            content: '是否取消收藏该文章？',
            confirmText: '是',
            cancelText:'否',
            success:(res)=>{
                if(res.confirm){
                    wx.request({
                        url: 'https://cvrecognition.work/mushroom/post/collect/'+this.data.post.id,
                        method:'delete',
                        header:{
                        'token':this.data.token
                        },
                        success:(res)=>{
                        console.log(res)
                            wx.showToast({
                                title: '取消收藏',
                                icon:'none'
                            })
                            this.getcollectList()
                        }
                    })
                }
                }  
            })
        },

    /**
     * 时间格式修改
     */
    setTimeType(){
        var i = 0
        while(i < this.data.collectList.data.length){
            var time = "collectList.data.["+i+"].createTime"     
            var str = this.data.collectList.data[i].createTime.toString().substring(0, 16)
            this.setData({
                [time]:str
            })
            i = i + 1
        }
    },
})