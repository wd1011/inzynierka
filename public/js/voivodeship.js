function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const voivodeshipForm = document.querySelector('.form--voivodeship');

const voivodeship = async(wojewodztwo) => {
    const email = getCookie('userEmail');
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty/email/wyslij-Wojewodztwo',
            data: {
                wojewodztwo,
                email
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Zapisałeś się do newslettera!');
            console.log(wojewodztwo);
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

const saveBtn = document.getElementById('save-btn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const voi = document.getElementById('wojewodztwo').value;
        const email = getCookie('userEmail');
        try {
            axios({
                method: 'POST',
                url: '/remonty/email/wyslijWiadomosc',
                data: {
                    wojewodztwo: voi,
                    email
                },
            }).then(res => {
                if (res.data.status === 'success') {
                    showAlert('success', 'Wysłano!');
                }
            });
        } catch (err) {
            showAlert('error', err.response.data.message);
        }
    })
}