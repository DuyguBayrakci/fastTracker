import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Svg, Circle, Path, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { HomeScreenProps } from '../types/navigation';
import { useFasting } from '../context/FastingContext';
import { FASTING_PLANS } from '../constants/fastingPlans';
import type { Milestone } from '../types/fasting';
import {
  WaterOutline,
  WaterFilled,
  FatBurnOutline,
  FatBurnFilled,
  FlagOutline,
  FlagFilled,
} from '../components/common/MilestoneIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.View;
const AnimatedText = Animated.Text;

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;
const STROKE_WIDTH = 20;
const CIRCLE_RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const ICON_SIZE = 40;

const SEGMENT_COLORS = ['#4A90E2', '#5DADE2', '#FF6347', '#32CD32'];

const InfoIcon = () => <Text style={styles.headerIcon}>ⓘ</Text>;
const EditIcon = () => <Text style={styles.headerIcon}>✍️</Text>;

const formatTime = (date: Date | null) => {
  if (!date) return '--:--';
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

const PROGRESS_COLOR = '#FF7043'; // Same as 'Başla' button

function getMilestoneIconComponent(milestone: Milestone, reached: boolean) {
  if (milestone.icon === '💧') {
    return reached ? <WaterFilled /> : <WaterOutline />;
  }
  if (milestone.icon === '🔥') {
    return reached ? <FatBurnFilled /> : <FatBurnOutline />;
  }
  if (milestone.icon === '🏁') {
    return reached ? <FlagFilled /> : <FlagOutline />;
  }
  // fallback: emoji
  return (
    <Text
      style={{ fontSize: 28, color: reached ? milestone.color : '#B0B0B0' }}
    >
      {milestone.icon}
    </Text>
  );
}

const MilestoneIcon = ({
  milestone,
  progressPercent,
}: {
  milestone: Milestone;
  progressPercent: number;
}) => {
  const isReached = progressPercent >= milestone.percentage;
  const angle = (milestone.percentage / 100) * 2 * Math.PI - Math.PI / 2;
  const x = CIRCLE_RADIUS * Math.cos(angle);
  const y = CIRCLE_RADIUS * Math.sin(angle);
  const left = CIRCLE_SIZE / 2 + x - ICON_SIZE / 2;
  const top = CIRCLE_SIZE / 2 + y - ICON_SIZE / 2;

  return (
    <View
      style={[
        styles.iconOnCircle,
        {
          left,
          top,
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: '#F0F0F0',
        },
      ]}
    >
      {getMilestoneIconComponent(milestone, isReached)}
    </View>
  );
};

const INITIAL_BLOGS = [
  {
    id: '1',
    title: 'Aralıklı Oruç Yolculuğuna İlk Adım: Başlangıç Rehberi',
    readMinutes: 3,
    image: require('../assets/images/aralikli-oruc-1.png'),
    isRead: false,
    content: `Aralıklı oruç yolculuğuna hoş geldiniz! Vücudunuzu hem fiziksel hem de zihinsel olarak dönüştürecek bu beslenme modeli, son yıllarda sağlıklı yaşam dünyasında oldukça popüler hale geldi.

Peki, aralıklı oruç nedir? Temel mantık, günün belirli saatlerinde yemek yemek ve kalan saatlerde oruçlu kalmaktır. Bu süreçte vücudunuz depoladığı enerjiyi kullanmaya başlar, sindirim sisteminiz dinlenir ve hücresel yenilenme süreçleri hızlanır.

Bu rehberde, yeni başlayanlar için en temel bilgileri bulacaksınız. Oruç penceresi, beslenme aralığı, su tüketimi, kafeinli içeceklerin etkisi ve dikkat edilmesi gereken ipuçları gibi konulara değineceğiz. Ayrıca sürece başlamadan önce yaş, sağlık durumu ve mevcut beslenme alışkanlıklarınızı göz önünde bulundurmanız gerektiğini unutmayın.

Hedefiniz ister kilo kontrolü, ister enerji artışı ya da daha iyi metabolizma sağlığı olsun... Bu ilk adım, aralıklı orucun sizin için nasıl bir yaşam biçimi haline gelebileceğini anlamanıza yardımcı olacak.

Hazırsanız başlayalım! İlk gününüzde kendinizi zorlamayın, vücudunuzu dinleyin ve küçük değişikliklerle adapte olmaya çalışın.

Unutmayın: Bu bir maraton, sprint değil.`,
  },
  {
    id: '2',
    title: 'Güne Oruçla Başla: İlk Sabah Deneyimin',
    readMinutes: 3,
    image: require('../assets/images/aralikli-oruc-2.png'),
    isRead: false,
    content: `Yeni bir güne uyanmak… Ve bugün farklı bir şey yapmak için harika bir fırsat!

İlk aralıklı oruç deneyiminize başlamak için ihtiyacınız olan şey aslında oldukça basit: Kararlılık ve biraz sabır. Sabah uyandığınızda açlık hissine odaklanmak yerine, enerjinizi başka şeylere yönlendirin. Su için, yürüyüş yapın, meditasyon ya da hafif esneme hareketleri ile güne başlayın.

İlk saatlerde açlığın gelip geçici olduğunu fark edeceksiniz. Vücudunuz alıştıkça bu süreç daha da kolaylaşacak. İlk günlerde kendinize şunu hatırlatın: Bu sadece bir başlangıç. Vücudunuzun yeni ritmine uyum sağlaması için zamana ihtiyacı var.

Güneş doğuyor, sen de kendi değişim yolculuğuna adım atıyorsun. Şimdi nefes al, su iç ve sabırlı ol. Başarıya doğru ilk adımı attın bile!`,
  },
  {
    id: '3',
    title: 'Zaman ve Tabağın Dengesi: Aralıklı Oruç Mantığı',
    readMinutes: 3,
    image: require('../assets/images/aralikli-oruc-3.png'),
    isRead: false,
    content: `Aralıklı oruç, zamanla yemek arasındaki dengeyi kurma sanatıdır. Bu beslenme modeli, günün belirli saatlerinde yemek yemeyi ve kalan saatlerde sindirim sisteminize dinlenme fırsatı vermeyi hedefler.

Görselde gördüğünüz gibi, bir taraf yemek zamanı (tabağın olduğu kısım), diğer taraf ise oruç süreci (saatin olduğu kısım) olarak düşünülebilir. En yaygın uygulamalardan biri 16/8 yöntemi: 16 saat boyunca oruç, 8 saat boyunca yemek.

Bu düzen sadece kilo kontrolüne yardımcı olmakla kalmaz, aynı zamanda metabolizmanızı destekler, insülin duyarlılığınızı artırır ve enerji seviyelerinizi daha dengeli hale getirir.

Unutmayın: Aralıklı oruç, bir diyet değil, sürdürülebilir bir yaşam tarzı seçimidir. Başlangıçta zorlayıcı olabilir, ama vücudunuz zamanla bu ritme uyum sağlayacaktır.`,
  },
  {
    id: '4',
    title: 'Kalori Saymayı Bırak: Aralıklı Oruç ile Doğal Dengeni Bul',
    readMinutes: 4,
    image: require('../assets/images/aralikli-oruc-4.png'),
    isRead: false,
    content: `Klasik diyetlerde sürekli kalori hesabı yapmak zorunda kalabilirsiniz. Ancak aralıklı oruçta mesele sadece sayılar değil… Asıl amaç, vücudunuzun biyolojik ritmine uygun şekilde doğal açlık-tokluk dengesini bulmak.

Aralıklı oruç sayesinde metabolizmanız kendi yağ yakma mekanizmalarını daha etkili kullanır. Sürekli 'kaç kalori yedim?' stresinden kurtulursunuz.

Vücudunuzu açlık ve tokluk döngüsüne alıştırdığınızda, yediklerinizin kalitesine odaklanmanız yeterli olur. Daha az ama daha besleyici öğünlerle daha uzun süre tok kalabilirsiniz.

Bu yeni yaklaşım, sürdürülebilir bir yaşam tarzı değişimi için güçlü bir adımdır.`,
  },
  {
    id: '5',
    title: 'Sabah Kahvesi Oruç Bozar mı? Bilim Ne Diyor?',
    readMinutes: 4,
    image: require('../assets/images/aralikli-oruc-5.png'),
    isRead: false,
    content: `Oruç sırasında kahve içmek, özellikle sabahları açlığı bastırmak isteyenler için yaygın bir tercih.

Peki gerçekten orucu bozar mı? Cevap: İçeriğine bağlı!

Şekersiz, sütsüz ve kremasız sade filtre kahve veya Türk kahvesi, genelde orucu bozmaz ve hatta açlık hissini bastırarak süreci kolaylaştırabilir. Fakat şeker, süt veya aromalı krema eklediğinizde metabolik tepkiler başlayabilir ve bu durum orucu bozabilir.

Bilimsel çalışmalar, sade kahvenin vücuttaki ketoz sürecine ciddi bir etkisi olmadığını gösteriyor.

Ancak unutmayın: Her vücut farklıdır. Kahve tüketimi sonrasında baş dönmesi, mide rahatsızlığı ya da çarpıntı hissederseniz, miktarı azaltmanızda fayda var.`,
  },
];
function BlogCard({
  blog,
  onPress,
}: {
  blog: (typeof INITIAL_BLOGS)[0];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.blogCard} onPress={onPress}>
      <Image source={blog.image} style={styles.blogImage} />
      <View style={styles.blogTextContainer}>
        <Text style={styles.blogTitle}>{blog.title}</Text>
        <Text style={styles.blogReadTime}>{blog.readMinutes} dk'lık okuma</Text>
      </View>
      <View style={styles.blogIconContainer}>
        {blog.isRead ? (
          <Ionicons name="checkmark" size={24} color="#ff7043" />
        ) : (
          <Ionicons name="chevron-forward" size={24} color="#ff7043" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const { state, startTimer, pauseTimer, resetTimer, initializeNotifications } =
    useFasting();
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.readBlogId) {
        setBlogs(prev =>
          prev.map(b =>
            b.id === route.params.readBlogId ? { ...b, isRead: true } : b,
          ),
        );
        navigation.setParams({ readBlogId: undefined });
      }
    }, [route.params]),
  );

  const formatRunningTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const planDetails = useMemo(
    () => FASTING_PLANS[state.fastingPlan],
    [state.fastingPlan],
  );
  const milestones = useMemo(
    () => planDetails?.milestones || [],
    [planDetails],
  );

  const getProgressFraction = () => {
    if (!planDetails) return 0;
    const totalTime = planDetails.durationSeconds;
    if (totalTime === 0) return 0;
    if (!state.isRunning) return 0;
    const progress = (totalTime - state.timeLeft) / totalTime;
    return progress > 1 ? 1 : progress;
  };

  const progressFraction = getProgressFraction();
  const progressPercent = progressFraction * 100;

  const activeMilestone = useMemo(() => {
    if (!state.isRunning) return null;
    return (
      [...milestones].reverse().find(m => progressPercent >= m.percentage) ||
      null
    );
  }, [milestones, progressPercent, state.isRunning]);

  const colorAnimation = useSharedValue(0);
  const infoCardAnimation = useSharedValue(0);

  const progressBarColor = useMemo(() => {
    if (!state.isRunning) return '#E0E0E0';
    return PROGRESS_COLOR;
  }, [state.isRunning]);

  useEffect(() => {
    const activeIndex = !activeMilestone
      ? -1
      : milestones.findIndex(m => m.name === activeMilestone.name);
    colorAnimation.value = withTiming(activeIndex + 1, { duration: 500 });
    infoCardAnimation.value = withTiming(activeMilestone ? 1 : 0, {
      duration: 400,
    });
  }, [activeMilestone, colorAnimation, infoCardAnimation]);

  const animatedSvgProps = useAnimatedProps(() => {
    return { stroke: state.isRunning ? PROGRESS_COLOR : '#E0E0E0' };
  });

  const animatedInfoCardStyle = useAnimatedProps(() => {
    return {
      opacity: infoCardAnimation.value,
      transform: [{ translateY: (1 - infoCardAnimation.value) * 20 }],
    };
  });

  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progressFraction);

  const calculateStreak = () => {
    const completedSessions = state.sessions.filter(
      s => s.status === 'completed',
    );
    if (completedSessions.length === 0) return 0;
    const sortedSessions = completedSessions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    let streak = 0;
    let lastDate = new Date();

    const sessionDate = new Date(sortedSessions[0].createdAt);
    if (
      sessionDate.getFullYear() === lastDate.getFullYear() &&
      sessionDate.getMonth() === lastDate.getMonth() &&
      sessionDate.getDate() === lastDate.getDate()
    ) {
      streak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        sessionDate.getFullYear() === yesterday.getFullYear() &&
        sessionDate.getMonth() === yesterday.getMonth() &&
        sessionDate.getDate() === yesterday.getDate()
      ) {
        streak = 1;
        lastDate = yesterday;
      } else {
        return 0;
      }
    }

    for (let i = 1; i < sortedSessions.length; i++) {
      const currentSessionDate = new Date(sortedSessions[i].createdAt);
      const expectedPreviousDate = new Date(lastDate);
      expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);

      if (
        currentSessionDate.getFullYear() ===
          expectedPreviousDate.getFullYear() &&
        currentSessionDate.getMonth() === expectedPreviousDate.getMonth() &&
        currentSessionDate.getDate() === expectedPreviousDate.getDate()
      ) {
        streak++;
        lastDate = currentSessionDate;
      } else {
        break;
      }
    }
    return streak;
  };
  const streak = calculateStreak();

  const renderTimerContent = () => {
    if (state.isRunning) {
      return (
        <>
          <Text style={styles.timerLabel}>Kalan Süre</Text>
          <Text style={styles.timerText}>
            {formatRunningTime(state.timeLeft)}
          </Text>
        </>
      );
    }
    const hours = planDetails ? planDetails.fastingHours : '...';
    return (
      <>
        <Text style={styles.timerLabel}>Yaklaşan Oruç</Text>
        <Text style={styles.timerText}>{hours} saat</Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oruç</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.planDisplayButton}
            onPress={() => navigation.navigate('Plans', { screen: 'PlanList' })}
          >
            <Text style={styles.planText}>{state.fastingPlan}</Text>
            <Svg width={22} height={22} viewBox="0 0 32 32">
              <Path
                d="M22 6l4 4-14 14H8v-4z"
                fill="none"
                stroke="#ff7043"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              <Rect
                x="21.5"
                y="5.5"
                width="3"
                height="7"
                rx="1"
                transform="rotate(45 21.5 5.5)"
                fill="none"
                stroke="#ff7043"
                strokeWidth={1.5}
              />
              <Path
                d="M5 28h22"
                stroke="#ff7043"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <InfoIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timerWrapper}>
          <Svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
          >
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke="#f0f0f0"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <AnimatedCircle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              animatedProps={animatedSvgProps}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>

          <View style={styles.timerTextContainer}>{renderTimerContent()}</View>

          {milestones.map((milestone, idx) => (
            <MilestoneIcon
              key={milestone.name + idx}
              milestone={milestone}
              progressPercent={progressPercent}
            />
          ))}
        </View>

        {state.isRunning ? (
          <>
            <View style={styles.timeInfoContainer}>
              <View style={styles.timeInfoItem}>
                <Text style={styles.timeInfoValue}>
                  {formatTime(state.startTime)}
                </Text>
                <Text style={styles.timeInfoLabel}>Başla, bugün</Text>
              </View>
              <View style={styles.timeInfoItem}>
                <Text style={styles.timeInfoValue}>
                  {formatTime(state.endTime)}
                </Text>
                <Text style={styles.timeInfoLabel}>Hedef, yarın</Text>
              </View>
            </View>
            <TouchableOpacity onPress={pauseTimer} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>ORUCU BİTİR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startTimer} style={styles.mainButton}>
              <Text style={styles.mainButtonText}>ORUCA BAŞLA</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Sıfırla</Text>
            </TouchableOpacity> */}
          </View>
        )}

        <AnimatedView style={[styles.infoCard, animatedInfoCardStyle]}>
          {activeMilestone && (
            <>
              <Text style={styles.infoCardTitle}>
                {activeMilestone.icon} {activeMilestone.name}
              </Text>
              <Text style={styles.infoCardDescription}>
                {activeMilestone.description}
              </Text>
              <TouchableOpacity>
                <Text style={styles.infoCardLink}>Daha fazla bilgi</Text>
              </TouchableOpacity>
            </>
          )}
        </AnimatedView>

        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.sessions.length}</Text>
            <Text style={styles.statLabel}>Toplam Oruç</Text>
          </View>
        </View>

        <View style={{ width: '100%', marginTop: 32 }}>
          <Text style={styles.blogSectionTitle}>Oruç Hakkında Bilgiler</Text>
          <FlatList
            data={blogs}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <BlogCard
                blog={item}
                onPress={() => {
                  navigation.navigate('BlogDetail', { blog: item });
                }}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },
  planText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    backgroundColor: '#f0f0f0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 16,
  },
  headerInfoIcon: {},
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  timerWrapper: {
    position: 'relative',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  svg: {
    position: 'absolute',
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 18,
    color: '#a0a0a0',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'monospace',
  },
  iconOnCircle: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  icon: {
    fontSize: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  mainButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 14,
    marginTop: 14,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  resetButtonText: {
    color: '#a0a0a0',
    fontSize: 16,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  timeInfoItem: {
    alignItems: 'center',
  },
  timeInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeInfoLabel: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  stopButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  stopButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 15,
    width: '90%',
    marginTop: 10,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  infoCardLink: {
    fontSize: 14,
    color: '#FF7043',
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#c7c7c7',
    textAlign: 'center',
    marginTop: 20,
  },
  blogSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff7043',
    marginBottom: 16,
    marginLeft: 20,
  },
  blogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  blogImage: {
    width: 84,
    height: 84,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#f5f5f5',
  },
  blogTextContainer: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  blogReadTime: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  blogIconContainer: {
    marginLeft: 10,
  },
  blogCheck: {
    fontSize: 20,
    color: '#ff7043',
  },
  blogArrow: {
    fontSize: 22,
    color: '#ff7043',
  },
});
