import { message } from 'antd';
const version = 1.0

let curDB;

let name = '';

export function setName(n){
    name = n;
}

// 打开数据库
export function open(fn){
    const request = indexedDB.open(name, version);
    request.onerror = function (e) {
        message.warn('数据库打开出错');
    }
    request.onsuccess = function (e) {
        curDB = request.result;
        console.log('数据库打开成功');
        fn();
    }
    request.onupgradeneeded = function(e) {
        curDB = e.target.result;
        if(!curDB.objectStoreNames.contains(name)){
            curDB.createObjectStore(name, { keyPath: 'id' });
        }
    }
}

// 添加数据
function add(data) {
    if(!curDB){
        return;
    }
    if(data.plant){         // 平台客服的聊天室
        return;
    }
    var request = curDB.transaction(name, 'readwrite')
      .objectStore(name)
      .add(data);
  
    request.onsuccess = function (e) {
      console.log('数据写入成功');
    };
  
    request.onerror = function (e) {
      update(data);
    }
}

// 读取数据
function read(id, fn) {
    let transaction = curDB.transaction(name);
    let objectStore = transaction.objectStore(name);
    let request = objectStore.get(id);
 
    request.onerror = function(event) {
      console.log('事务失败');
    };
 
    request.onsuccess = function( event) {
       if (request.result) {
            fn(request.result);
       }else {
            fn(null);
       }
    };
}

// 读取所有数据
function readAll(fn) {
    let objectStore = curDB.transaction(name).objectStore(name);
    objectStore.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;
        if(cursor) {
            fn(cursor.value);
            cursor.continue();
        }else{
            fn(null);
        }
    };
}

function update(data) {
    // if(data.plant){         // 平台客服的聊天室
    //     return;
    // }
    var request = curDB.transaction(name, 'readwrite')
      .objectStore(name)
      .put(data);
  
    request.onsuccess = function (event) {
      console.log('数据更新成功');
    };
  
    request.onerror = function (event) {
      console.log('数据更新失败');
    }
}

function remove(id) {
    var request = curDB.transaction(name, 'readwrite')
      .objectStore(name)
      .delete(id);
  
    request.onsuccess = function (event) {
      console.log('数据删除成功');
    };
}

export const db = {
    add,
    read,
    readAll,
    update,
    remove
}