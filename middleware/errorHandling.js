module.exports = ({ statusCode=500, status='fail', message=''}, req, res, next) => {  
    res.status(statusCode).json({
      status,
      message
    });
  };