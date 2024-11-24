import React from "react";

const Info = () => {
  return (
    <div className="flex flex-col text-[#333] p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
      <h1 className="text-2xl mb-4">利用規約</h1>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="font-bold mb-2 text-lg">個人情報の利用目的</h2>
        <p>
          当サイトでは、お問い合わせの際、名前やメールアドレス等の個人情報を入力いただく場合がございます。取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
        </p>
      </div>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="font-bold mb-2 text-lg">広告について</h2>
        <p>
          当サイトでは、第三者配信の広告サービス（Googleアドセンス）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。Cookieを無効にする方法やGoogleアドセンスに関する詳細は{" "}
          <a href="https://policies.google.com/technologies/ads?gl=jp">
            「広告 – ポリシーと規約 – Google」
          </a>
          をご確認ください。
        </p>
      </div>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="font-bold mb-2 text-lg">アクセス解析ツールについて</h2>
        <p>
          当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
        </p>
      </div>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="font-bold mb-2 text-lg">免責事項</h2>
        <p>
          当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
        </p>
      </div>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="font-bold mb-2 text-lg">著作権について</h2>
        <p>
          当サイトで掲載している文章や画像などにつきましては、無断転載することを禁止します。当サイトは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、
          <a href="/form" className="underline">お問い合わせフォーム</a>
          よりご連絡ください。迅速に対応いたします。
        </p>
      </div>
    </div>
  );
};

export default Info;
