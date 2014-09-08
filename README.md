#N1 game application

##Requirements

1. Running MongoDB server
2. Running RabbitMQ server

##Pre-run

You can use the `data/` folder for MongoDB, run from the project's root directory

    $ mongod --dbpath data/

##Run

    $ npm start


###FFMPEG
FFMPEG is used to convert the videos, it needs three codecs to be able tu run. The simplest way get them is tu tun this:

    brew reinstall ffmpeg --with-libvpx --with-libvorbis --with-theora

##Some random stuff

    Bash completion has been installed to:
      /usr/local/etc/bash_completion.d





    To have launchd start rabbitmq at login:
        ln -sfv /usr/local/opt/rabbitmq/*.plist ~/Library/LaunchAgents
    Then to load rabbitmq now:
        launchctl load ~/Library/LaunchAgents/homebrew.mxcl.rabbitmq.plist
    Or, if you don't want/need launchctl, you can just run:
        rabbitmq-server





<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 526 396" xml:space="preserve">
    <g>
        <path fill="#FFFFFF" d="M489.506,32.23l-85.865,321.502c-1.135,4.257-5.568,7.688-9.957,7.688H37.694
            c-4.334,0-6.969-3.432-5.845-7.688L117.642,32.23c1.144-4.233,5.621-7.66,10.025-7.66h355.96
            C487.986,24.57,490.641,27.997,489.506,32.23z"/>
        <g>
            <path fill="#ED1C24" d="M513.398,1L110.767,1c-4.989,0-10.039,3.871-11.339,8.656L1.297,376.143
                c-1.281,4.82,1.705,8.687,6.608,8.687h402.657c4.957,0,9.971-3.866,11.252-8.687L520.037,9.657C521.318,4.871,518.322,1,513.398,1
                z M489.506,32.23l-85.865,321.502c-1.135,4.257-5.568,7.688-9.957,7.688H37.694c-4.334,0-6.969-3.432-5.845-7.688L117.642,32.23
                c1.144-4.233,5.621-7.66,10.025-7.66h355.96C487.986,24.57,490.641,27.997,489.506,32.23z"/>
            <path fill="#ED1C24" d="M387.439,114.378l-64.457,7.691c-1.201,0.173-2.131,1.191-2.164,2.434v38.04h0.002
                c0,1.396,1.129,2.528,2.525,2.53l17.414-1.941c0,0,0,73.832,0,82.832c0,12.114,10.758,23.844,27.775,23.844
                c9.143,0,15.605,0,18.91,0c1.389-0.002,2.516-1.126,2.523-2.515V116.906C389.969,115.51,388.836,114.378,387.439,114.378z"/>
            <path fill="#ED1C24" d="M272.296,114.432h-21.258c-1.397,0-2.53,1.133-2.53,2.53v83.453l-32.568-56.349
                c-12.549-21.018-30.429-29.634-57.389-29.634h-23.598c-1.385,0.015-2.503,1.141-2.503,2.529v129.102
                c0,15.747,14.679,23.872,28.566,23.872h18.27v-0.001c1.377,0,2.496-1.1,2.528-2.469v-87.51l38.703,59.451
                c16.542,25.216,33.614,30.528,54.406,30.528h20.435c1.396,0,2.526-1.129,2.53-2.523V137.714
                C297.888,125.491,285.671,114.432,272.296,114.432z"/>
        </g>
    </g>
</svg>




		<ul class="video-list">
			{% for video in videos %}
			<li class="paused" data-source="/video/status/{{video._id.toHexString()}}">
				<video poster="{%if video.videos.length==0%}/stylesheets/images/no-movie.png{% else %}/images/{{video.posters[0]}}{%endif%}">
					{% for source in video.videos %}
					<source src="/images/{{source.name}}" type="{{source.codec}}">
					{% endfor %}
				</video>

			</li>
			{% endfor %}
		</ul>
		
		
		
		N1 flokkurinn
                Skókast
                Kexkökufés
                Ekki trompast
                Hallandi
                Öfugur stafli
                Tengingaleikur
                Jón eplabóndi
                Hangs
		Sniðugi flokkurinn
                Skókast
                Kexkökufés
                Ekki trompast
                Hallandi
                Öfugur stafli
                Tengingaleikur
                Jón eplabóndi
                Hangs
		Hraðaþrautin
                Skókast
                Kexkökufés
                Ekki trompast
                Hallandi
                Öfugur stafli
                Tengingaleikur
                Jón eplabóndi
                Hangs
		Staðarflokkurinn
                Skókast
                Kexkökufés
                Ekki trompast
                Hallandi
                Öfugur stafli
                Tengingaleikur
                Jón eplabóndi
                Hangs
		Skemmtilegi flokkurinn
                Skókast
                Kexkökufés
                Ekki trompast
                Hallandi
                Öfugur stafli
                Tengingaleikur
                Jón eplabóndi
                Hangs