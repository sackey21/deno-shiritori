//ひらがなか確認(途中ののばし棒は許容)
export function HiraganaCheck(str: string) : boolean {
    let ch: number;
    for(let i = 0; i < str.length; i++){
      ch = str.charCodeAt(i);
      if(ch < 12343 || ch > 12438 ){

        //ーは許容
        if(ch == 12540){
          continue;
        }
        return false;
      }

      //ゐ，ゑは現代仮名遣いに入らないので除外
      if(ch == 12432 || ch == 12433 ) return false;
    }
  
    return true;
  }

  export function lastCharacterCheck(str: string): boolean{
    const lastCharCode = str.charCodeAt(str.length - 1);
    return (lastCharCode > 12342 && lastCharCode < 12439 );
  }

  //最終の文字が濁点とか小文字とかでも対応するようにする
  //return true: いける　false:だめ
  //基本ぁから文字コード2連続で対応可能，っつづとな行ま行ら行(濁点小文字共になし)，は行(はばぱ)，を辺りがややこい
export function judgeWord(nextWord : string, previousWord : string) : boolean{

  const previousLastCharCode = previousWord.charCodeAt(previousWord.length -1);//最後の文字
  const nextFirstCharCode = nextWord.charCodeAt(0);

  //"っつづ"
  if(previousLastCharCode >= 12387 && previousLastCharCode <= 12389){
    return nextFirstCharCode >= 12387 && nextFirstCharCode <= 12389;
  }
  //なまら行とをの判定　な：12394 ま：12414　ら：12425　を：12434
  const uniqueCodeLineHead = [12394, 12414, 12425, 12431];
  for(let i=0;i<uniqueCodeLineHead.length-1;i++){//なまら
    for(let j=0; j<5;j++){

      if(previousLastCharCode === uniqueCodeLineHead[i] + j){
        return nextFirstCharCode === uniqueCodeLineHead[i] + j;
      }
    }
    //を
    if(previousLastCharCode === uniqueCodeLineHead[3]){
      return nextFirstCharCode === uniqueCodeLineHead[3];
    }
  }

  //は行の判定
  //は->12399 ぽ->12413
  for(let i=12399;i<12414;i+=3){
    if(previousLastCharCode >= i && previousLastCharCode <= i + 2){
      return (nextFirstCharCode >= i && nextFirstCharCode <= i + 2);
    }
  }
  //その他行とゎわ

  //な行ま行ら行は行をん過ぎた後次の行の先頭に飛べるようにする
  //ぁてゃゎ　終了はわ　12431
  const wordHeads = [12353, 12390, 12419, 12430];
  for(let i=0;i<wordHeads.length;i++){
    for(let j=wordHeads[0];j<12431;j+=2){
      if(j < wordHeads[i]){
        j = wordHeads[i];
        break;
      } 
      if(previousLastCharCode === j || previousLastCharCode=== j+1){
        return (nextFirstCharCode === j || nextFirstCharCode === j + 1);
      }
    }
  }
  return false;
}
