const CLIENT_ID = '';//ENTER your CLIENT_ID from spotify dashboard;
const CLIENT_SECRET = '';//Enter your CLIENT_SECRET from spotify dashboard;

const fetchToken = async function(){
    try{
    let authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    };

    const response = await  fetch('https://accounts.spotify.com/api/token',authOptions);

    if(!response.ok){
        throw new Error('There was a problem while fetching the token');
    }

    const token = await response.json();
    return token.access_token;
    }catch(error){
        console.error(error);
    }
}

export const getToken = async function(){
    let token = await fetchToken();

    setInterval(()=>{
        try{
            console.log(token);
        }catch(error){
            console.error(error);
        }
    },1000 * 60 * 45)
    return token;
}
