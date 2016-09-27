export const loadJSON = (url, postData) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      resolve(xhr.response);
    } else {
      reject(xhr.response);
    }
  };
  xhr.onerror = () => reject();
  xhr.send();
});

export const postJSON = (url, postData) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      resolve(xhr.response);
    } else {
      reject(xhr.response);
    }
  };
  xhr.onerror = () => reject();
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(postData));
});
