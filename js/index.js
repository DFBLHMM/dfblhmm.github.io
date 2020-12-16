var vue = new Vue({
    el: '#app',
    data: {
        message: '',
        songs: [],
        songSrc: '',
        albumSrc: '',
        control_animation: '',
        flag_go: true,
        flag_init: false,
        flag_img: false,
        control_angle: '',
        comments: [],
        videoSrc: '',
        initMv: '',
        closeMv: true,
        currentSong: {
            name: '',
            artist: ''
        }
    },
    beforeCreate() {
        window.onload = function() {
            document.querySelector('#app').style = 'opacity: 1';
            document.querySelector('.loading').style = 'display: none';
            axios.defaults.baseURL = 'https://autumnfish.cn';
        }
    },
    methods: {
        search: function() {
            this.message.trim() != '' && axios.get('/search', {
                    params: {
                        keywords: this.message,
                        limit: 30
                    },
                }).then(result => {
                    this.songs = [];
                    let songs = result.data.result.songs;
                    songs.forEach(value => {
                        this.songs.push({
                            name: value.name,
                            id: value.id,
                            artist: value.artists[0].name,
                            mvid: value.mvid
                        })
                    });
                })
                .catch(err => console.log(err));
        },
        playMusic: function(value) {
            //获取音乐地址
            axios.get('/song/url', {
                    params: {
                        id: value.id
                    }
                }).then(result => {
                    this.songSrc = result.data.data[0].url;
                    this.currentSong.name = value.name;
                    this.currentSong.artist = value.artist;
                })
                .catch(err => console.log(err));
            //获取专辑图
            axios.get('/song/detail', {
                    params: {
                        ids: value.id
                    }
                }).then(result => {
                    this.albumSrc = result.data.songs[0].al.picUrl;
                    this.flag_img = true;
                    [this.flag_go, this.flag_init] = [!this.flag_go, !this.flag_init];
                })
                .catch(err => console.log(err));
            //获取评论
            axios.get('/comment/hot', {
                    params: {
                        id: value.id,
                        type: 0,
                        limit: 30
                    }
                }).then(result => {
                    this.comments = [];
                    result.data.hotComments.forEach(value => {
                        this.comments.push({
                            nickname: value.user.nickname,
                            avatarUrl: value.user.avatarUrl,
                            content: value.content,
                            likedCount: value.likedCount
                        })
                    })
                })
                .catch(err => console.log(err));
        },
        play_animation: function() {
            //恢复动画
            this.control_animation = 'animationPlayState: running;webkitAnimationPlayState: running';
            this.control_angle = 'transform: rotate(0deg)';
        },
        pause_animation: function() {
            //暂停动画
            this.control_animation = 'animationPlayState: paused;webkitAnimationPlayState: paused';
            this.control_angle = 'transform: rotate(-27deg)';
        },
        //播放MV
        playVideo: function(mvid) {
            axios.get('/mv/url', {
                params: {
                    id: mvid,
                }
            }).then(result => {
                this.initMv = 'filter: blur(10px)';
                this.videoSrc = result.data.data.url;
                this.closeMv = false;
                document.querySelector('footer audio').pause();
            }).catch(err => console.log(err));
        },
        pauseMv: function() {
            this.initMv = '';
            this.closeMv = true;
            document.querySelector('footer audio').play();
        }
    }
})