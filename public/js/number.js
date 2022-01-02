const numberForm = document.querySelector('.number-road');
const number = async (droga) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/remonty/znajdz/numerDrogi',
      data: {
        droga,
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
    number(droga);
  });
