const voivodeshipForm = document.querySelector('.form--voivodeship');
const voivodeship = async(
    wojewodztwo,
) => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/remonty/znajdz/wojewodztwa',
            data: {
                wojewodztwo,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Informacje Wysłane!');
            console.log(wojewodztwo)
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
if (voivodeshipForm)
    voivodeshipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wojewodztwo = document.getElementById('wojewodztwo').value;
        voivodeship(wojewodztwo);
    });