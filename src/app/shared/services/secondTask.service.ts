import { Injectable } from "@angular/core";
import { App } from '@capacitor/app';
import { Plugins } from '@capacitor/core';
const { BackgroundTask } = Plugins;

@Injectable()
export class SecondTaskService {
    constructor(
        
    ) {}

    async Test(obj: any){
        BackgroundTask

        App.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
          });


        // App.addListener('appStateChange', state => {
        //     console.log(1);
        //     if (!state.isActive) {
        //       // The app has become inactive. We should check if we have some work left to do, and, if so,
        //       // execute a background task that will allow us to finish that work before the OS
        //       // suspends or terminates our app:
          
        //       let taskId = BackgroundTask.beforeExit(async () => {
        //         // In this function We might finish an upload, let a network request
        //         // finish, persist some data, or perform some other task

        //         obj.func();
          
        //         // Example of long task
        //         // var start = new Date().getTime();
        //         // for (var i = 0; i < 1e18; i++) {
        //         //   if (new Date().getTime() - start > 20000) {
        //         //     break;
        //         //   }
        //         // }
        //         // Must call in order to end our task otherwise
        //         // we risk our app being terminated, and possibly
        //         // being labeled as impacting battery life
        //         BackgroundTask.finish({
        //           taskId,
        //         });
        //       });
        //     }
        //   });
    }

}