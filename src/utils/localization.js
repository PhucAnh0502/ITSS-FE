/**
 * Japanese localization constants for the HUST Workspace Finder application.
 * All user-facing text is centralized here for consistency and maintainability.
 */
export const LOCALIZATION = {
  // Navigation
  nav: {
    explore: '探索',
    recommend: 'おすすめ',
    community: 'コミュニティ',
    profile: 'プロフィール',
  },
  // Buttons
  buttons: {
    reserve: '予約する',
    getDirections: '道順を取得',
    helpful: '役に立った',
    writeReview: 'レビューを書く',
    search: 'スペースを検索',
    clear: 'クリア',
    filter: 'フィルター',
  },
  // Placeholders
  placeholders: {
    search: '理想の学習スペースを探す...',
  },
  // Error messages
  errors: {
    workspaceLoadFailed: 'ワークスペースデータを取得できませんでした',
    reviewLoadFailed: 'レビューを読み込めませんでした',
    notFound: '見つかりません',
    workspaceNotFound: 'ワークスペースが見つかりません',
  },
  // Empty states
  empty: {
    noWorkspaces: '条件に一致するワークスペースが見つかりません',
    noRecommendations: '条件に一致する結果がありません。条件を変更してください',
    noReviews: 'レビューが見つかりません',
  },
  // Filter labels
  filters: {
    title: 'フィルター',
    availability: '空き状況',
    available: '空席あり',
    busy: '満席',
    quietness: '静かさ',
    wifi: 'Wi-Fi',
    wifiAvailable: 'Wi-Fiあり',
    power: '電源',
    powerAvailable: '電源あり',
    distance: '距離',
    nearHust: 'HUST周辺',
    people: '人数',
  },
  // Status labels
  status: {
    available: '空席あり',
    busy: '満席',
    closed: '閉店',
    open: '営業中',
  },
  // Section headings
  headings: {
    searchSpaces: 'スペースを探す',
    smartSearch: 'スマート検索',
    smartSearchSubtitle: 'いくつかの質問に答えて、最適なスペースを見つけましょう',
    communityReviews: 'HUSTコミュニティ',
    communitySubtitle: '仲間の学生からのリアルな口コミで、最高のスポットを見つけよう。',
    amenities: '設備・アメニティ',
    results: 'おすすめトップ3',
  },
  // Categories
  categories: {
    cafe: 'カフェ',
    library: '図書館',
    coworking: 'コワーキング',
    studyRoom: '自習室',
  },
  // Review categories
  reviewCategories: {
    all: 'すべて',
    nearHust: 'HUST周辺',
    cafe: 'カフェ',
    dormitory: '寮',
    groupActivity: 'グループ活動',
  },
  // Smart search
  smartSearch: {
    people: '何人で利用しますか？',
    purpose: '利用目的は？',
    quietness: '静かさのレベルは？',
    amenities: '必要な設備は？',
    lively: 'にぎやか',
    quiet: '静か',
    studyAlone: '一人勉強',
    groupWork: 'グループワーク',
    meeting: 'ミーティング',
  },
  // Amenity labels
  amenityLabels: {
    wifi: 'Wi-Fi',
    power: '電源',
    ac: 'エアコン',
    projector: 'プロジェクター',
    parking: '駐車場',
    food: '飲食可',
    manyOutlets: '電源多数',
    nearOutlet: '電源近い',
  },
  // Accessibility labels
  aria: {
    mainNavigation: 'メインナビゲーション',
    filterRegion: 'フィルター',
    search: '検索',
    notification: '通知',
    profile: 'プロフィール',
  },
  // Misc
  misc: {
    loading: '読み込み中...',
    seeAll: 'すべて見る',
    reservationComplete: '予約が完了しました！',
    close: '閉じる',
    today: '本日',
    closedToday: '本日休業',
    noInfo: '情報なし',
    noReviewsYet: 'まだレビューがありません',
    reservationConfirm: '予約確認',
    comments: 'コメント',
  },
};

export default LOCALIZATION;
