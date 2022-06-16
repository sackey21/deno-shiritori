import { serve } from "./public/dev_deps.ts";
import { serveDir } from "./public/dev_deps.ts";


let previousWord = randomStart();
console.log("Listening on http://localhost:8000");

serve(async (req) => {
  const pathname = new URL(req.url).pathname
  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }
  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    if(!HiraganaCheck(nextWord)) {
      return new Response("ひらがなで入力してください", { status: 400 });
    }

    if (
      nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    ) {
      return new Response("前の単語に続いていません", { status: 400 });
    }
    
    //終了時，最初の単語で初期化
    if ( nextWord.charAt(nextWord.length - 1) === 'ん' ) {
      previousWord = randomStart();
      return new Response(previousWord);
    }
    
    previousWord = nextWord;
    return new Response(previousWord);

  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});

function randomStart(){
  const str = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
  let num = Math.floor(Math.random() * str.length); + 1;
  let previousWord = str.charAt(num);
  return previousWord;
}

function HiraganaCheck(str: string){
  let ch: number;
  for(let i = 0; i < str.length; i++){
    ch = str.charCodeAt(i);

    if(ch < 12343 || ch > 12438){
      return false;
    }
  }
  return true;
}