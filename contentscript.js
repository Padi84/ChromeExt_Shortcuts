var firstSearch = true;

// load the options.
function checkOSinOptions() {

	var os = localStorage["favorite_os"];

	switch (os) {
	case "linux":
		document.getElementById('contLinux').style.display = 'block';
		break;

	case "macOSX":
		document.getElementById('contMacOSX').style.display = 'block';
		break;

	case "windows":
		document.getElementById('contWindows').style.display = 'block';
		break;

	/* default: document.write("Bademantel"); */
	}

}

function show(tableId) {

	var getTable = document.getElementById(tableId.substring(3));

	var getImage = document.getElementById(tableId);

	if (getImage.getAttribute('src') == 'disc_arrow.png') {

		getTable.style.display = 'block';
		getImage.setAttribute('src', 'asc_arrow.png');
		var yPosition = getImage.offsetTop;
		window.scrollTo(0, yPosition);
		// saves the checked part in localStorage
		save_status(tableId);

	} else {

		getTable.style.display = 'none';
		getImage.setAttribute('src', 'disc_arrow.png');
		// deletes the unchecked part in localStorage
		delete_status(tableId);

	}

}

// Saves popup status to localStorage. Only the last checked description part
// would be saved
function save_status(tableId) {
	// save only extended tableIds
	localStorage["tableId"] = tableId;

}

// unchecked description part must be deleted in localStore. No restore needed
// for this part
function delete_status(tableId) {
	if (localStorage["tableId"] = tableId) {
		localStorage.removeItem("tableId");
	} else {
		return;
	}

}

// On load restores the last checked description part from localStorage data
// tableId.
function restore_status() {

	//var bodyText = localStorage["actSearch"];
	var tableId = localStorage["tableId"];

	if (tableId) {
		show(tableId);
	}
	/*if (bodyText) {
		document.body.innerHTML = bodyText;
	}*/

}

/*
 * This is the function that actually highlights a text string by adding HTML
 * tags before and after all occurrences of the search term. You can pass your
 * own tags if you'd like, or if the highlightStartTag or highlightEndTag
 * parameters are omitted or are empty strings then the default <font> tags will
 * be used.
 */
function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag) {
	// the highlightStartTag and highlightEndTag parameters are optional
	if ((!highlightStartTag) || (!highlightEndTag)) {
		highlightStartTag = "<font style='color:blue; background-color:yellow;'>";
		highlightEndTag = "</font>";
	}

	// find all occurences of the search term in the given text,
	// and add some "highlight" tags to them (we're not using a
	// regular expression search, because we want to filter out
	// matches that occur within HTML tags and script blocks, so
	// we have to do a little extra validation)
	var newText = "";
	var i = -1;
	var lcSearchTerm = searchTerm.toLowerCase();
	var lcBodyText = bodyText.toLowerCase();

	while (bodyText.length > 0) {
		i = lcBodyText.indexOf(lcSearchTerm, i + 1);
		if (i < 0) {
			newText += bodyText;
			bodyText = "";
		} else {
			// skip anything inside an HTML tag
			if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
				// skip anything inside a <script> block
				if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText
						.lastIndexOf("<script", i)) {
					newText += bodyText.substring(0, i) + highlightStartTag
							+ bodyText.substr(i, searchTerm.length).
							+ highlightEndTag;
					bodyText = bodyText.substr(i + searchTerm.length);
					lcBodyText = bodyText.toLowerCase();
					i = -1;
				}
			}
		}
	}

	return newText;
}

/*
 * This is sort of a wrapper function to the doHighlight function. It takes the
 * searchText that you pass, optionally splits it into separate words, and
 * transforms the text on the current web page. Only the "searchText" parameter
 * is required; all other parameters are optional and can be omitted.
 */
function highlightSearchTerms(searchText, treatAsPhrase, warnOnFailure,
		highlightStartTag, highlightEndTag) {
	// if the treatAsPhrase parameter is true, then we should search for
	// the entire phrase that was entered; otherwise, we will split the
	// search string so that each word is searched for and highlighted
	// individually

	if (treatAsPhrase) {
		searchArray = [ searchText ];
	} else {
		searchArray = searchText.split(" ");
	}

	if (!document.body || typeof (document.body.innerHTML) == "undefined") {
		if (warnOnFailure) {
			alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
		}
		return false;
	}

	if (firstSearch == true) {
		bodyText = document.body.innerHTML;
		localStorage["innerHTML"] = bodyText;
		firstSearch = false;
	} else {
		bodyText = localStorage["innerHTML"];
	}

	for ( var i = 0; i < searchArray.length; i++) {
		bodyText = doHighlight(bodyText, searchArray[i], highlightStartTag,
				highlightEndTag);
	}

	document.body.innerHTML = bodyText;
	localStorage["actSearch"] = bodyText;
	return true;
}
/**/
function getSearch(e) {

	if (e == 13)
		highlightSearchTerms(document.getElementsByName('string')[0].value,
				false, true);
}
