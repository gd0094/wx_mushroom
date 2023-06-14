Page({
    data:{
      token:'',
      url:"",
      showModal:false,
      single:true,
      showDialog: false,
      uploadUrl:"",
      result:"",
      city:'',// 省
      district:'',// 市区
      street: '', // 街道
      weather:'',//天气信息
      weatherIconPic:'',//天气图标
      weatherAir:'',//空气质量
      showWeather:false,
      useMsgPic:'../images/howToUse1.png',
    },
    onLoad(){
        this.getCity();
        this.getGPS();
        this.setData({
            token:wx.getStorageSync('token') || []
        })
    },
    showWeather(){
      this.setData({
          showWeather: !this.data.showWeather
      })
    },

    checkboxChange(e){
       if(this.data.showMsg === 1){ 
           this.setData({
               showMsg:0
              })
          }
       else if(this.data.showMsg == 0){
           this.setData({
               showMsg:1
           })
       }
      },
  
    takePhoto() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
              const tempFilePaths = res.tempImagePath
              console.log(tempFilePaths)
              var path = tempFilePaths
              wx.setStorageSync('path',path); 
              wx.navigateTo({
                  url: '../result/result',
                })
              },
              error(e){
                  console.log(e.detail)
              }
          })
      },
     toggleDialog() {
        this.setData({
            showDialog: !this.data.showDialog
          });
          if(this.data.showDialog === true){
            this.setData({
                useMsgPic:"../images/howToUse.png"
            })
        }
        else{
            this.setData({
                useMsgPic:"../images/howToUse1.png"
            })
        }
      },
      toggleDialog1(){
        this.setData({
            showDialog: !this.data.showDialog
          });
        if(this.data.showDialog === true){
            this.setData({
                useMsgPic:"../images/howToUse.png"
            })
        }
        else{
            this.setData({
                useMsgPic:"../images/howToUse1.png"
            })
        }
       
      },
    choosePhoto:function(e){
        wx.chooseImage({
          count:1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success(res){
              const tempFilePaths = res.tempFilePaths
              console.log(tempFilePaths[0])
              var path = tempFilePaths
              wx.setStorageSync('path',path); 
              wx.navigateTo({
                url: '../result/result',
              })
      }
  })},
  getGPS: function(e) {
      const that = this
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          var latitude = res.latitude // 纬度
          var longitude = res.longitude // 经度
          var speed = res.speed
          var accuracy = res.accuracy
          that.getCity(latitude, longitude)
        }
      })
    },
    getCity:function(lat, long){
        wx.showLoading({
          title: '加载中...',
          icon: 'loading',
          duration: 10000
        });
        var that = this
        var url="https://api.map.baidu.com/reverse_geocoding/v3/"
        var latitude = lat
        var longtitude = long
        var params = {
            ak:"GRKEC7B2CeBKwgdRz2Ux1oKpUEpB4qAC",
            output:"json",
            location:latitude + "," + longtitude
        };
        wx.request({
          url: url,
          data:params,
          success:function(res){
              wx.hideLoading();        
              var city = res.data.result.addressComponent.city; // 省
              var district = res.data.result.addressComponent.district; // 市区
              var street = res.data.result.addressComponent.street; // 街道
              var descCity = city.substring(0, city.length - 1);
              that.getWeather(descCity)
              that.getWeatherAir(descCity)
              that.setData({
                  city:city,
                  district:district,
                  street:street
              })
          }
        })
    },

    getWeatherAir:function(city){
      var that = this
      var url = "https://free-api.heweather.net/s6/air"
      var params = {
          location: city,
          key: "87ef193da3764ab480c1c8724e72eaf1"  
      }
      wx.request({ 
        url:url,
        data: params,
        success: function(res) {
        that.setData({
            weatherAir: res.data.HeWeather6[0]
        })
        }
    })
    },
    getWeather: function(city) {
      var that = this
      var url = "https://free-api.heweather.net/s6/weather"
      var params = {
        location: city,
        key: "87ef193da3764ab480c1c8724e72eaf1"  
      }
      wx.request({
        url: url,
        data: params,
        success: function(res) {
            var weatherIconId = "../weatherIcon/" + res.data.HeWeather6[0].now.cond_code + ".png"
          that.setData({
            weather: res.data.HeWeather6[0],
            weatherIconPic:weatherIconId
          })
        }
      })
    },
    getWeahterIcon(weather) {
      switch (weather) {
        case "weatherIconText":
          return weatherIconId;
      }
    }
  })