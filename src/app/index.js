import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-3xl font-bold text-primary">Human OS</Text>
      <Text className="text-textSecondary mt-2">Real life first.</Text>

      <Link href="/details" className="mt-5 bg-secondary px-4 py-2 rounded-lg">
        <Text className="text-white font-semibold">Get Started</Text>
      </Link>
    </View>
  );
}
