import cardInk from "@/assets/card-ink.jpg";
import cardChicken from "@/assets/card-chicken.jpg";
import cardDog from "@/assets/card-dog.jpg";
import cardBasketball from "@/assets/card-basketball.jpg";
import cardDance from "@/assets/card-dance.jpg";
import cardSlam from "@/assets/card-slam.jpg";
import cardStage from "@/assets/card-stage.jpg";
import cardLightning from "@/assets/card-lightning.jpg";
import cardDream from "@/assets/card-dream.jpg";
import cardStyle from "@/assets/card-style.jpg";
import cardAllstar from "@/assets/card-allstar.jpg";
import cardJoy from "@/assets/card-joy.jpg";
import cardTrainee from "@/assets/card-trainee.jpg";

export interface TarotCardData {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  image: string;
  description: string;
  keyword: string;
  gradient: string;
}

export const tarotCards: TarotCardData[] = [
  {
    id: "basketball",
    title: "篮球之星",
    subtitle: "唱跳Rap篮球，练习时长两年半",
    emoji: "🏀",
    image: cardBasketball,
    description: "今日运势大吉！你的篮球已经充满了灵气，随便一投就是三分！记住：中分头+背带裤+篮球=无敌组合。坤坤附体，球场制霸！",
    keyword: "鸡你太美",
    gradient: "linear-gradient(135deg, hsl(190 100% 50%), hsl(220 100% 50%))",
  },
  {
    id: "chicken",
    title: "鸡你太美",
    subtitle: "只因你太美 Baby～ 不要再说了！",
    emoji: "🐔",
    image: cardChicken,
    description: "你今天的气场堪比坤坤出道夜！走到哪里都有BGM自动响起。小心不要太帅，ikun们会尖叫的。记得：鸡你太美，不是机你太美！",
    keyword: "只因你太美",
    gradient: "linear-gradient(135deg, hsl(330 100% 60%), hsl(350 100% 50%))",
  },
  {
    id: "overalls",
    title: "背带裤の力量",
    subtitle: "穿上它，你就是下一个偶像练习生",
    emoji: "👖",
    image: cardDance,
    description: "今日穿搭决定命运！一条背带裤，胜过千言万语。穿上它你就能感受到坤坤的力量在体内觉醒。建议配合中分发型食用效果更佳！",
    keyword: "背带裤YYDS",
    gradient: "linear-gradient(135deg, hsl(270 100% 60%), hsl(300 100% 50%))",
  },
  {
    id: "trainee",
    title: "练习生",
    subtitle: "练习时长两年半，终于出道了",
    emoji: "🎤",
    image: cardTrainee,
    description: "你已经练习了整整两年半！今天是你出道的日子！不管别人怎么说，你就是最努力的那个练习生。记住坤坤的名言：努力努力再努力！",
    keyword: "两年半の努力",
    gradient: "linear-gradient(135deg, hsl(45 100% 50%), hsl(30 100% 50%))",
  },
  {
    id: "music",
    title: "音乐之鸡",
    subtitle: "Music is my life，鸡你太美是我的主题曲",
    emoji: "🎵",
    image: cardInk,
    description: "今天你就是行走的jukebox！张口就是'只因你太美baby'，闭口就是'鸡你太美'。你的BGM已经准备好了，全世界都是你的KTV！",
    keyword: "全民制作人",
    gradient: "linear-gradient(135deg, hsl(150 100% 40%), hsl(180 100% 50%))",
  },
  {
    id: "allstar",
    title: "全明星MVP",
    subtitle: "你就是这条gai最靓的坤",
    emoji: "⭐",
    image: cardAllstar,
    description: "恭喜！你获得了坤坤同款MVP称号！今天无论做什么都是全场最佳。你的实力已经被全民制作人们认证了！pick你没商量！",
    keyword: "全场最佳",
    gradient: "linear-gradient(135deg, hsl(50 100% 50%), hsl(40 100% 60%))",
  },
  {
    id: "slam",
    title: "精准投篮",
    subtitle: "瞄准就投，百发百中，坤式三分",
    emoji: "🎯",
    image: cardSlam,
    description: "今天的你拥有坤坤同款篮球直觉！闭着眼睛投都能进！决策力MAX，判断力MAX。大胆出手吧，你就是篮球场上的王者！",
    keyword: "坤式三分球",
    gradient: "linear-gradient(135deg, hsl(0 100% 50%), hsl(20 100% 50%))",
  },
  {
    id: "stage",
    title: "热血舞台",
    subtitle: "It's showtime! 全民制作人们，请投票",
    emoji: "🔥",
    image: cardStage,
    description: "C位已经为你留好了！今天就是你的出道舞台！大胆展示你的唱跳rap篮球技能，全民制作人们都在等着pick你！3、2、1，你的表演开始！",
    keyword: "C位出道",
    gradient: "linear-gradient(135deg, hsl(15 100% 50%), hsl(0 100% 60%))",
  },
  {
    id: "dream",
    title: "梦想の鸡",
    subtitle: "坚持练习两年半，终会发光",
    emoji: "💫",
    image: cardDream,
    description: "追梦路上虽然会被黑，但坤坤告诉我们：被黑的最惨的时候，就是离成功最近的时候。继续坚持你的唱跳rap篮球梦想！ikun永不认输！",
    keyword: "永不放鸡",
    gradient: "linear-gradient(135deg, hsl(260 80% 60%), hsl(280 100% 50%))",
  },
  {
    id: "style",
    title: "百变坤坤",
    subtitle: "中分、背带裤、篮球，三件套齐活",
    emoji: "🎭",
    image: cardStyle,
    description: "今天适合cos坤坤！换上中分发型，穿上背带裤，拿起篮球，对着镜子来一段'鸡你太美'。你会发现一个全新的自己在向你招手！",
    keyword: "坤式变装",
    gradient: "linear-gradient(135deg, hsl(290 100% 50%), hsl(320 100% 60%))",
  },
  {
    id: "lightning",
    title: "闪电出鸡",
    subtitle: "速度与鸡情，ikun的觉醒",
    emoji: "⚡",
    image: cardLightning,
    description: "今天效率爆表！像坤坤练舞一样疯狂输出！把所有事情都用两年半的练习精神来搞定。你就是全场最快、最靓、最能打的那只鸡！",
    keyword: "效率鸡王",
    gradient: "linear-gradient(135deg, hsl(55 100% 50%), hsl(40 100% 55%))",
  },
  {
    id: "joy",
    title: "欢乐时鸡",
    subtitle: "和ikun们一起嗨翻全场",
    emoji: "🎪",
    image: cardJoy,
    description: "今天就是要开心！叫上你的ikun朋友们，一起打篮球、唱鸡你太美、跳背带裤舞！快乐就完事了！你说得对，但是鸡你太美！",
    keyword: "快乐至鸡",
    gradient: "linear-gradient(135deg, hsl(170 100% 45%), hsl(190 100% 50%))",
  },
  {
    id: "dog",
    title: "神秘の坤",
    subtitle: "你永远不知道下一秒会发生什么",
    emoji: "🐶",
    image: cardDog,
    description: "今日充满了未知和惊喜！就像坤坤的梗永远有新花样一样，你今天也会遇到意想不到的好事。保持微笑，ikun的运气不会差！",
    keyword: "意想不到",
    gradient: "linear-gradient(135deg, hsl(200 80% 50%), hsl(230 100% 55%))",
  },
];
