/**
 * 切片上传
 */

/**
 * 单文件上传
 */
class SliceUpload
{
    constructor(options = {})
    {
    	// 配置
    	this.options    = options;

    	// 处理上传文件的 api 地址
		this.apiUrl     = options.apiUrl;
		// 文件域对象
		this.file       = options.file;
		// 文件总大小
		this.totalsize  = (this.file.size || 0);
		// 切片大小，默认 10M
		this.chunk      = (options.chunk || 10) * 1024 * 1024;
		// 切片开始位置
		this.start      = 0;
		// 切片结束位置
		this.end        = this.start + this.chunk;
		// 已上传数据大小
		this.loaded     = 0;
		// 接口回传的文件名
		this.filename   = '';
    }

    // 上传操作
    upload()
    {
    	let file = this.file.files[0];
		this.totalsize = file.size;

		if(this.end>this.totalsize) this.end = this.totalsize;

		let fd  = new FormData();
		let xhr = new XMLHttpRequest();
		xhr.open('post', this.apiUrl, true);
		xhr.upload.onprogress = (ev)=>{
			this.uploading(ev);
		};
		xhr.onreadystatechange = (ev)=>{
			if(xhr.readyState==4 && xhr.status==200){
				this.filename = xhr.responseText;
				this.uploaded();
			}
		};

		let blob = file.slice(this.start, this.end);
		fd.append('filename', file.name);
		fd.append('filedata', blob);
		xhr.send(fd);
	}

	// 上传中
	uploading(ev)
	{
		let percent = parseInt((this.loaded+ev.loaded)/this.totalsize * 100);
		
		this.onProgress(percent, this.file);
	}

	// 切片上传成功
	uploaded()
	{
		this.start = this.end;
		this.end   = this.start + this.chunk;
		if(this.start < this.totalsize)
		{
			this.loaded += this.chunk;
			this.upload();
		}
		else
		{
			this.onComplete(this.filename, this.file);
		}
	}

	// 进度中回调
	onProgress(percent, file)
	{
		if(this.options.onProgress){
			this.options.onProgress(percent, file);
		}
	}

	// 上传完成回调
	onComplete(filename, file)
	{
		if(this.options.onComplete){
			this.options.onComplete(filename, file);
		}
	}
}

/**
 * 多文件上传
 */
class SliceUploadMultiple
{
	constructor(options = {})
	{
		// 配置
		this.options  = options;

		// 已上传
		this.uploaded = 0;

		// 全部完成
		this.onAllComplete = (options.onAllComplete || null);

		// 实例
		this.oSus = [];
		if(options.files != undefined)
		{
			for(let i=0,len=options.files.length; i<len; i++){
				options.file = options.files[i];
				this.oSus.push( new SliceUpload(options) );
			}
		}
		else
		{
			this.oSus.push( new SliceUpload(options) );
		}
	}

	upload()
	{
		for(let i in this.oSus)
		{
			this.oSus[i].upload();
			this.oSus[i].onProgress = (percent, file)=>{
				this.onProgress(percent, file);
			};
			this.oSus[i].onComplete = (filename, file)=>{
				this.onComplete(filename, file);
			};
		}
	}

	// 进度中回调
	onProgress(percent, file)
	{
		if(this.options.onProgress){
			this.options.onProgress(percent, file);
		}
	}

	// 上传完成回调
	onComplete(filename, file)
	{
		if(this.options.onComplete){
			this.options.onComplete(filename, file);
		}

		this.uploaded++;

		if(this.uploaded == this.oSus.length){
			this.onAllComplete(filename, file);
		}
	}

	// 全部完成
	onAllComplete(filename, file)
	{
		if(this.options.onAllComplete){
			this.options.onAllComplete(filename, file);
		}
	}
}