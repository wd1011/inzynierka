const signupForm = document.querySelector('.form--singup');
const signup = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/remonty/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Udało ci się zarejestrować. Możesz korzystać z serwisu!'
      );
      window.setTimeout(() => {
        location.assign('/mapaPolski');
      }, 150);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name, email, password, confirmPassword);
  });
