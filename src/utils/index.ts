import * as moment from 'moment';
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

  static getFileName = (() => {
    return ()=>{
      return moment().format('x');
    };
  })();
};

const sourceStr = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const UUIDHelper = {
  generateUUID (length = 8){
    const uuidStrings = [];
    while ( length--) {
      const digit = Math.floor(Math.random() * (sourceStr.length - 1));
      uuidStrings.push(sourceStr.charAt(digit));
    }
    return uuidStrings.join('');
  },
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

// 获取当天时间  返回格式YYYY-MM-DD HH:mm:ss
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

/**
 * 获取当前日期所在月份的开头和结尾日期
 * @params month string
 * @return [startTime, endTime]
 *
 */

export const getCurrentMonth = (month?: string) => {
  if (!month) {
    return null;
  }
  let date = new Date();
  let year = date.getFullYear();
  let temStr = moment(`${year}-${month}-01`).format('YYYY-MM-DD');
  let startTime = `${temStr} 00:00:00`;
  let endTime = `${moment(`${year}-${month}`).endOf('month').format("YYYY-MM-DD")} 23:59:59`;
  return [startTime, endTime];
};


