const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const thumbnail = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const cdThumb = $('.cd-thumb');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const volume = $('#volumeSlider');
const download = $('#download');
var volumeIcon = document.querySelector(".volume-control i");
const startTime = $('.current-time');
const endTime = $('.end-time');


// console.log(e);

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    
    const formattedTime = `${minutes}:${remainderSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

const app = {
    isPLaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,

    songs: [
        {
            name: "Zankyou Sanka ",
            singer: "Aimer",
            path: "./assets/music/yt1s.com - Aimer 残響散歌 Zankyou Sanka Kimetsu no Yaiba Yuukakuhen Opening Lyrics KanRomEng.mp3",
            img: "./assets/img/1329815.jpg"
        },
        {
            name: " Gurenge ",
            singer: "LiSA ",
            path: "./assets/music/yt1s.com - Demon Slayer  OP  Gurenge by LiSA HD.mp4",
            img: "./assets/img/1329817.jpg"
        },
        {
            name: "Demon Slayer Kimetsu no Yaiba Ending",
            singer: "LiSA",
            path: "./assets/music/yt1s.com - Demon Slayer Kimetsu no Yaiba Ending FullFictionJunction feat LiSA  from the edge.mp3",
            img: "./assets/img/1329828.jpg"
        },
        {
            name: "Homura",
            singer: "LiSA",
            path: "./assets/music/yt1s.com - Homura 炎   LiSAKANENGROMAJI LYRICS  Demon Slayer the movie Mugen Train theme.mp3",
            img: "./assets/img/1329839.jpg"
        },
        {
            name: "Shirogane",
            singer: "LiSA",
            path: "./assets/music/yt1s.com - Kimetsu no Yaiba  Mugen Resshahen Ending  LiSA  Shirogane 白銀 LyricsKanRomEng.mp3",
            img: "./assets/img/1329912.jpg"
        },
        {
            name: "Yuukaku",
            singer: "LiSA",
            path: "./assets/music/yt1s.com - Kimetsu no Yaiba Yuukaku  hen Ending  Aimer  Asa ga Kuru 朝が来る LyricsKanRomEng.mp3",
            img: "./assets/img/1329915.jpg"
        },
        {
            name: "CLiPテレビアニメ鬼滅の刃無限列車編",
            singer: "LiSA",
            path: "./assets/music/yt1s.com - LiSA 明け星 MUSiC CLiPテレビアニメ鬼滅の刃無限列車編 オープニングテーマ.mp3",
            img: "./assets/img/1329918.jpg"
        },
        {
            name: "Nezuko",
            singer: "EP11",
            path: "./assets/music/yt1s.com - Nezuko Theme with Lyrics  Demon Slayer S3 EP11  Full Soundtrack HQ.mp3",
            img: "./assets/img/1343620.jpg"
        },


    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fa fa-download" aria-hidden="true"></i>
                    <a class= "download" href = "" download = "" data-index = ${index}>  
                        <i class="fa-light fa-arrow-down-to-line"></i>
                    </a>
                </div>
            </div>
            `;
        });

        playlist.innerHTML = htmls.join('');
        
       
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        

        // CUỘN 
        document.onscroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            if (newcdWidth < 0) {
                cd.style.width = 0 + 'px';
            } else {
                cd.style.width = newcdWidth + 'px';
            }

            // cd.style.opacity = (cdWidth / scrollTop) ;

        }

        // PLAY
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Phát
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            myCD.play();
        }

        // Dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            myCD.pause();
            
        }

        // Thanh trạng thái
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const duration = Math.floor(audio.currentTime / audio.duration * 100);
                // console.log(duration);
                progress.value = duration;

                startTime.textContent = formatTime( Math.floor(audio.currentTime) );
                endTime.textContent = formatTime( Math.floor(audio.duration) );
            }
        }

        //Tua
        progress.oninput = function () {
            audio.currentTime = progress.value / 100 * audio.duration;
        }

        // PREV
        const prevBtn = $('.btn-prev');
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.currentIndex--;
                // Nếu tại vị trí đầu tiên bấm prev sẽ đến bài cuối
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1;
                }
                _this.loadSong();
                audio.play();
            }
            _this.render();
            _this.scrollToActiveSong();

        }

        // NEXT
        const nextBtn = $('.btn-next');
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.currentIndex++;
                //Nếu tại vị trí cuối bấm next sẽ đến bài đầu tiên
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0;
                }
                _this.loadSong();
                audio.play();
            }
            _this.render();
            _this.scrollToActiveSong();

        }

        // Quay đĩa
        const myCD = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000,
            iterations: Infinity,
        });
        myCD.pause();

        // Random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Tự động chuyển bài khi hết
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.loadSong();
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Chọn bài
        playlist.onclick = function (e) {
            const mySong = e.target.closest('.song:not(.active)');
            const optionIcon = e.target.closest('.option');
        
            if (mySong || optionIcon) {
                if (mySong) {
                    _this.currentIndex = Number(mySong.dataset.index);
                    _this.loadSong();
                    _this.render();
                    audio.play();
                }
        
                if (optionIcon) {
                    const songIndex = optionIcon.parentElement.dataset.index;
                    const song = _this.songs[songIndex];
                    const link = document.createElement('a');
                    link.href = song.path;
                    link.download = `${song.name}.mp3`;
                    link.click();
                }
            }
        }
        

        // Điều chỉnh volume
        volume.oninput = function () {
            var currentVolume = volume.value / 100;
            
            // Điều chỉnh âm lượng của audio
            audio.volume = currentVolume;
        
            // Kiểm tra nếu âm lượng là 0, thay đổi biểu tượng volume
            if (currentVolume === 0) {
                volumeIcon.classList.remove("fa-volume-down");
                volumeIcon.classList.remove("fa-volume-up");

                volumeIcon.classList.add("fa-volume-off");
            } else if (currentVolume >0 && currentVolume <= 0.5){
                volumeIcon.classList.remove("fa-volume-off");
                volumeIcon.classList.remove("fa-volume-up");
                volumeIcon.classList.add("fa-volume-down");
            } else {
                volumeIcon.classList.remove("fa-volume-down");
                volumeIcon.classList.remove("fa-volume-off");

                volumeIcon.classList.add("fa-volume-up");
            }
        };

        // Hiện thời gian đang phát
     


    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: (this.currentSong > 3) ? 'nearest' : 'center',
            });

        }, 300);
    },

    loadSong: function () {
        heading.textContent = this.currentSong.name;
        thumbnail.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
       
        //  console.log(heading, thumbnail, audio);

    },


    playRandom: function () {
        const randomIndex = Math.floor(Math.random() * this.songs.length);
        this.currentIndex = randomIndex;
        this.loadSong();
        audio.play();
    },

    defineproperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },


    

    start: function () {
        // Định nghĩa các thuộc tính cho object ( song )
        this.defineproperties();

        // Thực hiện các hành động
        this.handleEvent();

        // Load bài hát vào UI
        this.loadSong();

        // Load lại danh sánh playlist
        this.render();
    }
}

app.start();
