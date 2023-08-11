const $ = jQuery;
class RentalRvWidget {
    loader = '<lottie-player class="lottie-loader" src="Assets/NJf9xswrQk.json"  background="transparent" speed="1"  style="width: 150px; height: 150px;"  loop autoplay></lottie-player>';

    /** Initializer Methods **/
    constructor(id="#outdoorsy-api") {
        this.container_id = id;
    }

    async initializeData() {
			$(this.container_id).append(this.loader);
			let baseUrl = 'https://search.outdoorsy.co/rentals';
			let locationParameter = ""
			let fetchUrl = ""
			let getLocation = new Promise((resolve) => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(position => {
					locationParameter = `?near=${position.coords.longitude},${position.coords.latitude}`
					}, this.errorHandler);
				}
				resolve(locationParameter);
	})
			console.log("Fetching location")
			locationParameter = await getLocation;
			console.log("location parameter = " + locationParameter)

			const fetchURL = `${baseUrl}${locationParameter}`
			console.log("Attempting to fetch " + fetchURL);

			let getRentals = fetch(fetchURL)
			let rentals = await getRentals;
			const response = await fetch(fetchURL);
			return await response.json();
		}

    /** Dynamic Card Methods **/
		// takes in response[data][i]
    createCard(data) {
        const attributes = data.attributes; // response["data"][i]["attributes"]
        let card = `
        <a href="https://outdoorsy.com${attributes["slug"]}" class="card" target="_blank">
            <img width="100%" height="225px" src="${attributes["primary_image_url"]}" alt="${attributes["vehicle_title"]}" >
            <div class="content">
                <h4>${attributes["vehicle_title"]}, ${attributes["vehicle_make"]}</h4>
                <div>
                    <span class="description">${attributes["vehicle_year"]} ${attributes["display_vehicle_type"]} • ${attributes["vehicle_length"]} ft</span><span class="description">${attributes["location"]["city"]}, ${attributes["location"]["state"]}</span><span class="description"><i class="material-icons">star</i>${attributes["score"].toFixed(1)} • ${attributes["reviews_num"]} Reviews • Sleeps ${attributes["sleeps"]}</span>
                </div>

                <div class="price"><strong>$${attributes["price_per_day"]/100}</strong><span>/day</span></div>
            </div>
        </a>
        `;
        return card;
    }

	displayGrid() {
		$('document').ready(async () => {
		console.log("in displayGrid - before initializeData()");
    const fetchedData = await this.initializeData();
		console.log("back from init data!");
		const cardData = fetchedData.data;
		console.log(cardData);
    $(".lottie-loader").hide();
    for(let i=0; i < 4; i++) {
			let card = this.createCard(cardData[i]);
      $(this.container_id).append(card);
		}
})
}

    /** Location Methods **/
    errorHandler(err) {
        $(this.container_id).children('.lottie-loader').hide();
        let errorText = "Location Error";
        if(err.code == 1) {
            // alert("Error: Access is denied!");
            errorText = "Location access denied.";

        }else if( err.code == 2) {
            // alert("Error: Position is unavailable!");
            errorText = "Position is unavailable";
        }
        const errorMsg = `<strong class="location-error">${errorText}</strong>`;
        $(this.container_id).append(errorMsg);
    }

}




$(document).ready(() => {
	elements = $('#outdoorsy-api');
    if(elements.length > 0) {
        widget = new RentalRvWidget();
        widget.displayGrid();
    }
});

