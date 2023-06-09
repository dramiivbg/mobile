// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  api: "https://plureapi.azurewebsites.net/api/v1/Mobile/getWarehouses?mobileUserId=",
  production: false,
  appSource: 'Mobile',
  platformCode: 'D365BC',
  // apiUrl: "https://localhost:5001/api",
  apiUrl: {
    DEV: "https://pluredevapi.azurewebsites.net/api",
    TEST: "https://pluretestapi.azurewebsites.net/api",
    LIVE: "https://api.plur-e.com/api",
  },
  // apiUrl: "https://pluredevapi.azurewebsites.net/api",
  // apiUrl: "https://plureapi.azurewebsites.net/api",
  // apiUrl: "https://pluretestapi.azurewebsites.net/api",
  apiVersion: "v1.0",
  apiKey: {
    DEV: "pk_C9QNBm0Onr14Nnlwg3ZAfgxynhJSyhRD5JO4L1bnj8wPPGKDCdTnyH2vKrAuNrpfKw9dIrVp2LqiTRTRHfpvyDfxRtstARK3Rrfs",
    TEST: "pk_C9QNBm0Onr14Nnlwg3ZAfgxynhJSyhRD5JO4L1bnj8wPPGKDCdTnyH2vKrAuNrpfKw9dIrVp2LqiTRTRHfpvyDfxRtstARK3Rrfs",
    LIVE: "pk_Ag5aD7VjwLXa52bzzr2aVZq3kagDMk4u29dt28hbJ8vVwwPApnBUxTFdzGeKZV7EffDMuLBAjENa6ahdh5e9nStUYBqmYbfrSzh5",
  },
  passphrase: 'TUJ&!FN@fn7$rq1SuPWCN3$XNFuMdS2G6GcnZV2kJA&&!9hXoR',
  stripePublishableKey: 'pk_test_51HowlKFsOIPcOXB4uRdIfHkRg5DOn6YKax8R2u2TEGT5CQ4vhH8aWj4Ezztz6YBKoLeK3psZ0kHlaZG7OuyGqFHi00m1mFSacB'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
