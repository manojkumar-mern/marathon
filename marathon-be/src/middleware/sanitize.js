const stripNested = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) return obj.map(stripNested);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    clean[key] = stripNested(value);
  }
  return clean;
};

export const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = stripNested(req.body);
  if (req.params) req.params = stripNested(req.params);
  if (req.query) {
    const clean = stripNested(req.query);
    for (const key in req.query) {
      delete req.query[key];
    }
    Object.assign(req.query, clean);
  }
  next();
};
