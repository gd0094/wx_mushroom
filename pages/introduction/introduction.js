var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: ['丝膜菌', '乳牛肝菌', '口蘑', '奶浆菌', '平菇', '杏鲍菇', '松乳菇', '松树菌', '松茸', '松露', '榛蘑', '毒蝇伞', '海鲜菇', '湿伞', '灵芝', '牛肝菌', '猴头菇', '竹荪', '粉褶菌', '红菇', '羊肚菌', '致命鹅膏', '茶树菇', '草菇', '蘑菇', '金针菇', '青头菌', '香菇', '鸡油菌', '鹅膏菌'],
        rightList: [],//右侧内容列表
        rightContext: [],//右侧当前内容
        scrollTop: 0,//设置竖向滚动条位
        currentIndex: 0,//当前选中菜单的索引
        title: '',
        image: '',
        result: ''
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //判断登录状态
        if (app.globalData.loginStatusCode != '') {
            console.log('loginStatusCode:' + app.globalData.loginStatusCode)
        } else {
            console.log("回调")
            app.callback = (res) => {
                console.log('loginStatusCode:' + app.globalData.loginStatusCode)
            }
        }
        this.getcontent()//获取内容
        //判断是从哪里进入介绍页面
        if (options.x == 0) {
            this.setData({
                result: '丝膜菌'
            })
        } else if (options.x == 1) {
            this.getindex()
        }
    },

    onshow() {

    },
    /**
     * 左侧菜单点击切换事件
     * @param {*} e 
     */
    handleMenuItemChange(e) {
        const index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index,
            rightContext: this.data.rightList[index],
            scrollTop: 0
        })
    },

    /**
     * 右侧内容获取
     */
    getcontent() {
        wx.request({
            url: 'https://cvrecognition.work/mushroom/mushroom/list',
            method: 'get',
            success: (res) => {
                this.setData({
                    rightList: res.data.mushroomList,
                    rightContext: res.data.mushroomList[this.data.currentIndex],
                })
            }
        })
    },

    /**
     * 获取搜索文本
     * @param {*} e 
     */
    getsearchtitle(e) {
        this.setData({
            title: e.detail.value
        })

    },

    /**
     * 搜索
     */
    search() {
        var arr = this.data.leftMenuList
        var index = arr.map(item => item).indexOf(this.data.title)//根据内容获取下标
        if (index == -1) {
            wx.showModal({
                showCancel: false,
                title: '抱歉',
                content: "该内容暂时没有",
                success: (res) => {
                }
            })
        } else {
            //console.log(index)  
            this.setData({
                currentIndex: index,
                rightContext: this.data.rightList[index],
                scrollTop: 0
            })
        }
    },

    /**
     * 识别结果跳转过来获取结果序列
     */
    getindex() {
        this.setData({
            result: wx.getStorageSync('result')
        })
        var arr = this.data.leftMenuList
        var index = arr.map(item => item).indexOf(this.data.result)
        if (index == -1) {
            wx.showModal({
                showCancel: false,
                title: '抱歉',
                content: "该内容暂时没有",
                success: (res) => {
                }
            })
        } else {
            //console.log(index)  
            this.setData({
                currentIndex: index,
                rightContext: this.data.rightList[index],
                scrollTop: 0
            })
        }
    }
})