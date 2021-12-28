/* eslint-disable */

const login = async(email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/remonty/users/signin',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'udalo ci się zalogować!');
            window.setTimeout(() => {
                location.assign('/mapaPolski');
            }, 150);
        }
    } catch (err) {
        //console.log(err.response);
        showAlert('error', 'Nie poprawny adres email lub haslo');
    }
};

const logout = async() => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/remonty/users/logout',
        });
        if ((res.data.status = 'success')) {
            window.setTimeout(() => {
                location.assign('/');
            }, 150);
        }
    } catch (err) {
        //console.log(err.response);
        showAlert('error', 'Nie udało ci sie wylogować.');
    }
};
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });