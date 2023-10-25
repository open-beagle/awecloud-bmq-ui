var downloadFileFormatNew = function (fileUrl) {
    /* 
      input: /apaas/static/docs/image/images/1234_qq234ewr123.png
      output: 1234.png
    */
    if (fileUrl != "") {
      var temp = fileUrl.split('/')[fileUrl.split('/').length-1]
      var name = temp.split('_')[0]
      var type = temp.split('_')[temp.split('_').length-1].split('.')[1]
      if(temp.indexOf('_')==-1){
        return name
      }else{
        return name+'.'+type
      }
    } else {
      return "";
    }
}

export default {
    downloadFileFormatNew
}