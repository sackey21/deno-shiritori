import { serve } from "./public/dev_deps.ts";
import { serveDir } from "./public/dev_deps.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import {cpu} from "./public/cpu.ts";
import {HiraganaCheck, judgeWord} from "./public/word_check.ts";
let words = new Array<string>();
let previousWord = randomStart();
console.log("Listening on http://localhost:8000");

serve(async (req) => {
  const pathname = new URL(req.url).pathname

  if (req.method === "GET" && pathname === "/shiritori") {
    reset();
    return new Response(JSON.stringify(words));
  }

  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;
    let lose = false;

    previousWord = deleteLastMark(previousWord);

    if(!HiraganaCheck(nextWord)) {
      return new Response("ひらがなで入力してください", { status: 400 });
    }

    if (!judgeWord(nextWord, previousWord)) {
      
      return new Response("前の単語に続いていません", { status: 400 });
    }
    
    previousWord = deleteLastMark(previousWord);
    if(
      nextWord.charAt(nextWord.length - 1) < 12343 || nextWord.charAt(nextWord.length - 1) > 12438 
    ){
      return new Response("最後はひらがなが続くようにしてください",{status: 400});
    }

    if (nextWord.length < 0 ) {
      return new Response("入力してください", { status: 400 });
    }

    if(words.includes(nextWord)){
      return new Response("同じ単語は使えません", { status: 400 });
    }

    //終了時，最初の単語で初期化
    if ( nextWord.charAt(nextWord.length - 1) === 'ん' ) {
      reset();
      return new Response(JSON.stringify(words), { status: 220 });
    }

    words.push(nextWord);
    deleteLastMark(nextWord);
    await cpu(nextWord,words).then((cpu_word) => {
      words.push(cpu_word);
      if (cpu_word.charAt(cpu_word.length - 1) === 'ん' || cpu_word == "") {
        lose = true;
        //return返ってくれないので強引に返すんですけど，原因究明しないといけない
      }
      previousWord = cpu_word;
    }).catch((e) => {
      console.error(e);
      return new Response("処理に異常が発生したのでスタートに戻ります", { status: 400 })
    });
    if(lose){
      reset();
      return new Response(JSON.stringify(words), { status: 240 });
    }
    else return new Response(JSON.stringify(words));
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});

function randomStart() : string{
  const str = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
  let num = Math.floor(Math.random() * str.length);
  let previousWord = str.charAt(num);
  return previousWord;
}

function deleteLastMark(word : string) : string { //末尾がーのときはそれを除外して判定
  while(word.charCodeAt(previousWord.length - 1) === 12540){
    word.slice(0,-1);
  }
  return word;
}

function reset() : void {
  words.splice(0);
  previousWord = randomStart();
  words.push(previousWord);
}
