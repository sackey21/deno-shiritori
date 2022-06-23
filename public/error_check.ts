//ひらがなか確認(途中ののばし棒は許容)
export function HiraganaCheck(str: string) : boolean {
    let ch: number;
    for(let i = 0; i < str.length; i++){
      ch = str.charCodeAt(i);
      if(ch < 12343 || ch > 12438 ){
        //ー
        if(ch == 12540){
          continue;
        }
        return false;
      }
    }
  
    return true;
  }


  export function lastCharacterCheck(str: string): boolean{
    const lastCharCode = str.charCodeAt(str.length - 1);
    return (lastCharCode > 12342 && lastCharCode < 12439 );
  }