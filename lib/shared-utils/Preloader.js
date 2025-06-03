/**
 * 预载器
 */
export var Preloader = {
  blob: function blob(url) {
    var noop = function noop() {
      return null;
    };
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var clear = function clear() {
        xhr.ontimeout = noop;
        xhr.onreadystatechange = noop;
        xhr.onprogress = noop;
        xhr.onabort = noop;
      };
      xhr.ontimeout = function () {
        reject(new Error('timeout'));
        clear();
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 0 && !xhr.response) return;
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
          clear();
        } else {
          reject(new Error('status:' + xhr.status));
          clear();
        }
      };
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send(null);
    });
  }
};