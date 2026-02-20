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

    window.open(
        "https://caves.speleo-bg.org/cave/" + url + "/",
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