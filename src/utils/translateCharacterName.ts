// translateCharacterName.ts

// 英語名と日本語名の対応表
export const characterTranslations: { [key: string]: string } = {
  mario: "マリオ",
  donkey_kong: "ドンキーコング",
  link: "リンク",
  samus: "サムス",
  dark_samus: "ダークサムス",
  yoshi: "ヨッシー",
  kirby: "カービィ",
  fox: "フォックス",
  pikachu: "ピカチュウ",
  luigi: "ルイージ",
  ness: "ネス",
  captain_falcon: "キャプテン・ファルコン",
  jigglypuff: "プリン",
  peach: "ピーチ",
  daisy: "デイジー",
  bowser: "クッパ",
  ice_climber: "アイスクライマー",
  sheik: "シーク",
  zelda: "ゼルダ",
  dr_mario: "ドクターマリオ",
  pichu: "ピチュー",
  falco: "ファルコ",
  marth: "マルス",
  lucina: "ルキナ",
  young_link: "こどもリンク",
  ganondorf: "ガノンドロフ",
  mewtwo: "ミュウツー",
  roy: "ロイ",
  chrom: "クロム",
  mr_game_and_watch: "Mr.ゲーム&ウォッチ",
  metaknight: "メタナイト",
  pit: "ピット",
  dark_pit: "ブラックピット",
  zero_suit_samus: "ゼロスーツサムス",
  wario: "ワリオ",
  snake: "スネーク",
  ike: "アイク",
  pokemon_trainer: "ポケモントレーナー",
  diddy_kong: "ディディーコング",
  lucas: "リュカ",
  sonic: "ソニック",
  king_dedede: "デデデ",
  olimar: "ピクミン&オリマー",
  lucario: "ルカリオ",
  rob: "ロボット",
  toon_link: "トゥーンリンク",
  wolf: "ウルフ",
  villager: "むらびと",
  megaman: "ロックマン",
  wii_fit_trainer: "Wii Fit トレーナー",
  rosalina_luma: "ロゼッタ&チコ",
  little_mac: "リトル・マック",
  greninja: "ゲッコウガ",
  mii_brawler: "Miiファイター（格闘タイプ）",
  mii_swordfighter: "Miiファイター（剣術タイプ）",
  mii_gunner: "Miiファイター（射撃タイプ）",
  palutena: "パルテナ",
  pacman: "パックマン",
  robin: "ルフレ",
  shulk: "シュルク",
  bowser_jr: "クッパJr.",
  duck_hunt: "ダックハント",
  ryu: "リュウ",
  ken: "ケン",
  cloud: "クラウド",
  corrin: "カムイ",
  bayonetta: "ベヨネッタ",
  inkling: "インクリング",
  ridley: "リドリー",
  simon: "シモン",
  richter: "リヒター",
  king_k_rool: "キングクルール",
  isabelle: "しずえ",
  incineroar: "ガオガエン",
  piranha_plant: "パックンフラワー",
  joker: "ジョーカー",
  hero: "勇者",
  banjo_and_kazooie: "バンジョー&カズーイ",
  terry: "テリー",
  byleth: "ベレト/ベレス",
  minmin: "ミェンミェン",
  steve: "スティーブ",
  sephiroth: "セフィロス",
  homura: "ホムラ/ヒカリ",
  kazuya: "カズヤ",
  sora: "ソラ",
};

// 英語名を日本語に変換する関数
export const translateCharacterName = (englishName: string): string => {
  return characterTranslations[englishName] || englishName;
};
