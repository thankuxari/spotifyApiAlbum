import {getToken} from './spotifytoken.js';

const api_url = 'https://api.spotify.com/v1/search';

const mainContainer = document.getElementById('container');
const searchArtistName = document.getElementById('searchname');
const searchButton = document.getElementById('searchbtn');



getToken().then(token=>{
    searchButton.addEventListener('click',() => getSearchedArtistId(token));
})

async function getSearchedArtistId(token){
    try {       
        mainContainer.innerHTML = '';
        const inputValue = searchArtistName.value; 
        const api = `${api_url}?q=${encodeURIComponent(inputValue)}&type=artist`;
        const request = new Request(api,{
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        })
        const response = await fetch(request);
        if(!response.ok){
            throw new Error('There was a problem with fetching search request');
        }

        const data = await response.json();
        if(data.artists.items[0].id){
            const artistId = data.artists.items[0].id;
            getArtistInfo(artistId,token);
            getArtistAlbum(artistId,token);
        }else{
            throw new Error('No artist with this name was found')
        }
    } catch (error) {
        console.error(error);
    }
}

async function getArtistInfo(id,token){
    const url = `https://api.spotify.com/v1/artists/${id}`;
    try {
        const request = new Request(url,{
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        })

        const response = await fetch(request);
        
        if(!response.ok){
            throw new Error('There was a problem while fetching artist data');
        }

        const data = await response.json();
        if(data){
            displayArtistData(data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getArtistAlbum(id,token){
    const url = `https://api.spotify.com/v1/artists/${id}/albums`;

    try {
        const request = new Request(url,{
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        })
        const response = await fetch(request);
        if(!response.ok){
            throw new Error('There was an error while fetching artist albums');
        }
        
        const data = await response.json();
        if(data){
            displayAlbumData(data);
        }
    } catch (error) {
        console.error(error)
    }
}

function displayArtistData(artistdata){
    const artistNameLink = document.createElement('a');
    artistNameLink.href = artistdata.external_urls.spotify;
    artistNameLink.target = '_blank';

    const artistName = document.createElement('h1');
    artistName.textContent  = artistdata.name;
    artistNameLink.classList.add('artistname');
    artistNameLink.appendChild(artistName);
    mainContainer.appendChild(artistNameLink);

    const artistImage = document.createElement('img');
    artistImage.src = artistdata.images[0].url;
    mainContainer.appendChild(artistImage);

    const artistGenre = document.createElement('h3');
    artistGenre.textContent = 'Genre: ' + artistdata.genres;
    artistGenre.classList.add('artistgenre');
    mainContainer.appendChild(artistGenre);
}


function displayAlbumData(albumdata){
    albumdata.items.forEach((element,index)=>{
        const albumContainer = document.createElement('div');
        albumContainer.classList.add('albumcontainer');


        const albumName = document.createElement('h1');
        albumName.textContent = 'Τίτλος: ' + element.name;
        albumContainer.appendChild(albumName);

        const artistNames = document.createElement('h2');
        const artists = element.artists.map(artist => artist.name).join(', ');
        artistNames.textContent = 'Καλλιτέχνης: ' + artists;
        albumContainer.appendChild(artistNames);

        const itemAlbumGroup = document.createElement('h4');
        itemAlbumGroup.textContent  = 'Τύπος: ' + element.album_group;
        albumContainer.appendChild(itemAlbumGroup);

        const dateReleased = document.createElement('h4');
        dateReleased.textContent = 'Ημερομηνία Κυκλοφορίας: ' + element.release_date;
        albumContainer.appendChild(dateReleased);

        const albumImageLink = document.createElement('a');
        albumImageLink.href = element.external_urls.spotify;
        albumImageLink.target = '_blank';
        
        const albumImage = document.createElement('img');
        albumImage.src = element.images[1].url;
        albumImageLink.appendChild(albumImage);
        albumContainer.appendChild(albumImageLink);

        mainContainer.appendChild(albumContainer);
    });
}



