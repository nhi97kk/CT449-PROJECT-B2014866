exports.setCookie = async (res, token) => {
  res.cookie(process.env.COOKIE_NAME, token, {
    expire: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 + Date.now(),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
};

exports.getCookie = req => {
  return req.cookies[process.env.COOKIE_NAME];
};

exports.clearCookie = async res => {
  res.cookie(process.env.COOKIE_NAME, '', {
    expire: Date.now(),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
};

