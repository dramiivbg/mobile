# Compile project 

Versiones que necesitas para correr la app mobile de Plur-e Mobile.
- JRE v1.8
- JDK V11
- Node v18.10.0 - dowload with NVM
    - nvm install 18.10.0
    - use 18.10.0
- Gradle 7.5
- Android Studio SDK  33 - 30

## Install

### Install Packages

``` sh
npm install -g @ionic/cli
npm install -g @angular/cli
npm install
```

Si se genera error al compilar en android studio de android.support, ejecutar:

```sh
npm install jetifier
npx jetify
npx cap sync android
```

### Helps Links

- [NVM](https://github.com/coreybutler/nvm-windows#installation--upgrades)