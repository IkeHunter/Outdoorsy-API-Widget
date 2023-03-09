const $ = jQuery;
class RentalRvWidget {
    // NJf9xswrQk
    // loader = '<lottie-player class="lottie-loader" src="https://lottie.host/4d7287f5-c241-475c-91fe-f60cd4dab37c/vCnM5ZgXw2.json"  background="transparent" speed="1"  style="width: 300px; height: 300px;"  loop autoplay></lottie-player>';
    loader = '<lottie-player class="lottie-loader" src="Assets/NJf9xswrQk.json"  background="transparent" speed="1"  style="width: 150px; height: 150px;"  loop autoplay></lottie-player>';
    settings = {
        "url": `https://search.outdoorsy.co/rentals?near=${this.longitude},${this.latitude}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Partners": "115",
          "Cookie": "__cf_bm=M152tN47hIcRCPfgnaGmHrpgP96iMYeqvk8aI5CHl58-1677856447-0-Ade7TFzsScwLGkksvl1F1faQI66yDJpf3YC3Yegs35Hr4QcC7CusJVXC+/j1Z7TDQyh9vX9HoRhQC74stPeAMZE="
        },
    };

    /** Initializer Methods **/
    constructor(id="#outdoorsy-api") {
        this.container_id = id;
    }

    initializeData() {
        $(this.container_id).append(this.loader);

        return new Promise(resolve => {
            new Promise(res => {
                navigator.geolocation.getCurrentPosition(res, this.errorHandler);
            })
            .then(() => {
                $.ajax(this.settings).done(function (response) {
                    
                    resolve(response["data"]);
                });
            })

        })

    }

    /** Dynamic Card Methods **/
    createCard(data) {  // takes in response[data][i]
        const attributes = data.attributes; // response["data"][i]["attributes"]
        let card = `
        <a href="#" class="card">
            <img src="${attributes["primary_image_url"]}" alt="">
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
            const data = await this.initializeData();
            $(this.container_id).children('.lottie-loader').hide();
            for(let i=0; i < 4; i++) {
                let card = this.createCard(data[i]);
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





