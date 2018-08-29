# SliceUpload.js
js 切片上传

##### 说明：

1. 通过配置类的onProgress、onComplete、onAllComplete 可灵活处理“上传中”和“上传完成”的样式和提示；
2. 调用 upload 的时机也完全可以自定义，你像本例一样，在 submit 时调用；亦可在 file 的 onchange 事件后直接调用，抑或额外加一个“上传”按钮调用，随你； 
3. onComplete 时注意要 remove 掉 file，并添加一个 input，用于后继提交、记录到数据库等操作。 

##### 基础用法
	let oSu = new SliceUploadMultiple({
        apiUrl: 'slice.php',
        files: document.querySelectorAll('input[type="file"]'),
        chunk: 2, // 切片大小，单位M（注意不要大于php.ini里设置的大小）
        onProgress: function(percent, file) {
            $(file).parent().next().find('.progress-bar').attr('aria-valuenow', percent).width(percent + '%');
        },
        onComplete: function(filename, file) {
        	$(file).after('<input type="text" name="'+ file.name +'" class="form-control" value="'+ filename +'">');
            $(file).parent().next().remove();
        	$(file).remove();
        },
        onAllComplete: function(filename, file){
            $('form').trigger('submit');
        }
    });

    $('form').on('submit', function() {
    	if($('#form2 input[type="file"]').length>0){
	    	$('#form2 .progress-wrapper').show();
	        oSu2.upload();
        	return false;
    	}
    });


具体用法，请看：[demo.html](https://github.com/Tiacx/SliceUpload.js/blob/master/demo.html "使用示例")

