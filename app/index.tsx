import { SafeContainer } from "@/components/layout/SafeContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/design/tokens/colors";
import { spacing } from "@/design/tokens/spacing";
import { typography } from "@/design/tokens/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native";

export default function Home() {
  const router = useRouter();
  const [moodText, setMoodText] = useState("");

  const handleRecommend = () => {
    if (moodText.trim()) {
      router.push({
        pathname: "/result",
        params: { text: moodText },
      });
    }
  };

  const handleHistory = () => {
    router.push({
      pathname: "/history",
    });
  };

  return (
    <SafeContainer backgroundColor={colors.backgroundLight}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.container}>
            {/* 히스토리 버튼 */}
            <TouchableOpacity
              style={styles.historyButton}
              onPress={handleHistory}
              activeOpacity={0.7}
            >
              <Text style={styles.historyButtonText}>📅 히스토리</Text>
            </TouchableOpacity>

            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>지금 기분은 어때요?</Text>
              <Text style={styles.subtitle}>지금의 감정을 한 문장으로 적어보세요</Text>
            </View>

            {/* 입력 박스 */}
            <Input
              value={moodText}
              onChangeText={setMoodText}
              placeholder="예: 오늘은 너무 지치고, 위로가 필요해..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              tip='💡 팁: 상황과 감정을 같이 적으면 추천이 더 정확해져요'
            />

            {/* 추천 버튼 */}
            <View style={{ marginTop: spacing.xl }}>
              <Button
                title={moodText.trim() ? "결과 보기" : "텍스트를 입력해주세요"}
                onPress={handleRecommend}
                disabled={!moodText.trim()}
                variant="primary"
                size="large"
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.xxl,
    backgroundColor: colors.backgroundLight,
  },
  historyButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
    marginTop: spacing.lg,
  },
  historyButtonText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  header: {
    marginTop: spacing.huge,
    marginBottom: spacing.xxxl, // 간격 증가 (기존: spacing.xl)
  },

  title: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 36,
  },

  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
});
