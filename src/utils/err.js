const err = (_, res, next) => {
  res.err = (code, error, log) => {
    res.status(code).json({ error });
    if (log) console.log(log);
  };
  next();
};

export default err;
