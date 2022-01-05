function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const numberForm = document.querySelector('.form--number');
const number = async(droga) => {
    const email = getCookie('userEmail');
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty/email/wysylanie-Numer-Drogi',
            data: {
                droga,
                email
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Informacje Wysłane!');
            console.log(droga);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
if (numberForm)
    numberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const droga = document.getElementById('droga').value;
        showAlert('success',
            'Zostałeś zapisany do newslettera');
        number(droga);
    });

const saveButn = document.getElementById('save-butn');
if (saveButn) {
    saveButn.addEventListener('click', () => {
        const dr = document.getElementById('droga').value;
        const email = getCookie('userEmail');
        showAlert('success', 'Wiadomość została wysłana do ciebie!');
        try {
            axios({
                method: 'POST',
                url: '/remonty/email/wysylanieWiadomosci',
                data: {
                    droga: dr,
                    email
                },
            });

        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    })
}