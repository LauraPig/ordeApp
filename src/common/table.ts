/**
 * Author：Jimmy Liang
 * Date: 2018-9-14
 * 数据库操作语句，如果表结构变化，需要修改创建以及插入，update语句目前没有用
 * **/
// 创建数据库表
export const CREATE_TABLE = {
    CT_Material: `CREATE TABLE IF NOT EXISTS CT_Material(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [MaterialName] nvarchar(200) NOT NULL ,
        [Unit] nvarchar(10) NOT NULL ,
        [EXP] float(53) NOT NULL DEFAULT ((1)) ,
        [Specification] nvarchar(50) NULL ,
        [Remarks] nvarchar(200) NULL ,
        [IsValid] bit NOT NULL DEFAULT ((1)) ,
        [Pinyin] nvarchar(50) NOT NULL DEFAULT '' ,
        [Attribute] nvarchar(50) NULL ,
        [Imgs] nvarchar(200) NULL ,
        [heat] decimal(18,2) NULL ,
        [protein] decimal(18,2) NULL ,
        [fat] decimal(18,2) NULL ,
        [carbohydrate] decimal(18,2) NULL ,
        [material_type] varchar(100) NULL ,
        [office_id] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0))
    )`,
    ct_meal: `CREATE TABLE IF NOT EXISTS ct_meal(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [factory_id] varchar(64) NULL ,
        [office_id] varchar(64) NULL ,
        [meal_type] varchar(64) NULL ,
        [pre_hour] decimal(5,2) NULL ,
        [end_hour] decimal(5,2) NULL ,
        [back_hour] decimal(5,2) NULL ,
        [is_pre] varchar(1) NULL DEFAULT ((0)) ,
        [start_time] datetime2(7) NULL ,
        [end_time] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0)) ,
        [create_by] varchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [remarks] varchar(200) NULL
    )`,
    ct_plan: `CREATE TABLE IF NOT EXISTS ct_plan(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [meal_id] varchar(64) NULL ,
        [start_date] datetime2(7) NULL ,
        [end_date] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0)) ,
        [create_by] varchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [remarks] varchar(200) NULL ,
        [status] varchar(1) NULL DEFAULT ((0))
    )`,
    ct_plan_dtl: `CREATE TABLE IF NOT EXISTS ct_plan_dtl(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [plan_id] varchar(64) NULL ,
        [obj_type] varchar(1) NULL ,
        [obj_id] varchar(64) NULL ,
        [price] decimal(8,2) NULL ,
        [max_num] int NULL ,
        [chef_id] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0)) 
    )`,
    ct_product: `CREATE TABLE IF NOT EXISTS ct_product(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [product_type] varchar(64) NULL ,
        [office_id] varchar(64) NULL ,
        [product_name] nvarchar(100) NULL ,
        [price] decimal(18,2) NULL DEFAULT ((0.00)) ,
        [img_url] varchar(1000) NULL ,
        [is_score] varchar(64) NULL DEFAULT ((0)) ,
        [cost_credits] decimal(18,2) NULL ,
        [create_by] varchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [remarks] nvarchar(255) NULL ,
        [del_flag] char(1) NULL DEFAULT ((0)) ,
        [factory_id] varchar(64) NULL ,
        [labels] varchar(1000) NULL ,
        [is_hold] varchar(1) NULL DEFAULT ((0)) ,
        [is_pack] varchar(1) NULL DEFAULT ((0)) ,
        [is_approval] varchar(1) NULL DEFAULT ((0)) ,
        [summary] text NULL ,
        [cost] decimal(18,2) NULL DEFAULT ((0.00)),
        [blob_path] varchar(1000) NULL
    )`,
    ct_product_dtl: `CREATE TABLE IF NOT EXISTS ct_product_dtl(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [product_id] varchar(64) NULL ,
        [material_id] varchar(64) NULL ,
        [weight] decimal(18,2) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0)) 
    )`,
    ct_product_set: `CREATE TABLE IF NOT EXISTS ct_product_set(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [factory_id] varchar(64) NULL ,
        [office_id] varchar(64) NULL ,
        [product_set_name] varchar(100) NULL ,
        [price] decimal(18,2) NULL DEFAULT ((0.00)) ,
        [img_url] varchar(500) NULL ,
        [is_score] varchar(1) NULL DEFAULT ((0)) ,
        [cost_credits] decimal(8,2) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0)) ,
        [create_by] varchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [remarks] varchar(200) NULL ,
        [labels] varchar(1000) NULL ,
        [is_pack] varchar(1) NULL DEFAULT ((0)) ,
        [is_hold] varchar(1) NULL DEFAULT ((0)) ,
        [is_approval] varchar(1) NULL DEFAULT ((0)) ,
        [summary] text NULL ,
        [cost] decimal(18,2) NULL DEFAULT ((0.00)),
        [blob_path] varchar(1000) NULL
    )`,
    ct_product_set_dtl: `CREATE TABLE IF NOT EXISTS ct_product_set_dtl(
        [id] varchar(64) PRIMARY KEY NOT NULL ,
        [product_set_id] varchar(64) NULL ,
        [product_id] varchar(64) NULL ,
        [num] int NULL ,
        [price] decimal(8,2) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] varchar(1) NULL DEFAULT ((0))
    )`,
    sys_dict_type: `CREATE TABLE IF NOT EXISTS sys_dict_type(
        [id] varchar(64) PRIMARY KEY NULL ,
        [type] varchar(64) NULL ,
        [description] nvarchar(64) NULL ,
        [create_by] varchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] varchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] varchar(64) NULL ,
        [is_selfdom] varchar(64) NULL DEFAULT ((0)) ,
        [is_sqlite] varchar(1) NULL DEFAULT ((0)) 
    )`,
    sys_dict_value: `CREATE TABLE IF NOT EXISTS sys_dict_value(
        [id] nvarchar(64) PRIMARY KEY NULL ,
        [dict_type_id] nvarchar(64) NULL ,
        [label] nvarchar(128) NULL ,
        [value] nvarchar(128) NULL ,
        [sort] nvarchar(64) NULL ,
        [create_by] nvarchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] nvarchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [del_flag] nvarchar(64) NULL ,
        [office_id] varchar(64) NULL DEFAULT '' 
    )`,
    sys_office: `CREATE TABLE IF NOT EXISTS sys_office(
        [id] varchar(64) PRIMARY KEY NULL ,
        [parent_id] varchar(64) NULL ,
        [parent_ids] varchar(2000) NULL ,
        [name] nvarchar(100) NULL ,
        [sort] numeric(10) NULL ,
        [area_id] varchar(64) NULL ,
        [code] nvarchar(100) NULL ,
        [type] char(1) NULL ,
        [grade] nchar(1) NULL ,
        [address] nvarchar(255) NULL ,
        [zip_code] nvarchar(100) NULL ,
        [master] nvarchar(100) NULL ,
        [phone] nvarchar(200) NULL ,
        [fax] nvarchar(200) NULL ,
        [email] nvarchar(200) NULL ,
        [USEABLE] nvarchar(64) NULL ,
        [PRIMARY_PERSON] nvarchar(64) NULL ,
        [DEPUTY_PERSON] nvarchar(64) NULL ,
        [create_by] nvarchar(64) NULL ,
        [create_date] datetime2(7) NULL ,
        [update_by] nvarchar(64) NULL ,
        [update_date] datetime2(7) NULL ,
        [remarks] nvarchar(255) NULL ,
        [del_flag] char(1) NULL 
    )`,
};

