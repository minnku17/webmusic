const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs:[
        {
            name: 'Martin Garrix, Matisse & Sadko - Forever',
            producer: 'Martin Garrix, Matisse & Sadko',
            path: './assets/musics/forever.mp3',
            image: './assets/img/forever.jpg'
        },
        {
            name: 'Hardwell & Mike Williams - Im Not Sorry',
            producer: 'Hardwell & Mike Williams',
            path: './assets/musics/im-not-sorry.mp3',
            image: './assets/img/pikasonic.jpg'
        },
        {
            name: 'Miku Hatsune - Ievan Polkka (VSNS Remix)',
            producer: 'Ievan Polkka',
            path: './assets/musics/miku.mp3',
            image: './assets/img/miku.jpg'
        },
        {
            name: 'San Holo - Light (Crankdat Remix)',
            producer: 'San Holo',
            path: './assets/musics/light.mp3',
            image: './assets/img/light.jpg'
        },
        {
            name: 'Avicii - Without You “Audio” ft. Sandro Cavazza',
            producer: 'Avicii',
            path: './assets/musics/without.mp3',
            image: './assets/img/without.jpg'
        },
        {
            name: 'Julius Dreisig & Zeus X Crona - Invisible [NCS Release]',
            producer: 'Julius Dreisig & Zeus X Crona',
            path: './assets/musics/Invisible.mp3',
            image: './assets/img/Invisible.jpg'
        },
        {
            name: 'Teriyaki Boyz - Tokyo Drift (PedroDJDaddy Trap Remix)',
            producer: 'Teriyaki Boyz',
            path: './assets/musics/Tokyo Drift.mp3',
            image: './assets/img/Tokyo Drift.jpg'
        },
        {
            name: 'Illenium - Needed You (ft. Dia Frampton)',
            producer: 'Illenium',
            path: './assets/musics/Needed You.mp3',
            image: './assets/img/Needed You.jpg'
        }
    ],

    render: function(){
        
        const htmls = this.songs.map((song, index) =>{
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.producer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
            `
        })
        
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth 

        //handle cd quay/ dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //handle zoom in/ zoom out CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //handle when click play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }
        //when song is play 
        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //when song is pause
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //when progress song increase
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //when next song
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            } else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        //when prev song
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            } else{
                app.prevSong()
            }
            audio.play()
            app.render()
        }

        //handle tua song
        progress.oninput = function(){
            const seekTime = audio.duration / 100 * progress.value
            audio.currentTime = seekTime
        }

        //handle on off random song
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }
        //handel repeat a song
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        //handel onended
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            } else{
                nextBtn.click()
            }
        }
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //handle when click anywhere in playlist
                if(songNode){
                    app.currentIndex = Number(songNode.getAttribute('data-index'))
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }

    },
    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex

        this.loadCurrentSong()
    },
    start: function(){
        //difine Properties for object
        this.defineProperties()

        //listen/ handle envents (Dom Events)
        this.handleEvents()
        
        //load current song in UI when run app
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }
}
app.start()

