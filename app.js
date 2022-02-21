const APIController = (function(){
   const clientId = '50fd8dfa6eed4f9a9c9f65dc562a3822';
   const clientSecret = 'd8f7042106ea4cf28737ef38cc5c27b6';

   //private methods
   const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

            const data = await result.json();
            return data.access_token;

   }

   const _getGenres = async (token) => {
     
       const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
           method: 'GET',
           headers: { 'Authorization' : 'Bearer ' + token}
       });

       const data = await result.json();
       return data.categories.items;

   }

   const _getPlaylistByGenre = async (token, genreId) => {
       
    const limit = 10;
    const result = await fetch('https://api.spotify.com/v1/browse/categories$(genreId)/playlists?limit=$(limit)', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.playlists.items;
   }

   const _getTracks = async (token, trackEndPoint) => {
    const limit = 10;

    const result = await fetch('${tracksEndPoint}?limit=${limit}', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.items;
   }

   const _getTrack = async (token, trackEndPoint) => {
    const result = await fetch('${tracksEndPoint}', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data;
   }

   return {
       _getToken() {
           return _getToken();
       },
       _getGenres(token) {
            return _getGenres();
    },  _getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
    },  _getTracks(token, trackEndPoint) {
            return _getToken(token, trackEndPoint);
    },  _getTrack() {
            return _getToken(token, trackEndPoint);
    }
       //Need to do this for all of the constants that we have at the top
   }

})();

//UI Module
const UIcontroller = (function() { 
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'

    }

    //public methods
    return{

        inputField(){
            return{
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
            }
        },
        //method to create selection
        createGenre(text, value) {
            const html = '<option value="${value}">${text}</option>';
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },
        createPlaylist(text, value) {
            const html = '<option value="${value}">${text}</option>';
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        createTrack(id, name) {
            const html = '<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>';
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createTrackDetail(img, title, artist) {
            
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = '';
            const html = '<div class=”row col-sm-12 px-0”> <img src=”{img}” alt=””> </div>  <div class=”row col-sm-12 px-0”><label for=”Genre” class=”form-label col-sm-12”>${title}:</label> </div> <div class=”row col-sm-12 px-0”> <label for=”artist” class=”form-label col-sm-12”>${artist}:</label> </div>';
           
            
         
            detailDiv.insertAdjacentHTML('beforeend',html)

        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML= '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML= '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML= '';
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        resetTrackDetail() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }
})();

const APPController = (function(UICtrl, APICtrl){

   const DOMInputs = UICtrl.inputField();

   const loadGenres = async () => {
       const token = await APICtrl.getToken();
       UICtrl.storeToken(token);
       const genres = await APICtrl.getGenres();
       genres.forEach(element => UICtrl.createGenre(element.name, element.id));
   }
