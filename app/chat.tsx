import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/features/chat/ChatMessage";
import { ChatInput } from "@/components/features/chat/ChatInput";
import { ChatLoadingDots } from "@/components/features/chat/ChatLoadingDots";
import { colors } from "@/design/tokens/colors";
import { typography } from "@/design/tokens/typography";
import { spacing } from "@/design/tokens/spacing";

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ text?: string }>();
  const originalMood = (params.text ?? "").toString();
  const insets = useSafeAreaInsets();

  const {
    chatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    sendChatMessage,
    scrollViewRef,
  } = useChat(originalMood);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.backButton} onTouchEnd={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI 감정 채팅</Text>
          <Text style={styles.headerSubtitle}>편하게 이야기해보세요</Text>
        </View>
      </View>

      {/* 채팅 메시지 영역 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {chatMessages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {chatLoading && <ChatLoadingDots />}
      </ScrollView>

      {/* 입력 영역 */}
      <ChatInput
        value={chatInput}
        onChangeText={setChatInput}
        onSend={() => sendChatMessage(chatInput)}
        loading={chatLoading}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight, // 흰색 배경
  },
  header: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  backIcon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.captionSmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundLight, // 흰색 배경
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.backgroundLight, // 흰색 배경
  },
});
