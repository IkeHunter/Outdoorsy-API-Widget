class RentalRvWidget {
    settings = {
        "url": "https://search.outdoorsy.co/rentals?near=29.651634,-82.324829",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Partners": "115",
          "Cookie": "__cf_bm=M152tN47hIcRCPfgnaGmHrpgP96iMYeqvk8aI5CHl58-1677856447-0-Ade7TFzsScwLGkksvl1F1faQI66yDJpf3YC3Yegs35Hr4QcC7CusJVXC+/j1Z7TDQyh9vX9HoRhQC74stPeAMZE="
        },
    };
    
    constructor(long, lat) {
        this.longitude = long;
        this.latitude = lat;
    }

    initializeData() {
        return new Promise(resolve => {
            $.ajax(this.settings).done(function (response) {
                resolve(response["data"]);
            });
        })
    }

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
            for(let i=0; i < 4; i++) {
                let card = this.createCard(data[i]);
                $('#dynamic-row').append(card);
            }
        })

    }
}


widget = new RentalRvWidget(0, 0);
widget.displayGrid();



