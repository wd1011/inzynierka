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
            url: '/remonty/email/wysylanie-Nazw-Odcinka',
            data: {
                odcinek,
                email
            },
        });

    } catch (err) {}
};
if (townForm)
    townForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const odcinek = document.getElementById('odcinek').value;
        showAlert('success',
            'Zostałeś zapisany do newslettera');
        town(odcinek);
    });
const saveButton = document.getElementById('save-button');
if (saveButton) {
    saveButton.addEventListener('click', () => {
        const odc = document.getElementById('odcinek').value;
        const email = getCookie('userEmail');
        showAlert('success', 'Wiadomość została wysłana do ciebie!');
        try {
            axios({
                method: 'POST',
                url: '/remonty/email/wysylanieWiadomosci',
                data: {
                    odcinek: odc,
                    email
                },
            });
        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    })
}