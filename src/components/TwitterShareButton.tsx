import { useEffect } from "react";

type TwitterShareButtonProps = {
    index:number;
    count:number;
}

function TwitterShareButton({index,count}:TwitterShareButtonProps) {
  useEffect(() => {
    // Twitterのスクリプトを動的にロード
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.charset = "utf-8";
    script.async = true;
    document.body.appendChild(script);

    // コンポーネントのアンマウント時にスクリプトを削除することで、リソースをクリーンアップ
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a href={`https://twitter.com/intent/tweet?&text=%23SmashRank%0a${count}人中${index}位きちゃ%0a%0a&url=https://smash-rank.com/`} className="twitter-share-button" data-url="https://smash-rank.com/" data-show-count="true" data-size="medium">
        
    </a>
  );
}

export default TwitterShareButton;

