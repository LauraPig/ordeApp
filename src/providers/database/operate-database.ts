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
export class OperateDataBaseService {
  dbObject: SQLiteObject;
  constructor(
    private sqlite: SQLite,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public storage: Storage,
  ){
    console.log('数据库初始化');
  }







  // Ct_Material
  updateCtMaterialTableData (obj): Promise<any>{

    if (obj.ctMaterialList && obj.ctMaterialList.length > 0) {
      const list = obj.ctMaterialList;

      let sqlStr = getIdSet(list);

      return this.sqlite.create({
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
                      tx.finish();
                      // alert('Ct_Material finish');
                    }
                  }, e =>{
                    alert('eeeeee-insert-' + JSON.stringify(e));
                  });
                });
              }).then().catch(e =>{
                alert('操作CT_Material表数据失败-transaction-' + e.toString());
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
    } else {
      return Promise.resolve();
    }
  }

  //   ct_meal
  updateCtMealTableData(obj): Promise<any> {
    if (obj.ctPlanList && obj.ctPlanList.length > 0) {
      const list = obj.ctMealList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM ct_meal WHERE id in ('${sqlStr}')`,{}).then(res =>{
          // alert('res--ct_meal--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              // tx.start();
              list && list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.ct_meal, [item.id, item.factoryId, item.officeId, item.mealType, item.preHour, item.endHour, item.backHour, item.isPre, item.startTime, item.endTime, item.delFlag, item.createById, item.createDate, item.updateById, item.updateDate, item.remarks],() =>{
                  if (index === list.length - 1) {
                    // tx.finish();
                    // alert('ct_meal finish');
                  }
                }, (e) =>{
                  alert('err in insert ct_meal table cause by: ' + JSON.stringify(e));
                });
              });
            }).then(() =>{

            }).catch(e =>{
              alert('err in operate the ct_meal table cause by: ' + e.toString());
            });
          }
        }).catch(e => {
          alert('操作ct_meal表数据失败--' + JSON.stringify(e));
        });
      }).catch(e => {
        alert('操作ct_meal表数据失败--' + JSON.stringify(e));
      });
    } else {
      return Promise.resolve();
    }
  }

  //   ct_plan
  updateCtPlanTableData(obj): Promise<any>  {
    if (obj.ctPlanList && obj.ctPlanList.length > 0) {
      const list = obj.ctPlanList;
      let sqlStr = getIdSet(list);
      return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM ct_plan WHERE id in ('${sqlStr}')`,{}).then(res => {
          // alert('res--ct_plan--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.ct_plan , [item.id, item.mealId, item.startDate, item.endDate, item.delFlag, item.createById, item.createDate, item.updateById, item.updateDate, item.remarks, item.status],() =>{
                  if (index === list.length - 1) {
                    tx.finish();
                  }
                }, (e) =>{
                  alert('err in insert ct_plan table cause by: ' + JSON.stringify(e));
                });
              });
            }).then(() =>{

            }).catch(e =>{
              alert('err in operate the ct_plan table cause by: ' + e.toString());
            });
          }
        }).catch(e => {
          alert('err in select the ct_plan table cause by: ' + e.toString());
        });
      }).catch(e => {
        alert('操作ct_plan表数据失败--' + JSON.stringify(e));
      });
    } else {
      return Promise.resolve();
    }

  }

  //   ct_plan_dtl
  updateCtPlanDtlTableData(obj): Promise<any> {
    if (obj.ctPlanDtlList && obj.ctPlanDtlList.length > 0) {

      const list = obj.ctPlanDtlList;
      let sqlStr = getIdSet(list);
      return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM ct_plan_dtl WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--ct_plan_dtl--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) => {
              list.map((item, index) => {
                tx.executeSql(INSERT_DATA.ct_plan_dtl, [item.id, item.planId, item.objType, item.objId, item.price, item.maxNum, item.chefId, item.updateDate, item.delFlag], () => {
                  if (index === list.length - 1) {
                    tx.finish();
                    // initLoading.dismiss();
                  }
                }, (e) => {
                  alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e => {
              alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
        });
      }).catch(e => {
        alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
      });
    } else {
      return Promise.resolve();
    }
  }

  //   ct_product
  updateCtProductTableData(obj): Promise<any>{
    if (obj.productList && obj.productList.length > 0) {
      const list = obj.productList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM ct_product WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--ct_pro--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.ct_product , [item.id, item.productType, item.officeId, item.productName, item.price, item.imgUrl, item.isScore, item.costCredits, item.createById, item.createDate, item.updateById, item.updateDate, item.remarks, item.delFlag, item.factoryId, item.labels, item.isHold, item.isPack, item.isApproval, item.summary, item.cost],() =>{
                  if (index === list.length - 1) {
                  }
                }, (e) =>{
                  alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
        });
      }).catch(e => {
        alert('e错误-createDB-' + e.toString());
      });
    } else {
      return Promise.resolve();
    }
  }

  //   ct_product_dtl
  updateCtProductDtlTableData(obj): Promise<any> {
    if (obj.productDtlList && obj.productDtlList.length > 0) {
      const list = obj.productDtlList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
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
                    tx.finish();
                  }
                }, (e) =>{
                  alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
        });
      }).catch(e => {});
    } else {
      return Promise.resolve();
    }
  }

  //   ct_product_set
  updateCtProductSetTableData(obj): Promise<any> {
    if (obj.productSetList && obj.productSetList.length > 0) {
      const list = obj.productSetList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM ct_product_set WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--ct_pro_set--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.ct_product_set , [item.id, item.factoryId, item.officeId, item.productSetName, item.price, item.imgUrl, item.isScore, item.costCredits, item.delFlag, item.createById, item.createDate, item.updateById, item.updateDate, item.remarks, item.labels, item.isPack, item.isHold, item.isApproval, item.summary, item.cost],() =>{
                  if (index === list.length - 1) {
                    // tx.finish();
                    // initLoading.dismiss();
                  }
                }, (e) =>{
                  alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
        });
      }).catch(e => {});
    } else {
      return Promise.resolve();
    }
  }

  //   ct_product_set_dtl
  updateCtProductSetDtlTableData(obj): Promise<any>{
    if (obj.productSetDtlList && obj.productSetDtlList.length > 0) {

      const list = obj.productSetDtlList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
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
                    tx.finish();
                  }
                }, (e) =>{
                  alert('err in insert ct_plan_dtl table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate ct_plan_dtl table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate ct_plan_dtl table cause by: ' + e.toString());
        });


      }).catch(e => {});
    } else {
      return Promise.resolve();
    }
  }

  //   sys_dict_type
  updateSysDictTypeTableData(obj): Promise<any> {
    if (obj.dictTypeList && obj.dictTypeList.length > 0) {

      const list = obj.dictTypeList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM sys_dict_type WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--sys_dict_type--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.sys_dict_type , [item.id, item.type, item.description, item.createById, item.createDate, item.updateById, item.updateDate, item.delFlag, item.isSelfdom, item.isSqlite],() =>{
                  if (index === list.length - 1) {
                    tx.finish();
                  }
                }, (e) =>{
                  alert('err in insert sys_dict_type table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate sys_dict_type table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate sys_dict_type table cause by: ' + e.toString());
        });
      }).catch(e => {});
    } else {
     return Promise.resolve();
    }
  }

  //   sys_dict_value
  updateSysDictValueTableData(obj): Promise<any> {
    if (obj.dictValueList && obj.dictValueList.length > 0) {

      const list = obj.dictValueList;
      let sqlStr = getIdSet(list);
     return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM sys_dict_value WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--sys_dict_value--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.sys_dict_value , [item.id, item.dictTypeId, item.label, item.value, item.sort, item.createById, item.createDate, item.updateById, item.updateDate, item.delFlag, item.officeId],() =>{
                  if (index === list.length - 1) {
                    tx.finish();
                  }
                }, (e) =>{
                  alert('err in insert sys_dict_value table cause by: ' + JSON.stringify(e));
                });
              });
            }).catch(e =>{
              alert('err in operate sys_dict_value table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate sys_dict_value table cause by: ' + e.toString());
        });
      }).catch(e => {});
    } else {
      return Promise.resolve();
    }
  }

  //   sys_office
  updateSysOfficeTableData(obj): Promise<any> {
    if (obj.officeList && obj.officeList.length > 0) {
      const list = obj.officeList;
      let sqlStr = getIdSet(list);

      return this.sqlite.create({
        name: DATABASE_NAME,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM sys_office WHERE id in ('${sqlStr}')`, {}).then(res => {
          // alert('res--sys_office--' + JSON.stringify(res));
          if (res) {
            db.transaction((tx: SQLiteTransaction) =>{
              list.map((item, index) =>{
                tx.executeSql(INSERT_DATA.sys_office , [item.id, item.parentId2, item.parentIds, item.name, item.sort, item.areaId, item.code, item.type, item.grade, item.address, item.zipCode, item.master, item.phone, item.fax, item.email, item.useable, item.primaryPersonId, item.deputyPersonId,item.createById, item.createDate, item.updateById, item.updateDate, item.remarks, item.delFlag],() =>{
                  if (index === list.length - 1) {
                    tx.finish();
                    //  保存最新的版本号
                    if (obj.thermalDataVer) {
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
                });
              });
            }).catch(e =>{
              alert('err in operate sys_office table cause by: ' + JSON.stringify(e));
            });
          }
        }).catch(e => {
          alert('err in operate sys_office table cause by: ' + e.toString());
        });
      }).catch(e => {});
    } else {
      return Promise.resolve();
    }
  }




  openDataBase(): Promise<any> {
    return  this.sqlite.create({
      name: DATABASE_NAME,
      location: 'default'
    });
  }
}
