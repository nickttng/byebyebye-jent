
function makeApiCall() {
	var nicolefacts = [];
	var factsRef = [];

	var params = {
	    // The ID of the spreadsheet to retrieve data from.
	    spreadsheetId: '1bg2Sz7MwnyUJXCdxJHL-f_wiyY5nJWiMYfyJgRzpzqU',

	    // The A1 notation of the values to retrieve.
	    range: 'A2:A',
  };

	var request = gapi.client.sheets.spreadsheets.values.get(params);
  	request.then(function(response) {

  		// create our list of facts
    	factsRef = response.result.values;
    	nicolefacts = factsRef.slice(0,factsRef.length);

    	// bind onclick functionality
    	document.getElementById('main').onclick = function() { nicolefacts = setFact(nicolefacts,factsRef); }
    	document.getElementById('main').onkeypress = function() {
    		if ( event.code == 'space' || 'enter'  ) {
    			nicolefacts = setFact(nicolefacts,factsRef);
    		}
    	}
    	
    	// initialize facts
    	nicolefacts = setFact(nicolefacts, factsRef);

  		}, function(reason) {
    		console.error('error: ' + reason.result.error.message);
  		});
}

function initClient() {
	var API_KEY = 'AIzaSyBlvzcnpxN_RVtfF-13KtqfmJ4v0MTTok8';
	var CLIENT_ID = '708740926980-g0p1m7uto30ronppolbq6cguf9leg29c.apps.googleusercontent.com';
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
		
		mainDiv.lastElementChild.innerText = 'That\'s all the facts we have. Restart?';

		// reinitialize and return array
    	factArray = refArray.slice(0,refArray.length);
    	return factArray;
	}
}