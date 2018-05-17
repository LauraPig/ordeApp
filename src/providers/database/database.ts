import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DATABASE_NAME } from '../../common/config';
import { CREATE_TABLE, INSERT_DATA, UPDATE_DATA  } from '../../common/table';
// import { mock_data } from '../../mock/mock-data';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class DataBaseService {
    dbObject: SQLiteObject;
    constructor(
        private sqlite: SQLite,
        private toastCtrl: ToastController,
    ){
        console.log('数据库初始化');
    }
    creatDataBase(): Promise<any> {
        return this.sqlite.create({
            name: DATABASE_NAME,
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.dbObject = db;
            this.dbObject.transaction((db: SQLiteObject) => {
                db.executeSql(CREATE_TABLE.CT_Material, {});
                db.executeSql(CREATE_TABLE.ct_meal, {});
                db.executeSql(CREATE_TABLE.ct_plan, {});
                db.executeSql(CREATE_TABLE.ct_plan_dtl, {});
                db.executeSql(CREATE_TABLE.ct_product, {});
                db.executeSql(CREATE_TABLE.ct_product_dtl, {});// 可以创建
                db.executeSql(CREATE_TABLE.ct_product_set, {});
                db.executeSql(CREATE_TABLE.ct_product_set_dtl, {});
                db.executeSql(CREATE_TABLE.sys_dict_type, {});
                db.executeSql(CREATE_TABLE.sys_dict_value, {});
                db.executeSql(CREATE_TABLE.sys_office, {});
            }).then(() => {
                this.dbObject.transaction((db: SQLiteObject) => {
                  // TODO
                }).catch(e => {
                    this.toastCtrl.create({
                        // message: `插入数据:${JSON.stringify(e).toString()}`,
                        message: `插入数据:${e.toString()}`,
                        duration: 25000,
                        position: 'middle'
                      }).present();
                      console.log(e);
                });
            }).catch(e => {
                this.toastCtrl.create({
                    message: `创建表：${JSON.stringify(e).toString()}`,
                    duration: 25000,
                    position: 'middle'
                  }).present();
                  console.log(e);
            });
        });
    }

    updateCt_productTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.dbObject = db;
        this.dbObject.transaction((db: SQLiteObject) => {
          list.map(item => {
            console.log(item);
            db.executeSql(`SELECT COUNT(*) AS result FROM ct_product WHERE id=${item.id}`, {}).then(res => {
              if (res.rows.length && res.rows.item(0).total > 1) {
                db.executeSql(UPDATE_DATA.ct_product,
                  [item.id, item.remarks, item.createBy, item.createDate, item.updateBy, item.updateDate, item.productName, item.factory, item.office, item.productType, item.price, item.imgUrl, item.isScore, item.costCredits, item.isPack, item.isHold, item.isApproval, item.summary, item.labels, item.cost, item.delFlag]).then().catch(e => {
     alert(`更新${tablename}表数据失败`);
                });
              } else {
                db.executeSql(`INSERT INTO ${tableName} VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `, [item.id, item.remarks, item.createBy, item.createDate, item.updateBy, item.updateDate, item.productName, item.factory, item.office, item.productType, item.price, item.imgUrl, item.isScore, item.costCredits, item.isPack, item.isHold, item.isApproval, item.summary, item.labels, item.cost, item.type, item.objNum]).then().catch(e => {
                  alert(`插入${tablename}表数据失败`);
                });
              }
            }).catch(e => {

            });
          });
        }).then().catch(e => {

        });
      }).catch(e => {});

    }

    openDataBase(): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      });

    }
    getSumByName(tableName: string): Promise<any> {
      this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
       return db.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {});
      }).catch(e => {
        return new Promise((resolve, reject) => {
          reject(e);
        });
      });
      return null;
      // return this.dbObject.transaction((db: SQLiteObject) => {
      //   db.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {});
      // });
        // return this.dbObject.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {});
    }
}
