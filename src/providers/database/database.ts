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
    // 创建数据库
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


    // CT_Material表
    updateCtMaterialTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.dbObject = db;
        this.dbObject.transaction((db: SQLiteObject) => {
          list.map(item => {
            console.log(item);
            db.executeSql(`SELECT COUNT(*) AS total FROM CT_Material WHERE id=${item.id}`, {}).then(res => {
              if (res.rows.length && res.rows.item(0).total > 1) {

                // TODO
                //字段数量不够20
                db.executeSql(UPDATE_DATA.CT_Material, [item.id, item.materialType, item.materialname, item.unit, item.exp, item.specification, item.isvalid, item.pinyin, item.attribute, item.officeId]).then().catch(e => {
                  alert(`更新CT_Material表数据失败`);
                });
              } else {
                db.executeSql(INSERT_DATA.CT_Material, [item.id, item.materialType, item.materialname, item.unit, item.exp, item.specification, item.isvalid, item.pinyin, item.attribute, item.officeId]).then().catch(e => {
                  alert(`插入CT_Material表数据失败`);
                });
              }
            }).catch(e => {

            });
          });
        }).then().catch(e => {

        });
      }).catch(e => {});
    }

  //   ct_meal  还有问题
  updateCtMealTableData(list: Array<any>): Promise<any> {
    return  this.sqlite.create({
      name: DATABASE_NAME,
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.dbObject = db;
      this.dbObject.transaction((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM ct_meal WHERE id=${item.id}`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 1) {
              db.executeSql(UPDATE_DATA.ct_meal, [item.id, item.materialType, item.materialname, item.unit, item.exp, item.specification, item.isvalid, item.pinyin, item.attribute, item.officeId]).then().catch(e => {
                alert(`更新CT_Material表数据失败`);
              });
            } else {
              db.executeSql(INSERT_DATA.ct_meal, [item.id, item.materialType, item.materialname, item.unit, item.exp, item.specification, item.isvalid, item.pinyin, item.attribute, item.officeId]).then().catch(e => {
                alert(`插入CT_Material表数据失败`);
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
