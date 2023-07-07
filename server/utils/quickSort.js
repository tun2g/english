function quickSort(arr,property) {
    const stack = [];
    //  4 7 2 8 6 7
    stack.push(0); 
    stack.push(arr.length - 1); 
    // index: 0 5
    while (stack.length > 0) {
      const end = stack.pop(); //index: 5
      const start = stack.pop(); //index: 0
  
      const pivotIndex = partition(arr, start, end,property); 
      // -> pivot =3
      // arr: 4 5 6 7 8 7

      if (pivotIndex - 1 > start) {
        stack.push(start); 
        stack.push(pivotIndex - 1); 
      }
      // mảng trái [4 5 6]
  
      if (pivotIndex + 1 < end) {
        stack.push(pivotIndex + 1); 
        stack.push(end);
      }
      // mảng phải [ 8 7]

      // vòng while xử lý mảng trái, mảng trái tương tự mảng chính
    }
  
    return arr;
  }
  
  function partition(arr, start, end,property) {

    // 4   7   2   8   6   7
    //     s           e
    //     pI          p
    //  -> 2  6  8 7 
    //    <p  p  >p 
    // kết quả: chia 2 nửa, bên < p và 1 bên > p 
    const pivot = arr[end]; 
    let pivotIndex = start;
  
    for (let i = start; i < end; i++) {
      if (pivot[property] > arr[i][property]) {
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        pivotIndex++;
      }
    }
  
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  
    return pivotIndex;
  }


  module.exports = quickSort