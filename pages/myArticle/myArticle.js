// pages/personalCenter/myArticle/myArticle.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myList:[],//文章列表
        token:'',
        nickName:'',
        avatarUrl:'',
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
        this.getUserInfo()
        this.getmyList()
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
     * 获取个人信息
     */
    getUserInfo(){
        this.setData({
            nickName:wx.getStorageSync('nickName'),
            avatarUrl:wx.getStorageSync('avatarUrl'),
            token:wx.getStorageSync('token')|| []
        })
    },

    /**
     * 获取我的文章
     */
    getmyList(){
        wx.request({
            header:{
                'token':this.data.token
            },
            url: 'https://cvrecognition.work/mushroom/user/post',
            method:'GET',
            success:(res)=>{
                console.log(res)
                if(res.data.code==200){
                    this.setData({
                        myList:res.data
                    })
                    this.setTimeType()//调整时间格式
                    //设置预览图
                    var i = 0
                    while(i < this.data.myList.data.length){
                      this.setData({
                          ['perviewImgList['+i+']']:'https://cvrecognition.work/mushroom/images/'+this.data.myList.data[i].images.substring(0,40),//分割出第一张
                      })  
                      i = i + 1
                    }
                }else{
                    wx.showModal({
                        title: '该账号还没发过文章',
                        content: '是否尝试发一篇文章？',
                        confirmText: '是',
                        cancelText:'否',
                        success(res){
                            if(res.confirm){
                                wx.navigateTo({
                                    url: '../post/post',
                                  })
                                }
                        }   
                    })
                }
            }
        })
    },

    /**
     * 获取帖子信息
     * @param {*} e 
     */
    detail(e){
        //console.log(e.currentTarget.dataset.item)
        let post=e.currentTarget.dataset.item
        //储存本人的头像和名称
        post.nickName=this.data.nickName
        post.avatarUrl=this.data.avatarUrl
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
            content: '是否删除该文章？',
            confirmText: '是',
            cancelText:'否',
            success:(res)=>{
                if(res.confirm){
                    wx.request({
                        header:{
                            'token':this.data.token
                        },
                        url: 'https://cvrecognition.work/mushroom/user/post/'+this.data.post.id,
                        method:'delete',
                        success:(res)=>{
                            console.log(res)
                            wx.showToast({
                                title: '删除成功',
                                icon:'none'
                            })
                            this.getmyList()
                        }
                    })
                }
            }   
        })
    },

    /**
     * 修改时间格式
     */
    setTimeType(){
        var i = 0
        while(i < this.data.myList.data.length){
            var time = "myList.data.["+i+"].createTime"     
            var str = this.data.myList.data[i].createTime.toString().substring(0, 16)
            this.setData({
                [time]:str
            })
            i = i + 1
        }
    },
})