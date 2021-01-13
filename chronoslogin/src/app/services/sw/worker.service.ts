import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  readonly VAPID_PUBLIC_KEY = 'BM0jxjiBQSQQHA2P7D-OpFTCAVJKP3gK0jLiMMyPwrUeAAJapIVluh5YJ2TTaqlwPETmU-8C-exQnK5LSOQUQ0M';
  constructor(private swPush: SwPush) {
  }


  getPermission() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
         console.log('Suscrito', sub);
         this.showMessage();
         })
      .catch(err =>
        console.error('Could not subscribe to notifications', err)
        );
  }

  register() {
    const r = navigator.serviceWorker.register('/ngsw-worker.js', { scope: '/'  });
    console.log('registrado');

  }

  showMessage() {
    // const notificationPayload = {
    //   "notification": {
    //     "title": "Angular News",
    //     "body": "Newsletter Available!",
    //     "icon": "assets/main-page-logo-small-hat.png",
    //     "vibrate": [100, 50, 100],
    //     "data": {
    //       "dateOfArrival": Date.now(),
    //       "primaryKey": 1
    //     },
    //     "actions": [{
    //       "action": "explore",
    //       "title": "Go to the site"
    //     }]
    //   }
    // };

    const options = {
      body: 'This is the innovation, use the new features and improvements of Chronos.',
      icon: 'assets/logos/logoC.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    // LAUNCH PUSH NOTIFICATION
    navigator.serviceWorker.getRegistration().then(reg => {
      reg.showNotification('Welcome to Chronos!', options);
    });

  }
}
