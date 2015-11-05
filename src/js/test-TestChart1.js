require(["ts/widgets/TSWidget",
     "jsm/util/OptimizedResize",   
	 "jquery",
	 "highcharts",],
	function(TSWidget,OptimizedResize,$,highcharts,htm){
	'use strict';
	var date=new Date();
	//var date1=date.getHours()-8;
	//date.setHours(date1)
	var newdate=date.getTime();
	var categories=[];
    for(var i=0;i<24;i++){
        categories.push(i);
    }
    var data1=[],data2=[],data3=[],date4=[];
    for(var i=0;i<80;i++){
    	data1.push(parseInt(Math.random()*120));
        data2.push(parseInt(Math.random()*120));
        data3.push(parseInt(Math.random()*120));
    }


    var series=[{
        name: 'CPU使用率',
        color: '#E3B2C9',
        data: data2//[30, 50, 60, 70, 100, 50,10, 20, 30,  60, 22, 66,10, 20, 30, 30, 50, 60, 70, 100, 50, 60, 22, 66]//data1
    },{
        name: 'checkpoint时长',
        color: '#D9E0ED',
        data: data3//[60, 70, 100, 50, 60, 22, 66,10, 20, 30, 30, 50,10, 20, 30, 30, 50,  60, 70, 100, 50, 60, 22, 66]//data1
    },{
        name: '等待队列',
        color: '#36352C',
        data: data1
    }]

    $('#chartSpline1').highcharts({
    chart: {
      type: 'spline',
      animation: Highcharts.svg,
      events: {    load: function(event) {   
    	            var one=this.series[0];
                    var seven = this.series[2];
                    var two=this.series[1];
                    var timer=setInterval(function() {
                        var x = (new Date()).getTime()     
                        var y = parseInt(Math.random()*120);
                        var y1 = parseInt(Math.random()*120);
                        var y2 = parseInt(Math.random()*120);
                        if(seven.yData.length>230||one.yData.length>239||two.yData.length>239){
                            clearInterval(timer);
                            return;
                        }                            
                       seven.addPoint([y], true, false);  
                       one.addPoint([y1], true, false);
                       two.addPoint([y2], true, false);
                       one.removePoint (0);
                       two.removePoint (0);
                      seven.removePoint (0);
                    }, 1000);                                                   
                } 
                     
        } 
    },
    title: {
        text: '数据库的cpu，checkpoint时长，等待队列监控',
        x: -20 //center
    },
    subtitle: {
        text: 'Source: nco-china.com',
        x: -20
    },
    credits: {
    	text:'华胜信泰'
    },
    plotOptions: {
      spline: {
          lineWidth: 4,
          states: {
              hover: {
                  lineWidth: 5
              }
          },
          marker: {
              enabled: false
          },
          pointInterval: 3600000/10,//5000, // one hour
     //     pointStart: Date.UTC(2015, 9, 30, 0, 0, 0)
          pointStart:newdate
      },
       series: {                                                              
            lineWidth: 3,                                                      
            point: {
                events: {
                'load': function() {
                        if (this.series.data.length > 1) this.remove();        
                    }
                }                                                 
            }                                                     
        } 
    },
    xAxis: {
        type: 'datetime',
        //categories: categories,
        dateTimeLabelFormats: { 
            hour: '%H:%M'
        }
      
    },
    yAxis: {
        title: {
            text: '流量大小（个）'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: '个',

        /*formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                Highcharts.dateFormat('%H:%M', this.x) +': '+ this.y +' 个';
        }*/

    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: series
});
   
    $('#chartSpline2').highcharts({
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          events: {    load: function(event) {   
        	            var one=this.series[0];
                        var seven = this.series[2];
                        var two=this.series[1];
                        var timer=setInterval(function() {
                            var x = (new Date()).getTime()     
                            var y = parseInt(Math.random()*120);
                            var y1 = parseInt(Math.random()*120);
                            var y2 = parseInt(Math.random()*120);
                            if(seven.yData.length>230||one.yData.length>239||two.yData.length>239){
                                clearInterval(timer);
                                return;
                            }                            
                           seven.addPoint([y], true, false);  
                           one.addPoint([y1], true, false);
                           two.addPoint([y2], true, false);
                           one.removePoint (0);
                           two.removePoint (0);
                          seven.removePoint (0);
                        }, 1000);                                                   
                    } 
                         
            } 
        },
        title: {
            text: '数据库的cpu，checkpoint时长，等待队列监控',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: nco-china.com',
            x: -20
        },
        credits: {
        	text:'华胜信泰'
        },
        plotOptions: {
          spline: {
              lineWidth: 4,
              states: {
                  hover: {
                      lineWidth: 5
                  }
              },
              marker: {
                  enabled: false
              },
              pointInterval: 3600000/10,//5000, // one hour
         //     pointStart: Date.UTC(2015, 9, 30, 0, 0, 0)
              pointStart:newdate
          },
           series: {                                                              
                lineWidth: 3,                                                      
                point: {
                    events: {
                    'load': function() {
                            if (this.series.data.length > 1) this.remove();        
                        }
                    }                                                 
                }                                                     
            } 
        },
        xAxis: {
            type: 'datetime',
            //categories: categories,
            dateTimeLabelFormats: { 
                hour: '%H:%M'
            }
          
        },
        yAxis: {
            title: {
                text: '流量大小（个）'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '个',

            /*formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%H:%M', this.x) +': '+ this.y +' 个';
            }*/

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
    });
	
    $('#chartSpline3').highcharts({
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          events: {    load: function(event) {   
        	            var one=this.series[0];
                        var seven = this.series[2];
                        var two=this.series[1];
                        var timer=setInterval(function() {
                            var x = (new Date()).getTime()     
                            var y = parseInt(Math.random()*120);
                            var y1 = parseInt(Math.random()*120);
                            var y2 = parseInt(Math.random()*120);
                            if(seven.yData.length>230||one.yData.length>239||two.yData.length>239){
                                clearInterval(timer);
                                return;
                            }                            
                           seven.addPoint([y], true, false);  
                           one.addPoint([y1], true, false);
                           two.addPoint([y2], true, false);
                           one.removePoint (0);
                           two.removePoint (0);
                          seven.removePoint (0);
                        }, 1000);                                                   
                    } 
                         
            } 
        },
        title: {
            text: '数据库的cpu，checkpoint时长，等待队列监控',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: nco-china.com',
            x: -20
        },
        credits: {
        	text:'华胜信泰'
        },
        plotOptions: {
          spline: {
              lineWidth: 4,
              states: {
                  hover: {
                      lineWidth: 5
                  }
              },
              marker: {
                  enabled: false
              },
              pointInterval: 3600000/10,//5000, // one hour
         //     pointStart: Date.UTC(2015, 9, 30, 0, 0, 0)
              pointStart:newdate
          },
           series: {                                                              
                lineWidth: 3,                                                      
                point: {
                    events: {
                    'load': function() {
                            if (this.series.data.length > 1) this.remove();        
                        }
                    }                                                 
                }                                                     
            } 
        },
        xAxis: {
            type: 'datetime',
            //categories: categories,
            dateTimeLabelFormats: { 
                hour: '%H:%M'
            }
          
        },
        yAxis: {
            title: {
                text: '流量大小（个）'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '个',

            /*formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%H:%M', this.x) +': '+ this.y +' 个';
            }*/

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
    });
});