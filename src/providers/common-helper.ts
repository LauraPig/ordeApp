import {Injectable} from "@angular/core";
import {HomePage} from "../pages/home/home";
import {App} from "ionic-angular";

@Injectable()
export  class CommonHelper {
  constructor(
    // public localstorage: Storage,
    // public alertCtrl: AlertController,
    // public http: HttpClient,
    // public toastCtrl: ToastController,
    // public loadingCtrl: LoadingController,
    // public actionSheetCtrl: ActionSheetController,
    public appCtrl: App,
  ) {
    //this.localstorage.clear();
    // this.UpdateAPIURL();
  }

  public GoBackHomePage() {
    //let activeNav: NavController = this.appCtrl.getActiveNav();
    return this.appCtrl.getRootNav().setRoot(HomePage);
    //return activeNav.setRoot(HomePage);

  }

}
