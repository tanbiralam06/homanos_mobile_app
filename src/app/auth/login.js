import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      router.replace("/"); // Go to Home on success
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-background">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-primary mb-2">
          Welcome Back
        </Text>
        <Text className="text-lg text-textSecondary">
          Sign in to continue connection.
        </Text>
      </View>

      {error && (
        <View className="bg-red-100 p-3 rounded-lg mb-4">
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      <View className="space-y-4">
        <View>
          <Text className="text-textSecondary mb-1 ml-1">Email</Text>
          <TextInput
            className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 text-textPrimary"
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mt-4">
          <Text className="text-textSecondary mb-1 ml-1">Password</Text>
          <TextInput
            className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 text-textPrimary"
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-xl items-center mt-6"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Log In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-8">
        <Text className="text-textSecondary">Don't have an account? </Text>
        <Link href="/auth/signup" asChild>
          <TouchableOpacity>
            <Text className="text-secondary font-bold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
