# simple progressive web app

  *An example for progressive web application*

## [Demo](https://gokulkrishh.github.io/demo/sw/index.html)

## Description

  This app web application will works in offline, has a splash screen, add to home screen etc,.

## Screenshots

  *From moto x 2014 - OS Android Marshmallow*

  1. Home screen in chrome browser

  <img alt="Chrome Homescreen" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot1.png" width="300" height="100%">

  2. Add to home screen in chrome browser

  <img alt="Chrome browser add to home screen" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot2.png" width="300" height="100%">

  3. Standalone app home screen

  <img alt="Standalone Homescreen" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot3.png" width="300" height="100%">

  4. Standalone app menu

  <img alt="Standalone app menu" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot4.png" width="300" height="100%">

  5. Standalone app on scroll

  <img alt="Standalone app on scroll" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot5.png" width="300" height="100%">

  6. Push notification permission

  <img alt="Push notification permission" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot6.png" width="300" height="100%">

  7. Push notification

  <img alt="Push notification" src="https://raw.githubusercontent.com/gokulkrishh/simple-progressive-web-app/master/images/screenshots/screenshot7.png" width="300" height="100%">

## Install

  1. git clone https://github.com/gokulkrishh/simple-progressive-web-app

  2. cd into simple-progressive-web-app

  3. In terminal, type

  ```
    $ python -m SimpleHTTPServer 3000
  ```

  4. In browser, open [http://localhost:3000](localhost:3000)

  5. Load the page, turn on airplane mode or offline network throttling. To see the cached resources offline.


## Todo's

  - [x] - Added service worker file.

  - [x] - Add web manifest.json file for splash screen, add to home screen etc.

      *To generate manifest.json file, use this npm module [manifest-json](https://github.com/hemanth/manifest-json)*

      ```
        $ npm install --global manifest-json
      ```

  - [x] - Push notification - Get curl command in console to send notification

  - [ ] - Fallback when offline - In progress


## Reference

1. [Google Developer Site](https://developers.google.com/web/progressive-web-apps)

1. [Offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)


## Author

[![Gokulakrishnan](https://avatars0.githubusercontent.com/u/2944237?v=3&s=72)](https://github.com/gokulkrishh)


## Follow me

[1.1]: http://i.imgur.com/tXSoThF.png (twitter icon with padding)
[2.1]: http://i.imgur.com/P3YfQoD.png (facebook icon with padding)
[3.1]: http://i.imgur.com/yCsTjba.png (google plus icon with padding)
[4.1]: http://i.imgur.com/0o48UoR.png (github icon with padding)

[1]: http://www.twitter.com/gokul_i
[2]: http://www.facebook.com/gokulkrishh
[3]: https://plus.google.com/+GokulKalaikoven
[4]: http://www.github.com/gokulkrishh

[![alt text][1.1]][1] [![alt text][2.1]][2] [![alt text][3.1]][3] [![alt text][4.1]][4]
