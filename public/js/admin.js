const newRoad = document.querySelector('.form--createRoad');
const admin = async(
    droga,
    odcinek,
    wojewodztwo,
    rodzaj,
    rozpoczecie,
    zakonczenie
) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty',
            data: {
                droga,
                odcinek,
                wojewodztwo,
                rodzaj,
                rozpoczecie,
                zakonczenie,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Remont Dodany!');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
if (newRoad)
    newRoad.addEventListener('submit', (e) => {
        e.preventDefault();
        const droga = document.getElementById('droga').value;
        const odcinek = document.getElementById('odcinek').value;
        const wojewodztwo = document.getElementById('wojewodztwo').value;
        const rodzaj = document.getElementById('rodzaj').value;
        const rozpoczecie = document.getElementById('rozpoczecie').value;
        const zakonczenie = document.getElementById('zakonczenie').value;

        admin(droga, odcinek, wojewodztwo, rodzaj, rozpoczecie, zakonczenie);
    });