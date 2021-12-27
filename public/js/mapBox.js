const locations = document.getElementById('map');
mapboxgl.accessToken =
  'pk.eyJ1Ijoid2QxMTExIiwiYSI6ImNrd2piaHdiODFna3YybnF2OGxrYTE0a3MifQ.pjyK6iLyTr-sluqO-W2S9g';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/wd1111/ckwjq1pcw826y14occpa1305p',
});
map.on('click', (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['remonty'],
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];

  const popup = new mapboxgl.Popup({
    offset: [0, -15],
  })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<h3>Rodzaj prac drogowych:<p>${feature.properties.Rodzaj}</p></h3>
            <h3>Opis wykonywanych prac<p>${feature.properties.Opis}</p></h3>          
            <h3>Data Rozpoczęcia:<p>${feature.properties.dataRozp}</p></h3>
            <h3>Data Zakończenia:<p>${feature.properties.dataWyg}</p></h3>`
    )
    .addTo(map);
});
