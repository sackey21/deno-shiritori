import { readLines } from './dev_deps.ts';
import { HiraganaCheck, judgeWord } from "./word_check.ts";
  //ユーザと違って開始に濁点とかを選ぶのができないので，負けやすい
  //伸ばし棒とか濁点とかでつなげられるとほぼ負ける

export async function cpu(previousWord:string, words : Array<string>){
  //previousWordは伸ばし棒除外済み，wordsは表示そのまま．
  //previousWord->前文字判定用，wordsは重複確認用．
    const file = await Deno.open("./public/words.csv", {read: true});
    let nextWord = "";
    //被り制限
    TimeRanges : for await (let line of readLines(file, {encoding: 'shift-JIS'})) {
      if(judgeWord(line, previousWord)) {
        //配列成形
        const words_list = line.split(",");
        words_list.filter(item => !item.match(""));
        do{
          //ランダム選択
          let word_select = Math.floor(Math.random() * words.length);
          nextWord = words_list[word_select];
          break TimeRanges;
        }while(words.includes(nextWord) && HiraganaCheck(nextWord))
      } 
    }
    // ファイルを閉じる
    Deno.close(file.rid);

    return nextWord;
}
