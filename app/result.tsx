import { ChatCard } from "@/components/features/chat/ChatCard";
import { EncouragementMessage } from "@/components/features/recommendation/EncouragementMessage";
import { ScentCard } from "@/components/features/recommendation/ScentCard";
import { SongCard } from "@/components/features/recommendation/SongCard";
import { SafeContainer } from "@/components/layout/SafeContainer";
import { Button } from "@/components/ui/Button";
import { RippleLoading } from "@/components/ui/RippleLoading";
import { colors } from "@/design/tokens/colors";
import { spacing } from "@/design/tokens/spacing";
import { typography } from "@/design/tokens/typography";
import { useMoodHistory } from "@/hooks/useMoodHistory";
import { useMoodRecommendation } from "@/hooks/useMoodRecommendation";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";
import { analyzeMoodText } from "@/lib/moodAnalyzer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ text?: string }>();
  const text = (params.text ?? "").toString();

  const { loading, result, error, refetch } = useMoodRecommendation(text);
  const { addEntry } = useMoodHistory();
  
  // 결과가 나오면 히스토리에 저장
  useEffect(() => {
    if (result && text) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const moodAnalysis = analyzeMoodText(text);
      addEntry({
        date: today,
        text: text,
        result: result.result,
        song: result.song,
        scent: result.scent,
        moodScore: moodAnalysis.score, // 감정 점수 저장
      }).catch((err: unknown) => {
        console.error('히스토리 저장 실패:', err);
      });
    }
  }, [result, text, addEntry]);
  
  // 순차적 애니메이션: EncouragementMessage, SongCard, ScentCard, ChatCard, Button
  const itemCount = result ? (1 + (result.song ? 1 : 0) + (result.scent ? 1 : 0) + 1 + 1) : 0;
  const { getAnimatedStyle } = useStaggeredAnimation({
    itemCount,
    delay: 150,
    duration: 500,
    startDelay: 200, // 로딩이 끝난 후 200ms 후 시작
  });

  const handleRetry = () => {
    refetch();
  };

  const handleChat = () => {
    router.push({
      pathname: "/chat",
      params: { text: text },
    });
  };

  return (
    <SafeContainer style={{ backgroundColor: colors.backgroundLight }}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >

        {/* 로딩 */}
        {loading && <RippleLoading loading={loading} />}

        {/* 에러 */}
        {!loading && !!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>😢</Text>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>오류가 발생했어요</Text>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
            <View style={styles.errorButtons}>
              <Button
                title="다시 시도 🔄"
                onPress={handleRetry}
                variant="primary"
                size="medium"
                style={styles.errorRetryButton}
              />
              <Button
                title="돌아가기 ←"
                onPress={() => router.back()}
                variant="ghost"
                size="medium"
                style={styles.backButton}
              />
            </View>
          </View>
        )}

        {/* 결과 */}
        {!loading && !error && result && (
          <View style={styles.resultContainer}>
            {/* 위로 메시지 (AI 기반) */}
            <Animated.View style={getAnimatedStyle(0)}>
              <EncouragementMessage message={result.result} />
            </Animated.View>

            {/* 오늘의 노래 */}
            {result.song && (
              <Animated.View style={getAnimatedStyle(1)}>
                <SongCard song={result.song} />
              </Animated.View>
            )}

            {/* 오늘의 향 */}
            {result.scent && (
              <Animated.View style={getAnimatedStyle(result.song ? 2 : 1)}>
                <ScentCard scent={result.scent} />
              </Animated.View>
            )}

            {/* AI 채팅 카드 */}
            <Animated.View style={getAnimatedStyle(
              (result.song ? 1 : 0) + (result.scent ? 1 : 0) + 1
            )}>
              <ChatCard onPress={handleChat} />
            </Animated.View>

            {/* 다시 해보기 버튼 */}
            <Animated.View style={getAnimatedStyle(
              (result.song ? 1 : 0) + (result.scent ? 1 : 0) + 2
            )}>
              <Button
                title="다시 해보기"
                onPress={() => router.push({ pathname: "/", params: {} })}
                variant="ghost"
                size="large"
                fullWidth
                style={{ ...styles.retryButton, backgroundColor: colors.backgroundLight }}
                textStyle={{ color: colors.text.primary }}
              />
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingTop: spacing.lg, // 상단 패딩 줄임
    paddingBottom: spacing.huge,
  },
  errorContainer: {
    marginTop: spacing.huge,
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 50,
  },
  errorContent: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  errorButtons: {
    flexDirection: "row",
    marginTop: spacing.xl,
    width: "100%",
  },
  errorRetryButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  resultContainer: {
    marginTop: spacing.xl, // 위로 메시지 위쪽 여백 (값 조정 가능)
  },
  retryButton: {
    marginTop: spacing.lg,
  },
});
