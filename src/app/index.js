import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../utils/theme";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Human OS</Text>
      <Text style={styles.subtitle}>Real life first.</Text>

      <Link href="/details" style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
});
