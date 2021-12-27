const delRoadbtn = document.querySelector('.form--delScrape-Road');
const delModel = async() => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: '/remonty/usuwanie',
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', '.');
    }
};
if (scrapBtn) scrapBtn.addEventListener('click', delModel);