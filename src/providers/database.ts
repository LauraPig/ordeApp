import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DATABASE_NAME } from '../common/config';
import { CREATE_TABLE, INSERT_DATA  } from '../common/table';
import { mock_data } from '../mock/mock-data';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
// import { injectViewContainerRef } from '@angular/core/src/render3';

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
                // db.executeSql(CREATE_TABLE.ct_meal, {});
                // db.executeSql(CREATE_TABLE.ct_plan, {});
                // db.executeSql(CREATE_TABLE.ct_plan_dtl, {});
                // db.executeSql(CREATE_TABLE.ct_product, {});
                db.executeSql(CREATE_TABLE.ct_product_dtl, {});
                // db.executeSql(CREATE_TABLE.ct_product_set, {});
                // db.executeSql(CREATE_TABLE.ct_product_set_dtl, {});
                // db.executeSql(CREATE_TABLE.sys_dict_type, {});
                // db.executeSql(CREATE_TABLE.sys_dict_value, {});
                // db.executeSql(CREATE_TABLE.sys_office, {});
            }).then(() => {
                this.dbObject.transaction((db: SQLiteObject) => {
                    // db.executeSql(INSERT_DATA.ct_product_dtl, ['11', 'p1', 'm1', 100]);
                    if (mock_data.ct_product_dtl && mock_data.ct_product_dtl.length > 0 ) {
                        for (let i = 0; i < mock_data.ct_product_dtl.length; i++) {
                            db.executeSql(INSERT_DATA.ct_product_dtl, mock_data.ct_product_dtl[i]);
                        }
                    }
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
    
    fetchDataByName(tableName: string): Promise<any> {
        return this.dbObject.executeSql(`SELECT * FROM ${tableName}`, {});
    }
    getSumByName(tableName: string): Promise<any> {
        return this.dbObject.executeSql(`SELECT COUNT(*) AS total FROM ${tableName}`, {});
    }
}