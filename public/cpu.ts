import { readLines } from './dev_deps.ts';
import { HiraganaCheck, lastCharacterCheck} from "./error_check.ts";

// ファイルオープン
export async function cpu(previousWord : string, words : Array<string>){

    const file = await Deno.open("./public/words.csv", {read: true});
    let nextword = words[words.length - 1];

    //被り制限
    while(words.includes(nextword) && HiraganaCheck(nextword)){
      let count = 0;
    for await (let line of readLines(file, {encoding: 'shift-JIS'})) {
          
          if(line[0] == previousWord[previousWord.length - 1]){
            const words_list = line.split(",");
            console.log(words_list);
            words_list.filter(item => !item.match(""));
            console.log(words_list.length);
            //ランダム選択
            let word_select = Math.floor(Math.random() * words.length);

            nextword = words_list[word_select];
            console.log(nextword.charCodeAt(0));
            break;
          }
      }
    }
    // ファイルを閉じる
    Deno.close(file.rid);

    //最後がのばし棒のとき->最終文字を削除
    if(!lastCharacterCheck(nextword)){
      nextword.slice( 0, -1 ) ;
    }
    return nextword;
}
