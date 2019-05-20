export default {
	
	// 歌词格式化
  lrcFormat(lrc) {
    var arr = [];
    var lrcArr = lrc.split(/\[([^\[\]]+)\]/g);
	
    // 先把第一个空位删掉
    if (lrcArr[0] == "") {
      lrcArr.shift();
    }
	
    for (let i = 0; lrcArr.length != 0; i++) {
      var time = this.timeToDateFormat(lrcArr.shift());
      var lrcCN = lrcArr.shift();
      arr.push({ time, lrcCN });
    }
	
	// 剔除NaN
	for (var i = 0; i < arr.length; i++) {
		if(!isNaN(parseInt(arr[i].time))){
			break
		}
		arr.shift();
		i -= 1;
	}
	
	var lrcENArr = [];
	// 拆分英文歌词  智障歌词qs8 @成都
	for (var i = 0; i < arr.length; i++) {
		if(i != 0 && arr[i].time < arr[i-1].time){
			lrcENArr = arr.splice(i, arr.length - i)
			break
		}
	}
	
	// 将英文歌词填入arr
	// if(lrcENArr.length != 0){
	// 	for (var i = 0; i < arr.length; i++) {
	// 		if(arr[i].time == lrcENArr[i].time){
	// 			arr[i].lrcEN = lrcENArr[i].lrcCN
	// 		}
	// 	}
	// }
    return arr;
  },
	
	// 时间格式化
	timeToDateFormat(time) {
		return time.split(":")[0] * 60 + parseFloat(time.split(":")[1])
	},
	
	dateToTimeFormat(date){
		if(date >= 60){
			if(date/60 >= 10){
				if(date%60 >= 10){
					return parseInt(date/60) + ':' + parseInt(date%60)
				}else{
					return parseInt(date/60) + ':0' + parseInt(date%60)
				}
			}else{
				if(date%60 >= 10){
					return '0' + parseInt(date/60) + ':' + parseInt(date%60)
				}else{
					return '0' + parseInt(date/60) + ':0' + parseInt(date%60)
				}
			}
		}else{
			if(date >= 10){
				return '00:' + parseInt(date)
			}else{
				return '00:0' + parseInt(date)
			}
		}
	}

};
