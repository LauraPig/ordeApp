import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'scan-page'
})
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  constructor(public navCtrl: NavController,
              public platform:Platform,
              public qrScanner: QRScanner) {

    // solve the problem - "plugin not installed".
    platform.ready().then(()=>{
      this.qrscanner();
    })

  }

  qrscanner() {

    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {

          this.qrScanner.show()
            .then((data : QRScannerStatus)=> {
              this.qrScanner.resumePreview();
              let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                console.log('Scanned something', text);
                alert(text);
                this.qrScanner.hide(); // hide camera preview
                scanSub.unsubscribe(); // stop scanning
                this.navCtrl.pop();
              });
              alert(data.showing);
            },err => {
              alert(err);

            });


          // camera permission was granted
          // alert('authorized');

          // start scanning





          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          alert('denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('else');
        }
      })
      .catch((e: any) => {
        alert('Error is' + e);
      });

  }

}
