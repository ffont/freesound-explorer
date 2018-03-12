const freesound = (function () {
  let authHeader = '';
  let clientId = '';
  let clientSecret = '';
  const host = 'freesound.org';

  const uris = {
    base: `https://${host}/apiv2`,
    textSearch: '/search/text/',
    contentSearch: '/search/content/',
    combinedSearch: '/sounds/search/combined/',
    sound: '/sounds/<sound_id>/',
    soundAnalysis: '/sounds/<sound_id>/analysis/',
    similarSounds: '/sounds/<sound_id>/similar/',
    comments: '/sounds/<sound_id>/comments/',
    download: '/sounds/<sound_id>/download/',
    upload: '/sounds/upload/',
    describe: '/sounds/<sound_id>/describe/',
    pending: '/sounds/pending_uploads/',
    bookmark: '/sounds/<sound_id>/bookmark/',
    rate: '/sounds/<sound_id>/rate/',
    comment: '/sounds/<sound_id>/comment/',
    authorize: '/oauth2/authorize/',
    logout: '/api-auth/logout/',
    logoutAuthorize: '/oauth2/logout_and_authorize/',
    me: '/me/',
    user: '/users/<username>/',
    userSounds: '/users/<username>/sounds/',
    userPacks: '/users/<username>/packs/',
    userBookmarkCategories: '/users/<username>/bookmark_categories/',
    userBookmarkCategorySounds: '/users/<username>/bookmark_categories/<category_id>/sounds/',
    pack: '/packs/<pack_id>/',
    packSounds: '/packs/<pack_id>/sounds/',
    packDownload: '/packs/<pack_id>/download/',
  };

  const makeUri = function (uri, args) {
    for (const a in args) {
      uri = uri.replace(/<[\w_]+>/, args[a]);
    }
    return uris.base + uri;
  };

  const makeRequest = function (uri, success, error, params, wrapper, method, data, contentType) {
    return new Promise((resolve, failure) => {
      if (method === undefined) method = 'GET';
      if (!error)error = function (e) { console.log(e); };
      params = params || {};
      params.format = 'json';
      let paramStr = '';
      for (const p in params) { paramStr = `${paramStr}&${p}=${params[p]}`; }
      if (paramStr) {
        uri = `${uri}?${paramStr}`;
      }

      let xhr;
      try {
        xhr = new XMLHttpRequest();
      } catch (e) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && [200, 201, 202].indexOf(xhr.status) >= 0) {
          const data = eval(`(${xhr.responseText})`);
          resolve(wrapper ? wrapper(data) : data);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          failure(xhr.statusText);
        }
      };
      xhr.open(method, uri);
      xhr.setRequestHeader('Authorization', authHeader);
      if (contentType !== undefined) { xhr.setRequestHeader('Content-Type', contentType); }
      xhr.send(data);
    });
  };
  const checkOauth = function () {
    if (authHeader.indexOf('Bearer') === -1) {
      throw ('Oauth authentication required');
    }
  };

  const makeFD = function (obj, fd) {
    if (!fd) {
      fd = new FormData();
    }
    for (const prop in obj) {
      fd.append(prop, obj[prop]);
    }
    return fd;
  };

  const searchFS = function (options, uri, success, error, wrapper) {
    if (options.analysis_file) {
      makeRequest(makeUri(uri), success, error, null, wrapper, 'POST', makeFD(options));
    } else {
      return makeRequest(makeUri(uri), success, error, options, wrapper);
    }
  };

  const Collection = function (jsonObject) {
    const nextOrPrev = function (which, success, error) {
      makeRequest(which, success, error, {}, Collection);
    };
    jsonObject.nextPage = function (success, error) {
      nextOrPrev(jsonObject.next, success, error);
    };
    jsonObject.previousPage = function (success, error) {
      nextOrPrev(jsonObject.previous, success, error);
    };
    jsonObject.getItem = function (idx) {
      return jsonObject.results[idx];
    };

    return jsonObject;
  };

  const SoundCollection = function (jsonObject) {
    const collection = Collection(jsonObject);
    collection.getSound = function (idx) {
      return new SoundObject(collection.results[idx]);
    };
    return collection;
  };

  const PackCollection = function (jsonObject) {
    const collection = Collection(jsonObject);
    collection.getPack = function (idx) {
      return new PackObject(collection.results[idx]);
    };
    return collection;
  };

  let SoundObject = function (jsonObject) {
    jsonObject.getAnalysis = function (filter, success, error, showAll) {
      const params = { all: showAll ? 1 : 0 };
      makeRequest(makeUri(uris.soundAnalysis, [jsonObject.id, filter || '']), success, error);
    };

    jsonObject.getSimilar = function (success, error, params) {
      makeRequest(
        makeUri(uris.similarSounds, [jsonObject.id]),
        success, error, params, SoundCollection
      );
    };

    jsonObject.getComments = function (success, error) {
      makeRequest(makeUri(uris.comments, [jsonObject.id]), success, error, {}, Collection);
    };

    jsonObject.download = function (targetWindow) { // can be window, new, or iframe
      checkOauth();
      const uri = makeUri(uris.download, [jsonObject.id]);
      targetWindow.location = uri;
    };

    jsonObject.comment = function (commentStr, success, error) {
      checkOauth();
      const data = new FormData();
      data.append('comment', commentStr);
      const uri = makeUri(uris.comment, [jsonObject.id]);
      makeRequest(uri, success, error, {}, null, 'POST', data);
    };

    jsonObject.rate = function (rating, success, error) {
      checkOauth();
      const data = new FormData();
      data.append('rating', rating);
      const uri = makeUri(uris.rate, [jsonObject.id]);
      makeRequest(uri, success, error, {}, null, 'POST', data);
    };

    jsonObject.bookmark = function (name, category, success, error) {
      checkOauth();
      const data = new FormData();
      data.append('name', name);
      if (category) {
        data.append('category', category);
      }
      const uri = makeUri(uris.bookmark, [jsonObject.id]);
      return makeRequest(uri, success, error, {}, null, 'POST', data);
    };

    jsonObject.edit = function (description, success, error) {
      checkOauth();
      const data = makeFD(description);
      const uri = makeUri(uris.edit, [jsonObject.id]);
      makeRequest(uri, success, error, {}, null, 'POST', data);
    };

    return jsonObject;
  };
  const UserObject = function (jsonObject) {
    jsonObject.sounds = function (success, error, params) {
      const uri = makeUri(uris.userSounds, [jsonObject.username]);
      makeRequest(uri, success, error, params, SoundCollection);
    };

    jsonObject.packs = function (success, error) {
      const uri = makeUri(uris.userPacks, [jsonObject.username]);
      makeRequest(uri, success, error, {}, PackCollection);
    };

    jsonObject.bookmarkCategories = function (success, error) {
      const uri = makeUri(uris.userBookmarkCategories, [jsonObject.username]);
      makeRequest(uri, success, error);
    };

    jsonObject.bookmarkCategorySounds = function (success, error, params) {
      const uri = makeUri(uris.userBookmarkCategorySounds, [jsonObject.username]);
      makeRequest(uri, success, error, params);
    };

    return jsonObject;
  };

  const PackObject = function (jsonObject) {
    jsonObject.sounds = function (success, error) {
      const uri = makeUri(uris.packSounds, [jsonObject.id]);
      makeRequest(uri, success, error, {}, SoundCollection);
    };

    jsonObject.download = function (targetWindow) { // can be current or new window, or iframe
      checkOauth();
      const uri = makeUri(uris.packDownload, [jsonObject.id]);
      targetWindow.location = uri;
    };
    return jsonObject;
  };

  return {
          // authentication
    setToken(token, type) {
      authHeader = (type === 'oauth' ? 'Bearer ' : 'Token ') + token;
    },
    setClientSecrets(id, secret) {
      clientId = id;
      clientSecret = secret;
    },

    postAccessCode(code, success, error) {
      const post_url = `${uris.base}/oauth2/access_token/`;
      const data = new FormData();
      data.append('client_id', clientId);
      data.append('client_secret', clientSecret);
      data.append('code', code);
      data.append('grant_type', 'authorization_code');

      if (!success) {
        success = function (result) {
          setToken(result.access_token, 'oauth');
        };
      }
      makeRequest(post_url, success, error, {}, null, 'POST', data);
    },
    textSearch(query, options, success, error) {
      options = options || {};
      options.query = query || ' ';
      return searchFS(options, uris.textSearch, success, error, SoundCollection);
    },
    contentSearch(options, success, error) {
      if (!(options.target || options.analysis_file)) {
        throw ('Missing target or analysis_file');
      }
      searchFS(options, uris.contentSearch, success, error, SoundCollection);
    },
    combinedSearch(options, success, error) {
      if (!(options.target || options.analysis_file || options.query)) {
        throw ('Missing query, target or analysis_file');
      }
      searchFS(options, uris.contentSearch, success, error);
    },
    getSound(soundId, success, error) {
      makeRequest(makeUri(uris.sound, [soundId]), success, error, {}, SoundObject);
    },

    upload(audiofile, filename, description, success, error) {
      checkOauth();
      let fd = new FormData();
      fd.append('audiofile', audiofile, filename);
      if (description) {
        fd = makeFD(description, fd);
      }
      makeRequest(makeUri(uris.upload), success, error, {}, null, 'POST', fd);
    },
    describe(upload_filename, description, license, tags, success, error) {
      checkOauth();
      const fd = makeFD(description);
      makeRequest(makeUri(uris.upload), success, error, {}, null, 'POST', fd);
    },

    getPendingSounds(success, error) {
      checkOauth();
      makeRequest(makeUri(uris.pending), success, error, {});
    },

    // user resources
    me(success, error) {
      checkOauth();
      makeRequest(makeUri(uris.me), success, error);
    },

    getLoginURL() {
      if (clientId === undefined) throw 'client_id was not set';
      let login_url = makeUri(uris.authorize);
      login_url += `?client_id=${clientId}&response_type=code`;
      return login_url;
    },
    getLogoutURL() {
      let logout_url = makeUri(uris.logoutAuthorize);
      logout_url += `?client_id=${clientId}&response_type=code`;

      return logout_url;
    },

    getUser(username, success, error) {
      makeRequest(makeUri(uris.user, [username]), success, error, {}, UserObject);
    },

    getPack(packId, success, error) {
      makeRequest(makeUri(uris.pack, [packId]), success, error, {}, PackObject);
    },
  };
}());

export default freesound;
