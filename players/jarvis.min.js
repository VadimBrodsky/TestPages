(function() {
  'use strict';

  function getParams(urlString) {
    return new URLSearchParams(urlString);
  }

  function getPlayerParams(configKeys, params) {
    return Array.from(params.keys())
      .filter(function(key) {
        return !configKeys.includes(key);
      })
      .reduce(function(playerParamsString, filterdKey) {
        return playerParamsString += `${filterdKey}=${params.get(filterdKey)}&`;
      }, '');
  }

  var v3 = {
    inline({ uuid, env, playerParams, type = 'inline' }) {
      const embedCode = document.createElement('script');
      embedCode.type = 'text/javascript';
      embedCode.id = `vidyard_embed_code_${uuid}`;
      embedCode.src = `//play.vidyard.${env}/${uuid}.js?v=3.1.1&type=${type}&${playerParams}`;
      return embedCode;
    },
    lightbox ({ uuid, env, playerParams }) {
      const embedCode = v3.inline({ uuid, env, playerParams, type: 'lightbox' });

      const lightboxImage = document.createElement('div');
      lightboxImage.className = 'outer_vidyard_wrapper';
      lightboxImage.innerHTML = `<div class="vidyard_wrapper" onclick="fn_vidyard_${uuid}();"><img alt="lightbox player alt" src="//play.vidyard.${env}/${uuid}.jpg?" width="360"> <div class="vidyard_play_button"> <a href="javascript:void(0);"></a> </div> </div>`;

      const embedWrapper = document.createElement('div');
      embedWrapper.appendChild(embedCode);
      embedWrapper.appendChild(lightboxImage);
      return embedWrapper;
    },
  };

  const params = getParams(window.location.search);
  const config = {
    type: params.get('type') || 'v3inline',
    env: params.get('env') || 'com',
    uuid: params.get('uuid') || 'QK4FcA7a4LRsfd5rZa26E8',
  };
  config.playerParams = getPlayerParams(Object.keys(config), params);
  console.log('params: ', config);

  let embed = document.createElement('p');
  switch (config.type) {
    case 'v3inline':
      embed = v3.inline(config);
      break;
    case 'v3lightbox':
      embed = v3.lightbox(config);
      break;
    default:
      embed.innerText = 'oh no, not a valid type';
      break;
  }
  document.body.appendChild(embed);
})();