// 插入表数据
export  const INSERT_DATA = {
    CT_Material: `INSERT INTO CT_Material VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, //19

    ct_meal: `INSERT INTO ct_meal VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, //16

    ct_plan: `INSERT INTO ct_plan (id,meal_id,start_date,end_date,del_flag,create_by,create_date,update_by,update_date,remarks,status) VALUES(?,?,?,?,?,?,?,?,?,?,?)`, // 11

    ct_plan_dtl: `INSERT INTO ct_plan_dtl VALUES(?,?,?,?,?,?,?,?,?)`, // 9

    ct_product: `INSERT INTO ct_product VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, //21

    ct_product_dtl: `INSERT INTO ct_product_dtl VALUES(?,?,?,?,?,?)`, //6

    ct_product_set: `INSERT INTO ct_product_set VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, //20

    ct_product_set_dtl: `INSERT INTO ct_product_set_dtl VALUES(?,?,?,?,?,?,?)`, // 7

    sys_dict_type: `INSERT INTO sys_dict_type VALUES(?,?,?,?,?,?,?,?,?,?)`, //10

    sys_dict_value: `INSERT INTO sys_dict_value VALUES(?,?,?,?,?,?,?,?,?,?,?)`, //11

    sys_office: `INSERT INTO sys_office VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
};


// 更新表数据，目前没有用到，可以尝试删除
export const UPDATE_DATA = {
    CT_Material: `UPDATE CT_Material SET id=?, MaterialName=?, Unit=?, EXP=?, Specification=?, Remarks=?, IsValid=?, Pinyin=?, Attribute=?, Imgs=?, heat=?, protein=?, fat=?, carbohydrate=?, material_type=?, office_id=?, update_date=?, del_flag=?`,

    ct_meal: `UPDATE ct_meal SET id=?, factory_id=?, office_id=?, meal_type=?, pre_hour=?, end_hour=?, back_hour=?, is_pre=?, start_time=?, end_time=?, del_flag=?, create_by=?, create_date=?, update_by=?, update_date=?, remarks=?`,

    ct_plan: `UPDATE ct_plan SET id=?, meal_id=?, start_date=?, end_date=?, del_flag=?, create_by=?, create_date=?, update_by=?, update_date=?, remarks=?, status=?`,

    ct_plan_dtl: `UPDATE ct_plan_dtl SET id=?, plan_id=?, obj_type=?, obj_id=?, price=?, max_num=?, chef_id=?, update_date=?, del_flag=?`,

    ct_product: `UPDATE ct_product SET id=?, remarks=?, create_by=?, create_date=?, update_by=?, update_date=?, product_name=?, factory_id=?, office_id=?, product_type=?,  price=?, img_url=?, is_score=?, cost_credits=?, is_pack=?, is_hold=?, is_approval=?, summary=?, labels=?, cost=?, del_flag=?`,

    ct_product_dtl: `UPDATE ct_product_dtl SET id=?, product_id=?, material_id=?, weight=?, update_date=?, del_flag=?`,

    ct_product_set: `UPDATE ct_product_set SET id=?, factory_id=?, office_id=?, product_set_name=?, price=?, img_url=?, is_score=?, cost_credits=?, del_flag=?, create_by=?, create_date=?, update_by=?, update_date=?, remarks=?, labels=?, is_pack=?, is_hold=?, is_approval=?, summary=?, cost=?`,

    ct_product_set_dtl: `UPDATE ct_product_set_dtl SET id=?, product_set_id=?, product_id=?, num=?, price=?, update_date=?, del_flag=?`,

    sys_dict_type: `UPDATE sys_dict_type SET id=?, type=?, description=?, create_by=?, create_date=?, update_by=?, update_date=?, del_flag=?, is_selfdom=?, is_sqlite=?`,

    sys_dict_value: `UPDATE sys_dict_value SET id=?, dict_type_id=?, label=?, value=?, sort=?, create_by=?, create_date=?, update_by=?, update_date=?, del_flag=?, office_id=?`,

    sys_office: `UPDATE sys_office SET id=?, parent_id=?, parent_ids=?, name=?, sort=?, area_id=?, code=?, type=?, grade=?, address=?,  zip_code=?, master=?, phone=?, fax=?, email=?, USEABLE=?, PRIMARY_PERSON=?, DEPUTY_PERSON=?, create_by=?, create_date=?, update_by=?, update_date=?, remarks=?, del_flag=?`,
};
