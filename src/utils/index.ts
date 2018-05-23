/**
 * Created by Jimmy on 2018/5/21.
 */

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

