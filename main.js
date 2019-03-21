function makeApiCall() {
	var jenrad = [];
	var radRef = [];

	var params = {
	    // The ID of the spreadsheet to retrieve data from.
	    spreadsheetId: '1ALBxhq5iK27_OFaUhW1aQW0dVC6NDB8zwufh_jl8Ifg',

	    // The A1 notation of the values to retrieve.
	    range: 'A2:A',
  };

	var request = gapi.client.sheets.spreadsheets.values.get(params);
  	request.then(function(response) {

  		// create our list of facts
    	radRef = response.result.values;
    	jenrad = radRef.slice(0,radRef.length);

    	// bind onclick functionality
    	document.getElementById('main').onclick = function() { jenrad = setFact(jenrad,radRef); }
    	document.getElementById('main').onkeypress = function() {
    		if ( event.code == 'space' || 'enter'  ) {
    			jenrad = setFact(jenrad,radRef);
    		}
    	}
    	
    	// initialize facts
    	jenrad = setFact(jenrad, radRef);

  		}, function(reason) {
    		console.error('error: ' + reason.result.error.message);
  		});
}

function initClient() {
	var API_KEY = 'AIzaSyBfXgYZoh3q8SXXo0btzlOjuuXBXkdLfNk';
	var CLIENT_ID = '608833165252-b2prh9nvshjusbgegk8utcq6hu533dp2.apps.googleusercontent.com';
	var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

	gapi.client.init({
	    'apiKey': API_KEY,
	    'clientId': CLIENT_ID,
	    'scope': SCOPE,
	    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
	}).then(function() {
	    makeApiCall();
	});
}

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
  	if (isSignedIn) {
    	makeApiCall();
  	}
}

function handleSignInClick(event) {
  	gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
	  gapi.auth2.getAuthInstance().signOut();
}

function setFact(factArray, refArray) {
	var mainDiv = document.getElementById('main');

	if (factArray.length > 0) {
		// pick a (pseudo)random fact
		var index = Math.round( Math.random() * (factArray.length-1) );

		// update the div with the fact
		mainDiv.lastElementChild.innerText = factArray[index];

		// remove fact and return updated array
		factArray.splice(index, 1);
		return factArray;
	} else {
		
		mainDiv.lastElementChild.innerText = 'Much wow. You\'ve read them all. Restart?';

		// reinitialize and return array
    	factArray = refArray.slice(0,refArray.length);
    	return factArray;
	}
}