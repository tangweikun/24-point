// TODO: Add Unit Test
export function formatQueryParams(params, sep = '&') {
  if (Object.keys(params).length === 0) {
    return '';
  }

  const encoded = [];
  for (let key in params) {
    encoded.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    );
  }

  return '?'.concat(encoded.join(sep));
}
