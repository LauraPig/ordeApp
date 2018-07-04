/**
 * Created by Jimmy on 2018/5/21.
 */


export class Utils {
  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  static getSequence = (() => {
    let sequence = 1;
    return () => {
      return ++sequence;
    };
  })();
};


// 获取对象列表中的所有ID
export  const  getIdSet =  (list: Array<any>): String => {
  let idList = [];
  if (list) {
    if (list instanceof Array && list.length > 1) {
      list.map(item =>{
        idList.push(item.id);
      });
      return idList.join(`','`);
    }
    if (list instanceof Array && list.length === 1) {
      return list[0].id.toString();
    }
    return '';
  }
  return '';
};

// 获取当天时间  返回格式YYYY-MM-DD HH:MM:SS
export const getToday = () :string =>{
  return '';
};


/**
  * 根据当前日期返回显示多少天
  *
  * @return number result
  */

export const getResult = () :number =>{
  let week = new Date().getDay();
  let result: number;
  switch (week) {
    case 0:
      result = 0;
      break;
    case 1:
      result = 7;
      break;
    case 2:
      result = 6;
      break;
    case 3:
      result = 5;
      break;
    case 4:
      result = 4;
      break;
    case 5:
      result = 3;
      break;
    case 6:
      result = 2;
      break;
    case 7:
      result = 1;
      break;
    default:
      result = 0;
      break;
  }
  return result;
};

