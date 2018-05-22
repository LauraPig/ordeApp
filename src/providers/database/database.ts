import {SQLite, SQLiteObject, SQLiteTransaction} from '@ionic-native/sqlite';
import { DATABASE_NAME } from '../../common/config';
import { CREATE_TABLE, INSERT_DATA, UPDATE_DATA  } from '../../common/table';
// import { mock_data } from '../../mock/mock-data';
import { Injectable } from '@angular/core';
import {LoadingController, ToastController} from 'ionic-angular';
import {getIdSet} from "../../utils/index";

@Injectable()
export class DataBaseService {
    dbObject: SQLiteObject;
    constructor(
        private sqlite: SQLite,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
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



    test(list: Array<any>){
      let initLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '更新数据中...',
      });
      initLoading.present().then(() => {
        this.openDataBase().then((db: SQLiteObject) =>{
          db.transaction((tx: SQLiteTransaction) =>{
            list.map((item, index) =>{
              tx.executeSql(`SELECT COUNT(*) AS total FROM CT_Material WHERE id='${item.id}'`, [], (res) =>{
                alert('res' + JSON.stringify(res));
                if (res.rows.item(0).total > 0) {
                  tx.executeSql(UPDATE_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () => {
                    if (index === list.length - 1) {
                      // alert('index---' + index);
                      initLoading.dismiss();
                    }
                  }, (e) =>{
                    initLoading.dismiss();
                    alert('eeeeee-update-' + JSON.stringify(e));
                  });
                } else {
                  tx.executeSql(INSERT_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () =>{
                    if (index === list.length - 1) {
                      initLoading.dismiss();
                      // alert('index---' + index);
                    }
                  }, e =>{
                    alert('eeeeee-insert-' + JSON.stringify(e));
                  });
                }
              }, e =>{});
            });
          }).then().catch(e => {
            initLoading.dismiss();
            alert('---transaction- ' + e.toString());
          });
        });
      });
    }

    testByDelete (list: Array<any>) {
    let initLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '更新数据中...',
    });
    initLoading.present().then(() =>{
      let resultList = [];
      let sqlStr = getIdSet(list);

      this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM CT_Material WHERE id in ('${sqlStr}')`, {}).then(res =>{
          // alert('res--delete--' + JSON.stringify(res));
          if (res) {
            this.openDataBase().then((db: SQLiteObject) =>{
              db.transaction((tx: SQLiteTransaction) => {
                list.map((item, index) => {
                  tx.executeSql(INSERT_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () =>{
                    if (index === list.length - 1) {
                      initLoading.dismiss();
                      // alert('index---' + index);
                    }
                  }, e =>{
                    initLoading.dismiss();
                    alert('eeeeee-insert-' + JSON.stringify(e));
                  });
                });
              }).then().catch(e =>{
                alert('操作CT_Material表数据失败-transaction-' + e.toString());
                initLoading.dismiss();
              });
            }).catch(e =>{

            });
          }


        }).catch(e =>{
          alert('操作CT_Material表数据失败--' + JSON.stringify(e));
        });

      }).catch(e => {
        alert('操作CT_Material表数据失败');
      });
    });
    // let idList = [];

  }


    // CT_Material表
    updateCtMaterialTableData (list: Array<any>) {
      let initupdateCtMaterialLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '更新数据中...',
      });
      initupdateCtMaterialLoading.present().then(() =>{
        let resultList = [];
        let sqlStr = getIdSet(list);

        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`SELECT id FROM CT_Material WHERE id in ('${sqlStr}')`, {}).then(res =>{
            // alert('idset--' + JSON.stringify(res.rows.item(0)));
            if (res.rows.length) {
              for(var i = 0; i < res.rows.length; i++) {
                resultList.push(res.rows.item(i).id);
              }
            }
            this.openDataBase().then((db: SQLiteObject) =>{
              db.transaction((tx: SQLiteTransaction) => {
                list.map((item, index) => {
                  if (resultList.indexOf(item.id) > -1) {
                    tx.executeSql(UPDATE_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () => {
                      if (index === list.length - 1) {
                        // alert('index---' + index);
                        initupdateCtMaterialLoading.dismiss();
                      }
                    }, (e) =>{
                      initupdateCtMaterialLoading.dismiss();
                      alert('eeeeee-update-' + JSON.stringify(e));
                    });
                  } else {
                    tx.executeSql(INSERT_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () =>{
                      if (index === list.length - 1) {
                        initupdateCtMaterialLoading.dismiss();
                        // alert('index---' + index);
                      }
                    }, e =>{
                      initupdateCtMaterialLoading.dismiss();
                      alert('eeeeee-insert-' + JSON.stringify(e));
                    });
                  }
                });
              }).then().catch(e =>{
                alert('操作CT_Material表数据失败-transaction-' + e.toString());
                initupdateCtMaterialLoading.dismiss();
              });
            }).catch(e =>{

            });

          }).catch(e =>{
            alert('操作CT_Material表数据失败--' + JSON.stringify(e));
          });

        }).catch(e => {
          alert('操作CT_Material表数据失败');
        });
      });
      // let idList = [];

    }


    //   ct_meal
    updateCtMealTableData(list: Array<any>) {

      let resultList = [];
      let initLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '更新ct_meal数据中...',
      });
      initLoading.present().then(() =>{
        let sqlStr = getIdSet(list);

        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`SELECT id FROM ct_meal WHERE id in ('${sqlStr}')`,{}).then(res =>{
            if (res.rows.length) {
              for(var i = 0; i < res.rows.length; i++) {
                resultList.push(res.rows.item(i).id);
              }
            }
            db.transaction((tx: SQLiteTransaction) =>{
              list && list.map((item, index) =>{
                if (resultList.indexOf(item.id) > -1) {
                  tx.executeSql(UPDATE_DATA.ct_meal, [item.id, item.factoryId, item.officeId, item.mealType, item.preHour, item.endHour, item.backHour, item.isPre, item.startTime, item.endTime, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks],() =>{
                    if (index === list.length - 1) {
                      alert('index-ct_meal--' + index);
                      initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in update ct_meal table ,cause by: ' +  e.toString());
                    initLoading.dismiss();
                  });
                } else {
                  tx.executeSql(INSERT_DATA.ct_meal, [item.id, item.factoryId, item.officeId, item.mealType, item.preHour, item.endHour, item.backHour, item.isPre, item.startTime, item.endTime, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks],() =>{
                    if (index === list.length - 1) {
                      alert('index-ct_meal--' + index);
                      initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_meal table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                }
              });
            }).then(() =>{

            }).catch(e =>{
              alert('err in operate the ct_meal table cause by: ' + e.toString());
              initLoading.dismiss();
            });
          }).catch(e => {
            initLoading.dismiss();
          });
        }).catch(e => {
          initLoading.dismiss();
        });
      });


    }

    //   ct_plan
    updateCtPlanTableData(list: Array<any>) {
      let resultList = [];
      let initLoading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '更新ct_meal数据中...',
      });
      initLoading.present();

      let sqlStr = getIdSet(list);

      this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list && list.map(item => {
          console.log(item);
          db.executeSql(`SELECT id FROM ct_plan WHERE id in ('${sqlStr}')`, {}).then(res => {
            if (res.rows.length) {
              for(var i = 0; i < res.rows.length; i++) {
                resultList.push(res.rows.item(i).id);
              }
            }
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                if (resultList.indexOf(item.id) > -1) {
                  tx.executeSql(UPDATE_DATA.ct_plan , [item.id, item.mealId, item.startDate, item.endDate, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.status],() =>{
                    if (index === list.length - 1) {
                      initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in update ct_plan table ,cause by: ' +  JSON.stringify(e));
                    initLoading.dismiss();
                  });
                } else {
                  tx.executeSql(INSERT_DATA.ct_plan , [item.id, item.mealId, item.startDate, item.endDate, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.status],() =>{
                    if (index === list.length - 1) {
                      initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                }
              });
            }).then(() =>{

            }).catch(e =>{
              alert('err in operate the ct_plan table cause by: ' + e.toString());
              initLoading.dismiss();
            });
          }).catch(e => {
            alert('err in select the ct_plan table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        });
      }).catch(e => {});
    }

    //   ct_plan_dtl
    updateCtPlanDtlTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM ct_plan_dtl WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.ct_plan_dtl , [item.id, item.planId, item.objType, item.objId, item.price, item.maxNum, item.chefId, item.updateDate, item.delFlag]).then(() =>{
                alert(`更新ct_plan_dtl表数据成功`);
              }).catch(e => {
                alert(`更新ct_plan_dtl表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.ct_plan_dtl , [item.id, item.planId, item.objType, item.objId, item.price, item.maxNum, item.chefId, item.updateDate, item.delFlag]).then(() =>{
                alert(`插入ct_plan_dtl表数据成功`);
              }).catch(e => {
                alert(`插入ct_plan_dtl表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   ct_product
    updateCtProductTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map((item, index) => {
          let sqlStr = `SELECT COUNT(*) AS total FROM ct_product WHERE id='${item.id}'`;
          db.executeSql(sqlStr, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.ct_product , [item.id, item.remarks, item.createBy, item.createDate, item.updateBy, item.updateDate, item.productName, item.factoryId, item.officeId, item.productType, item.price, item.imgUrl, item.isScore, item.costCredits, item.isPack, item.isHold, item.isApproval, item.summary, item.labels, item.cost, item.delFlag]).then(() =>{
                alert(`更新ct_product表数据成功`);
              }).catch(e => {
                alert(`更新ct_product表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.ct_product , [item.id, item.remarks, item.createBy, item.createDate, item.updateBy, item.updateDate, item.productName, item.factoryId, item.officeId, item.productType, item.price, item.imgUrl, item.isScore, item.costCredits, item.isPack, item.isHold, item.isApproval, item.summary, item.labels, item.cost, item.delFlag]).then(() => {
                alert(`插入ct_product表数据成功`);
              }).catch(e => {
                alert(`插入ct_product表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {
            alert('e错误-execute-' + e.toString());
          });
        });
        // this.dbObject = db;
        // this.dbObject.transaction((db: SQLiteObject) => {
        //   // alert('result==' + JSON.stringify(list[0]));
        //
        // }).catch(e => {
        //   alert('e错误-transaction--Product-' + e.toString());
        // });
      }).catch(e => {
        alert('e错误-createDB-' + e.toString());
      });
    }

    //   ct_product_dtl
    updateCtProductDtlTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM ct_product_dtl WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.ct_product_dtl , [item.id, item.productId, item.materialId, item.weight, item.updateDate, item.delFlag]).then(() =>{
                alert(`更新ct_product_dtl表数据成功`);
              }).catch(e => {
                alert(`更新ct_product_dtl表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.ct_product_dtl , [item.id, item.productId, item.materialId, item.weight, item.updateDate, item.delFlag]).then(() =>{
                alert(`插入ct_product_dtl表数据成功`);
              }).catch(e => {
                alert(`插入ct_product_dtl表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   ct_product_set
    updateCtProductSetTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM ct_product_set WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 1) {
              db.executeSql(UPDATE_DATA.ct_product_set , [item.id, item.factoryId, item.officeId, item.productSetName, item.price, item.imgUrl, item.isScore, item.costCredits, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.labels, item.isPack, item.isHold, item.isApproval, item.summary, item.cost]).then(() =>{
                alert(`更新ct_product_set表数据成功`);
              }).catch(e => {
                alert(`更新ct_product_set表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.ct_product_set , [item.id, item.factoryId, item.officeId, item.productSetName, item.price, item.imgUrl, item.isScore, item.costCredits, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.labels, item.isPack, item.isHold, item.isApproval, item.summary, item.cost]).then(() =>{
                alert(`更新ct_product_set表数据成功`);
              }).catch(e => {
                alert(`插入ct_product_set表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   ct_product_set_dtl
    updateCtProductSetDtlTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM ct_product_set_dtl WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.ct_product_set_dtl , [item.id, item.productSetId, item.productId, item.num, item.price, item.updateDate, item.delFlag]).then(() =>{
                alert(`更新ct_product_set_dtl表数据成功`);
              }).catch(e => {
                alert(`更新ct_product_set_dtl表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.ct_product_set_dtl , [item.id, item.productSetId, item.productId, item.num, item.price, item.updateDate, item.delFlag]).then(() =>{
                alert(`插入ct_product_set_dtl表数据成功`);
              }).catch(e => {
                alert(`插入ct_product_set_dtl表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   sys_dict_type
    updateSysDictTypeTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM sys_dict_type WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.sys_dict_type , [item.id, item.type, item.description, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.isSelfdom, item.isSqlite]).then(() => {
                alert(`更新sys_dict_type表数据成功`);
              }).catch(e => {
                alert(`更新sys_dict_type表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.sys_dict_type , [item.id, item.type, item.description, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.isSelfdom, item.isSqlite]).then(() =>{
                alert(`插入sys_dict_type表数据成功`);
              }).catch(e => {
                alert(`插入sys_dict_type表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   sys_dict_value
    updateSysDictValueTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM sys_dict_value WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.sys_dict_value , [item.id, item.dictTypeId, item.label, item.value, item.sort, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.officeId]).then(() =>{
                alert(`更新sys_dict_value表数据成功`);
              }).catch(e => {
                alert(`更新sys_dict_value表数据失败` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.sys_dict_value , [item.id, item.dictTypeId, item.label, item.value, item.sort, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.officeId]).then(() => {
                alert(`插入sys_dict_value表数据成功`);
              }).catch(e => {
                alert(`插入sys_dict_value表数据失败` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
        });
      }).catch(e => {});
    }

    //   sys_office
    updateSysOfficeTableData(list: Array<any>): Promise<any> {
      return  this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        list.map(item => {
          console.log(item);
          db.executeSql(`SELECT COUNT(*) AS total FROM sys_office WHERE id='${item.id}'`, {}).then(res => {
            if (res.rows.length && res.rows.item(0).total > 0) {
              db.executeSql(UPDATE_DATA.sys_office , [item.id, item.parentId2, item.parentIds, item.name, item.sort, item.areaId, item.code, item.type, item.grade, item.address, item.zipCode, item.master, item.phone, item.fax, item.email, item.useable, item.primaryPerson, item.deputyPerson,item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.delFlag]).then(() =>{
                alert(`更新sys_office表数据成功`);
              }).catch(e => {
                alert(`更新sys_office表数据失败--` + JSON.stringify(e));
              });
            } else {
              db.executeSql(INSERT_DATA.sys_office , [item.id, item.parentId2, item.parentIds, item.name, item.sort, item.areaId, item.code, item.type, item.grade, item.address, item.zipCode, item.master, item.phone, item.fax, item.email, item.useable, item.primaryPerson, item.deputyPerson,item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.delFlag]).then(() =>{
                alert(`插入sys_office表数据成功`);
              }).catch(e => {
                alert(`插入sys_office表数据失败--` + JSON.stringify(e));
              });
            }
          }).catch(e => {

          });
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
