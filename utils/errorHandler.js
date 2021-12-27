class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    //jesli status zaczyna sie od 4 to bedzie sie wyswiatlal fail w innym wypadku bedzie status error
    this.isOperational = true; // bledy operacyjne ktore jestesmy wstanie przewidziec np  uzytkownik tworzacy wycieczke bez wymaganych pol

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
