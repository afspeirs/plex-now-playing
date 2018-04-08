import { xml2js } from "xml-js"; // https://www.npmjs.com/package/xml-js

window.addEventListener('load', function() {
	const plexArt = document.querySelector('#plex-art');
	const plexGrandparentTitle = document.querySelector('#plex-grandparent-title');
	const plexTitle = document.querySelector('#plex-title');
	const plexRating = document.querySelector('#plex-rating');

	const plexIP = localStorage.getItem('plex-settings-ip') || '';
	const plexPort = localStorage.getItem('plex-settings-port') || '27418';
	const plexToken = localStorage.getItem('plex-settings-token') || '';

	const plexSettingsToggle = document.querySelector('.plex-settings-toggle');
	const plexSettingsContainer = document.querySelector('.plex-settings-container');

	plexSettingsToggle.addEventListener('click', function() {
		plexSettingsContainer.classList.toggle('active');
	});

	const plexSettingsForm = document.getElementById('plex-settings-form');
	const plexSettingsIP = document.getElementById('plex-settings-ip');
	const plexSettingsPort = document.getElementById('plex-settings-port');
	const plexSettingsToken = document.getElementById('plex-settings-token');
	plexSettingsIP.defaultValue = plexIP;
	plexSettingsPort.defaultValue = plexPort;
	plexSettingsToken.defaultValue = plexToken;

	function updateLocalStorage() {
		localStorage.setItem('plex-settings-ip', plexSettingsIP.value);
		localStorage.setItem('plex-settings-port', plexSettingsPort.value);
		localStorage.setItem('plex-settings-token', plexSettingsToken.value);
	}

	function plexSettingsFormSubmit(e) {
		e.preventDefault();
		updateLocalStorage();
	}

	plexSettingsForm.addEventListener('submit', plexSettingsFormSubmit);


	const plexURL = `https://crossorigin.me/http://${plexIP}:${plexPort}`;
	const plexURLToken = `${plexURL}/status/sessions?X-Plex-Token=${plexToken}`;

	function plexDisplay(data) {
		// console.log(data);

		const size = data.elements[0].attributes.size;
		// console.log(size);

		if (size !== '0') {
			console.log('playing');

			const elements = data.elements[0].elements[0];
			// console.log(elements);

			const attributes = elements.attributes;
			// console.log(attributes);

			const art = attributes.art;
			// const art = attributes.grandparentThumb;
			// const art = attributes.thumb;
			// 1516659562const art = attributes.parentThumb;
			// console.log(art);
			plexArt.src = `${plexURL}${art}?X-Plex-Token=${plexToken}`;

			const title = attributes.title;
			// console.log(title);
			plexTitle.innerHTML = title;

			const grandparentTitle = attributes.grandparentTitle;
			// console.log(grandparentTitle);
			if (grandparentTitle) {
				plexGrandparentTitle.innerHTML = grandparentTitle;
			}

			const rating = attributes.contentRating;
			// console.log(rating);
			if (rating) {
				plexRating.innerHTML = `${rating}`;
			}
		} else {
			plexGrandparentTitle.innerHTML = 'Nothing Playing';
		}

	}

	fetch(plexURLToken)
		.then(
			function(response) {
				if (response.status !== 200) {
					console.log(`Looks like there was a problem. Status Code: ${response.status}`);
					return;
				}
				// Do something with the response
				response.text()
					.then(function(data) {
						// console.log(data);
						plexDisplay(xml2js(data));
					});
			}
		)
		.catch(function(err) {
			console.log('Fetch Error', err);
			plexGrandparentTitle.innerHTML = 'Fetch Error', err;
		});
});
