/**
 * Created by einarvalur on 27/05/14.
 */

require([], function () {



	/**
	 * Make user admin
	 */
	Array.prototype.forEach.call( document.querySelectorAll('.user-admin'),function(item){
		item.addEventListener('click',function(event){
			event.preventDefault();
			var xhr = new XMLHttpRequest();
			xhr.open('get',this.href);
			xhr.addEventListener('load',function(event){
				var obj = JSON.parse( event.target.responseText );
				item.classList.remove('btn-info');
				item.classList.remove('btn-danger');
				item.classList.add( ( obj.admin )?'btn-danger':'btn-info' );
				item.innerText = (obj.admin)?'afturkalla admin réttindi':'gera að admin';
			},false);
			xhr.send();
		}.bind(item),false)
	} );


	/**
	 * Submit credential-form
	 *
	 */
	( document.getElementById('credential-form') || {addEventListener:function(){}} ).addEventListener('submit',function(event){
		event.preventDefault();
		var xhr = new XMLHttpRequest();
		xhr.open(event.target.method,event.target.action);
		xhr.addEventListener('load',function(event){
			if( event.target.status == 200 ){
				var object = JSON.parse(event.target.responseText);
				this.parentNode.style.marginLeft = '-100%';
				document.querySelector('button[name=file]').setAttribute('data-url','/video/submit/'+object._id);
			}else{

			}
		}.bind(event.target),false);
		xhr.addEventListener('error',function(event){}.bind(event.target),false);
		xhr.addEventListener('load',function(event){}.bind(event.target),false);
		xhr.send(new FormData(event.target));
	},false);


	/**
	 * Upload video
	 */
	(document.querySelector('button[name=file]')||{addEventListener:function(){}}).addEventListener('click',function(event){
		event.preventDefault();
		var url = event.target.getAttribute('data-url');
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = 'video/*';
		input.style.position = 'absolute';
		input.style.top = '-200px';
		input.addEventListener('change',function(event){
			var files = event.target.files;
			var formData = new FormData();
			formData.append("file", files[0]);
			var xhr = new XMLHttpRequest();
			xhr.open('post',url);
			xhr.responseType = 'document';
			this.classList.remove('done');
			xhr.upload.addEventListener("progress", function(event){
				var status = (event.loaded / event.total * 100 );
				this.style.backgroundImage = 'linear-gradient(90deg, ' +
					'rgba(31,100,159,1) 0%, rgba(66, 139, 202,1) '+status+'%, ' +
					'rgba(31,100,159,1) 0%, rgba(66, 139, 202,1) 100%)';
				this.innerText = "Hleð upp myndbandi " + parseInt(status) + "%";
				document.querySelector('.form-carousel-container').style.marginLeft = '-200%';
			}.bind(this), false);
			xhr.addEventListener('load',function(event){
				if(event.target.status==200){
					this.classList.add('done');
					//var uploadForm = document.getElementById('upload-form');
					//uploadForm.parentNode.replaceChild(event.target.response.forms[0],uploadForm);
					input.parentNode.removeChild(input);
				}else{
					alert('Upp kom villa, reyndu aftur');
				}
			}.bind(this),false);
			xhr.addEventListener('error',function(event){
				alert('Upp kom villa, reyndu aftur');
			}.bind(this),false);
			xhr.addEventListener('abort',function(event){
				alert('Notandi hættir við');
			}.bind(this),false);
			xhr.send(formData);
		}.bind(event.target),false);
		document.body.appendChild(input);
		input.click();
	},false);

	/*
	var eventHandlers = function(element){

		var video = element.querySelector('video');
		var source = element.querySelectorAll('source');

		if( source.length == 0 ) {
			var interval = setInterval(function () {
				var xhr = new XMLHttpRequest();
				xhr.open('get', element.getAttribute('data-source'));
				xhr.addEventListener('load', function (event) {
					var object = JSON.parse(event.target.responseText);
					if (object.videos.length > 1) {
						video.setAttribute('poster', '/images/' + object.posters[0]);
						object.videos.forEach(function (item, index, collection) {
							var source = document.createElement('source');
							source.setAttribute('src', '/images/' + item.name);
							source.setAttribute('type', item.codec);
							video.appendChild(source);
							element.classList.add('paused');
						});
						clearInterval(interval);
					}else{
						video.style.backgroundImage = 'linear-gradient(90deg, ' +
							'rgba(31,100,159,1) 0%, rgba(31,100,159,1,1) '+((object.videos.length/3)*100)+'%, ' +
							'rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)';
					}
				});
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				xhr.send();
			}, 10000);

		}
		//}else{
			video.addEventListener('ended',function(event){
				element.classList.add('paused');
			});
			element.addEventListener('click',function(event){
				event.preventDefault();
				if(video.paused){
					element.classList.remove('paused');
					video.play();
				}else{
					element.classList.add('paused');
					video.pause();
				}

			});
		//}


	};

	Array.prototype.forEach.call(document.querySelectorAll('ul.video-list > li'),function(item){
		eventHandlers(item);
	});
	*/

	Array.prototype.forEach.call(document.querySelectorAll('.facebook'),function(item){
		item.addEventListener('click',function(event){
			event.preventDefault();
			window.open(this.href,'Facebook Share','menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,height=400,width=600');
		}.bind(item),false);
	});



	//ROTATE THUMBS - LIGHTBOX
	//	For every item in list of videos, set mouseover/mouseout events.
	//	if item is clicked, the video is fetched in a lightbox'ish fashion
	//	and played for the user
	Array.prototype.forEach.call(document.querySelectorAll('.gallery-list > li'),function(item){
		var timer = undefined;
		var counter = 0;
		var figure = item.getElementsByTagName('figure')[0];
		var images = item.getElementsByTagName('img');
		var container = undefined;

		figure.addEventListener('mouseover',function(){
			timer = setInterval(function(){
				images[ counter % images.length ].style.display = 'none';
				counter++;
				images[ counter % images.length ].style.display = 'block';
			},500);
		},false);
		figure.addEventListener('mouseout',function(){
			clearInterval(timer);
		},false);
		/*figure.addEventListener('click',function(event){
			event.preventDefault();
			if( !container ){
				var xhr = new XMLHttpRequest();
				xhr.open('get',item.getAttribute('data-source'));
				xhr.addEventListener('load',function(event){
					if(event.target.status==200){
						var object = JSON.parse(event.target.responseText);
						container = (function(){
							var container = document.createElement('div');
							container.setAttribute('class','overlay');
							var video = document.createElement('video');
							video.setAttribute('class','video-js vjs-default-skin');
							video.setAttribute('controls',true);
							video.setAttribute('preload','auto');
							video.setAttribute('height',500);
							video.setAttribute('width',700);
							object.videos.forEach(function(v){
								var source = document.createElement('source');
								source.src = '/images/'+v.name;
								source.type = v.codec;
								video.appendChild(source);
							});
							container.appendChild(video);
							videojs(video,{},function(){
								//console.log(arguments);
							});
							return container;
						})();
						container.addEventListener('click',function(event){
							event.preventDefault();
							if( event.target == container ){
								container.parentNode.removeChild(container);
							}
						},false);
						document.body.appendChild(container);
					}

				},false);
				xhr.send();
			}else{
				document.body.appendChild(container);
			}
		},false);*/

	});

});
