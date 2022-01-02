const scrapBtn = document.querySelector('.form--scrapeRoad');
const scrap = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/remonty/scrapowanie',
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    //console.log(err.response);
    showAlert('error', '.');
  }
};
if (scrapBtn) scrapBtn.addEventListener('click', scrap);
