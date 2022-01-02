const townForm = document.querySelector('.form--number');
const town = async(
    odcinek,
) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty/znajdz/miasto',
            data: {
                odcinek,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Informacje Wysłane!');
            console.log(odcinek)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
if (townForm)
    townForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const odcinek = document.getElementById('odcinek').value;
        town(odcinek);
    });