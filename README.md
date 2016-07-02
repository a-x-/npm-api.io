# ![logo](favicon.png) npm-api.io
Npm Api Service

## Usage

`GET /p/:package` e.g. [`GET /p/gulp`](http://npm-api.herokuapp.com/p/gulp)
retrieves gulp's github url.

`GET /go/:package` e.g. [`GET /go/enb`](http://npm-api.herokuapp.com/go/enb)
redirects to enb's github repo page.

## For what
### Alfred: fast opener github repo for npm package
Use it with your **Alfred** app for fast opening npm-packages' git repos.

![Alfred.app npm-go — setup](alfred-setup.png)
![Alfred.app npm-go — use](alfred-use.png)

**💡Tip** Grab an icon for the Alfred by url: [npm-api.herokuapp.com/favicon.png](http://npm-api.herokuapp.com/favicon.png)

### Chrome: custom search github repo for npm package
Use it in Chrome, Opera, Yandex.browser and another Chromium based bro as custom search.

![Chrome.app npm-go — setup](chrome-setup.png)
![Chrome.app npm-go — use](chrome-use.png)

**💡Tip** Use as search url: `http://npm-api.herokuapp.com/%s`