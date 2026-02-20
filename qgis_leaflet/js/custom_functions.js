function copyCoords(lon, lat) {
    if (lon === null || lat === null) {
        alert('Няма координати за копиране');
        return;
    }

    const text = lat + ', ' + lon;

    navigator.clipboard.writeText(text).then(function () {
        alert('Координатите са копирани:\n' + text);
    }).catch(function () {
        alert('Грешка при копиране');
    });
}

function openInNewTab(url) {
    if (!url) {
        alert('Липсва идентификатор');
        return;
    }

    // Replace spaces with dashes
    const formattedUrl = url.replace(/\s+/g, '-');

    window.open(
        "https://caves.speleo-bg.org/cave/" + formattedUrl + "/",
        "_blank"
    );
}

window.openGooglemapsInNewTab = function(lat, lng) {
    if (!lat || !lng) {
        alert('Няма координати за Google Maps');
        return;
    }
    window.open("https://www.google.com/maps/place/" + lat + "," + lng, "_blank");
};

window.addLegendToggleControl = function(map) {

    var legendControl = L.Control.extend({
        options: { position: 'topleft' }, // below zoom & geolocate

        onAdd: function () {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = '#fff';
            container.style.width = '34px';
            container.style.height = '34px';
            container.style.cursor = 'pointer';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.title = 'Покажи/скрий легендата';

            container.innerHTML = '🗺️';

            // Prevent clicks from propagating to map
            L.DomEvent.disableClickPropagation(container);

            // Toggle legend div
            container.onclick = function () {
                var legend = document.getElementById('map-legend');
                if (legend) {
                    legend.style.display = (legend.style.display === 'none') ? 'block' : 'none';
                }
            };

            return container;
        }
    });

    map.addControl(new legendControl());
};