import {SQLite, SQLiteObject, SQLiteTransaction} from '@ionic-native/sqlite';
import { DATABASE_NAME } from '../../common/config';
import { CREATE_TABLE, INSERT_DATA, UPDATE_DATA  } from '../../common/table';
// import { mock_data } from '../../mock/mock-data';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {LoadingController, ToastController} from 'ionic-angular';
import {getIdSet} from "../../utils/index";
import {resolveTimingValue} from "@angular/animations/browser/src/util";

@Injectable()
export class DataBaseService {
    dbObject: SQLiteObject;
    constructor(
        private sqlite: SQLite,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        public storage: Storage,
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
            });
        });
    }

  // 删除数据库
  deleteDataBase(): Promise<any> {
    return this.sqlite.deleteDatabase({
      name: DATABASE_NAME,
      location: 'default'
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
                // alert('res' + JSON.stringify(res));
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


  // Ct_Material
    updateCtMaterialTableData (obj, resolve){

    const list = obj.ctMaterialList;
    let initLoading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '更新数据中...',
    });
    initLoading.present().then(() =>{
      let sqlStr = getIdSet(list);

      this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM CT_Material WHERE id in ('${sqlStr}')`, {}).then(res =>{
          // alert('res--Ct_Material--' + JSON.stringify(res));
          if (res) {
            this.openDataBase().then((db: SQLiteObject) =>{
              db.transaction((tx: SQLiteTransaction) => {
                // tx.start();
                list.map((item, index) => {
                  tx.executeSql(INSERT_DATA.CT_Material, [item.id, item.materialname, item.unit, item.exp, item.specification, item.remarks, item.isvalid, item.pinyin, item.attribute, item.imgs, item.heat, item.protein, item.fat, item.carbohydrate, item.unitg, item.materialType, item.officeId, item.updateDate, item.delFlag], () =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                        this.updateCtMealTableData(obj, initLoading, resolve);
                      // initLoading.dismiss();
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
              alert('操作CT_Material表数据失败--' + JSON.stringify(e));
            });
          }
        }).catch(e =>{
          alert('操作CT_Material表数据失败--' + JSON.stringify(e));
        });
      }).catch(e => {
        alert('操作CT_Material表数据失败');
      });
    });

  }

    //   ct_meal
    updateCtMealTableData(obj, initLoading, resolve) {
      if (obj.ctPlanList && obj.ctPlanList.length > 0) {
        const list = obj.ctMealList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_meal WHERE id in ('${sqlStr}')`,{}).then(res =>{
            // alert('res--ct_meal--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                // tx.start();
                list && list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_meal, [item.id, item.factoryId, item.officeId, item.mealType, item.preHour, item.endHour, item.backHour, item.isPre, item.startTime, item.endTime, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtPlanTableData(obj, initLoading, resolve);
                    }
                  }, (e) =>{
                    alert('err in insert ct_meal table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).then(() =>{

              }).catch(e =>{
                alert('err in operate the ct_meal table cause by: ' + e.toString());
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('操作ct_meal表数据失败--' + JSON.stringify(e));
            initLoading.dismiss();
          });
        }).catch(e => {
          alert('操作ct_meal表数据失败--' + JSON.stringify(e));
          initLoading.dismiss();
        });
      } else {
        this.updateCtPlanTableData(obj, initLoading, resolve);
      }
    }

    //   ct_plan
    updateCtPlanTableData(obj, initLoading, resolve) {
      if (obj.ctPlanList && obj.ctPlanList.length > 0) {
        const list = obj.ctPlanList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_plan WHERE id in ('${sqlStr}')`,{}).then(res => {
            // alert('res--ct_plan--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_plan , [item.id, item.mealId, item.startDate, item.endDate, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.status],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtPlanDtlTableData(obj, initLoading, resolve);
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).then(() =>{

              }).catch(e =>{
                alert('err in operate the ct_plan table cause by: ' + e.toString());
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in select the ct_plan table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {
          initLoading.dismiss();
          alert('操作ct_plan表数据失败--' + JSON.stringify(e));
        });
      } else {
        this.updateCtPlanDtlTableData(obj, initLoading, resolve);
      }

    }

    //   ct_plan_dtl
    updateCtPlanDtlTableData(obj, initLoading, resolve) {
      if (obj.ctPlanDtlList && obj.ctPlanDtlList.length > 0) {

        const list = obj.ctPlanDtlList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_plan_dtl WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--ct_plan_dtl--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_plan_dtl , [item.id, item.planId, item.objType, item.objId, item.price, item.maxNum, item.chefId, item.updateDate, item.delFlag],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtProductTableData(obj, initLoading, resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
          initLoading.dismiss();
        });
      } else {
        initLoading.dismiss();
        this.updateCtProductTableData(obj, initLoading, resolve);
      }

    }

    //   ct_product
    updateCtProductTableData(obj, initLoading, resolve) {
      if (obj.productList && obj.productList.length > 0) {
        const list = obj.productList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_product WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--ct_pro--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_product , [item.id, item.remarks, item.createBy, item.createDate, item.updateBy, item.updateDate, item.productName, item.factoryId, item.officeId, item.productType, item.price, item.imgUrl, item.isScore, item.costCredits, item.isPack, item.isHold, item.isApproval, item.summary, item.labels, item.cost, item.delFlag],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtProductDtlTableData(obj, initLoading,resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {
          alert('e错误-createDB-' + e.toString());
        });
      } else {
        this.updateCtProductDtlTableData(obj, initLoading,resolve);
      }
    }

    //   ct_product_dtl
    updateCtProductDtlTableData(obj, initLoading ,resolve) {
      if (obj.productDtlList && obj.productDtlList.length > 0) {
        const list = obj.productDtlList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_product_dtl WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--ct_pro_dtl--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_product_dtl , [item.id, item.productId, item.materialId, item.weight, item.updateDate, item.delFlag],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtProductSetTableData(obj, initLoading, resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {});
      } else {
        this.updateCtProductSetTableData(obj, initLoading, resolve);
      }
    }

    //   ct_product_set
    updateCtProductSetTableData(obj, initLoading,  resolve) {
      if (obj.productSetList && obj.productSetList.length > 0) {
        const list = obj.productSetList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_product_set WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--ct_pro_set--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_product_set , [item.id, item.factoryId, item.officeId, item.productSetName, item.price, item.imgUrl, item.isScore, item.costCredits, item.delFlag, item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.labels, item.isPack, item.isHold, item.isApproval, item.summary, item.cost],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateCtProductSetDtlTableData(obj, initLoading,resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {});
      } else {
        this.updateCtProductSetDtlTableData(obj, initLoading, resolve);
      }
    }

    //   ct_product_set_dtl
    updateCtProductSetDtlTableData(obj, initLoading, resolve){
      if (obj.productSetDtlList && obj.productSetDtlList.length > 0) {

        const list = obj.productSetDtlList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM ct_product_set_dtl WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--ct_pro_dtl_set--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.ct_product_set_dtl , [item.id, item.productSetId, item.productId, item.num, item.price, item.updateDate, item.delFlag],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateSysDictTypeTableData(obj, initLoading,  resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
            initLoading.dismiss();
          });


        }).catch(e => {});
      } else {
        this.updateSysDictTypeTableData(obj, initLoading, resolve);
        // initLoading.dismiss();
      }
    }

    //   sys_dict_type
    updateSysDictTypeTableData(obj, initLoading, resolve) {
      if (obj.dictTypeList && obj.dictTypeList.length > 0) {

        const list = obj.dictTypeList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM sys_dict_type WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--sys_dict_type--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.sys_dict_type , [item.id, item.type, item.description, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.isSelfdom, item.isSqlite],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateSysDictValueTableData(obj, initLoading,resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert sys_dict_type table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate sys_dict_type table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate sys_dict_type table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {});
      } else {
        this.updateSysDictValueTableData(obj, initLoading, resolve);
      }
    }

    //   sys_dict_value
    updateSysDictValueTableData(obj, initLoading, resolve) {
      if (obj.dictValueList && obj.dictValueList.length > 0) {

        const list = obj.dictValueList;
        let sqlStr = getIdSet(list);
        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM sys_dict_value WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--sys_dict_value--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.sys_dict_value , [item.id, item.dictTypeId, item.label, item.value, item.sort, item.createBy, item.createDate, item.updateBy, item.updateDate, item.delFlag, item.officeId],() =>{
                    if (index === list.length - 1) {
                      // tx.finish();
                      this.updateSysOfficeTableData(obj, initLoading, resolve);
                      // initLoading.dismiss();
                    }
                  }, (e) =>{
                    alert('err in insert sys_dict_value table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate sys_dict_value table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate sys_dict_value table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {});
      } else {
        this.updateSysOfficeTableData(obj, initLoading , resolve);
      }
    }

    //   sys_office
    updateSysOfficeTableData(obj, initLoading, resolve) {
      if (obj.officeList && obj.officeList.length > 0) {
        const list = obj.officeList;
        let sqlStr = getIdSet(list);

        this.sqlite.create({
          name: DATABASE_NAME,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`DELETE FROM sys_office WHERE id in ('${sqlStr}')`, {}).then(res => {
            // alert('res--sys_office--' + JSON.stringify(res));
            if (res) {
              db.transaction((tx: SQLiteTransaction) =>{
                list.map((item, index) =>{
                  tx.executeSql(INSERT_DATA.sys_office , [item.id, item.parentId2, item.parentIds, item.name, item.sort, item.areaId, item.code, item.type, item.grade, item.address, item.zipCode, item.master, item.phone, item.fax, item.email, item.useable, item.primaryPerson, item.deputyPerson,item.createBy, item.createDate, item.updateBy, item.updateDate, item.remarks, item.delFlag],() =>{
                    if (index === list.length - 1) {
                      tx.finish();
                      initLoading.dismiss();
                      //  保存最新的版本号
                      if (obj.thermalDataVer) {
                        resolve(true);
                        // alert('设置缓存hotVersion--' + temData.thermalDataVer);
                        this.storage.set('hotVersion', obj.thermalDataVer);
                      }

                      //
                      if (obj.coldDataVer) {
                        // alert('设置缓存coldVersion--' + temData.coldDataVer);
                        this.storage.set('coldVersion', obj.coldDataVer);
                      }

                    }
                  }, (e) =>{
                    alert('err in insert sys_office table cause by: ' + JSON.stringify(e));
                    initLoading.dismiss();
                  });
                });
              }).catch(e =>{
                alert('err in operate sys_office table cause by: ' + JSON.stringify(e));
                initLoading.dismiss();
              });
            }
          }).catch(e => {
            alert('err in operate sys_office table cause by: ' + e.toString());
            initLoading.dismiss();
          });
        }).catch(e => {});
      } else {
        initLoading.dismiss();
      }
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
