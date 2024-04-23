exports.extractPayload = (payload, includedFields) => {
  const obj = {};
  includedFields.forEach((field) => (obj[field] = payload[field]));

  return obj;
};

exports.filterPayload = (payload, excludedFields) => {
  const obj = { ...payload };
  excludedFields.forEach((field) => delete obj[field]);

  return obj;
};

