const search = document.getElementById('search-qry');
const searchBtn = document.querySelector('.search-btn');
const clearBtn = document.querySelector('.clear-btn');

clearBtn.addEventListener('click', () => {
    search.value = '';
    document.querySelector('.results-container').innerHTML = '';
    
});

searchBtn.addEventListener('click', () => {
    const query = search.value.toLowerCase();
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';

    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            if (query === "country") {
                data.countries.forEach(country => {
                    country.cities.slice(0, 1).forEach(city => results.push(city)); // Pick the first city from each country
                });
                results = results.slice(0, 2);
            } 
            else if (query === "beach") {
                results = data.beaches.slice(0, 2); 
            } 
            else if (query === "temple") {
                results = data.temples.slice(0, 2); 
            } 
            else {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query) || city.description.toLowerCase().includes(query)) {
                            results.push(city);
                        }
                    });
                });

                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(query) || temple.description.toLowerCase().includes(query)) {
                        results.push(temple);
                    }
                });

                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(query) || beach.description.toLowerCase().includes(query)) {
                        results.push(beach);
                    }
                });
            }

            if (results.length > 0) {
                results.forEach(result => {
                    const resultCard = document.createElement('div');
                    resultCard.classList.add('result-card');

                    resultCard.innerHTML = `
                        <img src="${result.imageUrl}" alt="${result.name}" class="card-image">
                        <div class="card-content">
                            <h2 class="card-title">${result.name}</h2>
                            <p class="card-description">${result.description}</p>
                            <a href="#" class="visit-btn">Visit</a>
                        </div>
                    `;

                    resultsContainer.appendChild(resultCard);
                });
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => console.error('Error fetching the data:', error));
});
