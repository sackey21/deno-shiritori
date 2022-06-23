import { serve } from "./public/dev_deps.ts";
import { serveDir } from "./public/dev_deps.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import {cpu} from "./public/cpu.ts";
import {HiraganaCheck} from "./public/error_check.ts";
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
    

    if(!HiraganaCheck(nextWord)) {
      return new Response("ひらがなで入力してください", { status: 400 });
    }

    if (
      nextWord.length > 0 && previousWord.charAt(previousWord.length - 1). !== nextWord.charAt(0) 
    ) {
      
      return new Response("前の単語に続いていません", { status: 400 });
    }
    
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
    await cpu(nextWord,words).then((cpu_word) => {
      words.push(cpu_word);
      console.log(cpu_word);
      if ( cpu_word.charAt(cpu_word.length - 1) === 'ん' || cpu_word == null) {
        reset();
        return new Response(JSON.stringify(words), { status: 240 });
      }
      previousWord = cpu_word;
      console.log(words);
    }).catch((e) => {
      console.error(e);
      return new Response("処理に異常が発生したのでスタートに戻ります", { status: 400 })
    });

    return new Response(JSON.stringify(words));
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


function reset() : void {
  words.splice(0);
  previousWord = randomStart();
  words.push(previousWord);
}
