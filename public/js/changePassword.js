const formChangePassword = document.querySelector('.form-change-password');
const changePassword = async (data, type) => {
  try {
    const url = '/remonty/users/updateLoginUserPassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} zostało zmienione!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
if (formChangePassword)
  formChangePassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent =
      'Zmienianie Hasła';

    const current = document.getElementById('current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    await changePassword({ current, password, confirmPassword }, 'Hasło');

    document.querySelector('.btn--save-password').textContent = 'Zapisz Hasło';
    document.getElementById('current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
  });
