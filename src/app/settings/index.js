import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Settings() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Appearance
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={22}
                  color={colors.textPrimary}
                />
                <Text
                  style={[styles.menuItemText, { color: colors.textPrimary }]}
                >
                  Dark Mode
                </Text>
              </View>
              <View
                style={[
                  styles.toggleOuter,
                  { backgroundColor: isDark ? colors.primary : colors.border },
                ]}
              >
                <View
                  style={[
                    styles.toggleInner,
                    {
                      backgroundColor: colors.white,
                      transform: [{ translateX: isDark ? 20 : 2 }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Account
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/settings/account")}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.textPrimary}
                />
                <Text
                  style={[styles.menuItemText, { color: colors.textPrimary }]}
                >
                  Account Details
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/settings/privacy")}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.textPrimary}
                />
                <Text
                  style={[styles.menuItemText, { color: colors.textPrimary }]}
                >
                  Privacy & Security
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Support
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color={colors.textPrimary}
                />
                <Text
                  style={[styles.menuItemText, { color: colors.textPrimary }]}
                >
                  Help Center
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={colors.error}
                />
                <Text style={[styles.menuItemText, { color: colors.error }]}>
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  divider: {
    height: 1,
    marginLeft: spacing.lg,
  },
  toggleOuter: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  toggleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
