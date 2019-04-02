import { formatQueryParams } from '../utils/formatQueryParams';
const { BASE_URL } = require('../constants/index.js');

// TODO: 处理网络错误
function post(childUrl, data = {}) {
  const promise = new Promise(function(resolve, reject) {
    wx.request({
      url: `${BASE_URL}/${childUrl}`,
      data: data,
      method: 'POST',
      success: function(res) {
        resolve(res.data);
      },
    });
  });

  return promise;
}

function get(childUrl, params = {}) {
  console.log(params, childUrl);
  const promise = new Promise(function(resolve, reject) {
    wx.request({
      url: `${BASE_URL}/${childUrl}${formatQueryParams(params)}`,
      method: 'GET',
      success: function(res) {
        resolve(res.data);
      },
    });
  });

  return promise;
}

module.exports = {
  post,
  get,
};
