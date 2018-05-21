/**
 * Created by Jimmy on 2018/5/21.
 */
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
}
