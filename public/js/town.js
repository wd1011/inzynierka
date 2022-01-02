function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();

}
const townForm = document.querySelector('.form--town');
const town = async(odcinek) => {
    const email = getCookie('userEmail');
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty/email/wyslij-Nazwe-Odcinka',
            data: {
                odcinek,
                email
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Informacje Wysłane!');
            console.log(odcinek);
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