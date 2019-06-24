const throwOnNetworkError = async (endpoint, others) => {
  try {
    return await fetch(endpoint, others);
  } catch (error) {
    throw {
      error: true,
      payload: new Error(error.message),
      meta: {},
    };
  }
};

export default next => async ({ endpoint, ...others }) => {
  const resp = await throwOnNetworkError(endpoint, others);

  const meta = {};
  resp.headers.forEach((value, key) => (meta[key] = value));
  meta.statusCode = resp.status;

  if (!resp.ok) {
    const error = new Error('Bad Response');
    error.statusCode = resp.statusCode;
    error.payload = await resp.text();
    error.meta = meta;
    throw error;
  }

  return next({
    payload: await resp.text(),
    meta,
  });
};
