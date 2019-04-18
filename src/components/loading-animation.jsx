
export function Loading(bool){
    const ele = document.getElementById('Loading');
    if(!ele){
        return
    }
    const style = ele.style.display;
    ele.style.display = bool ? 'block' : 'none';
}