import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import useProfileStore from "../../store/profileStore";
import useAuthStore from "../../store/authStore";
import {
  requestLocationPermissions,
  getCurrentLocation,
} from "../../services/locationService";
import { useTheme } from "../../context/ThemeContext";
import { spacing, fontSize, fontWeight, borderRadius } from "../../utils/theme";

export default function Discovery() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const {
    nearbyProfiles,
    isLoading,
    fetchNearbyProfiles,
    updateUserLocation,
    profile,
    fetchProfile,
  } = useProfileStore();

  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Refresh profile to get latest sharing status
      fetchProfile();
      if (profile?.location?.isSharing) {
        setIsLocationEnabled(true);
        refreshLocation(true);
      }
    }, [])
  );

  const checkPermissions = async () => {
    try {
      await requestLocationPermissions();
      setPermissionGranted(true);
    } catch (error) {
      console.log("Permission denied");
    }
  };

  const refreshLocation = async (manualState) => {
    if (!permissionGranted) {
      await checkPermissions();
      if (!permissionGranted) return;
    }

    // Use manualState if provided, otherwise fallback to state
    const sharingStatus =
      manualState !== undefined ? manualState : isLocationEnabled;

    try {
      const location = await getCurrentLocation();
      const { latitude, longitude, accuracy } = location.coords;

      // Update server with new location
      await updateUserLocation(latitude, longitude, accuracy, sharingStatus);

      // Fetch nearby users
      if (sharingStatus) {
        await fetchNearbyProfiles(latitude, longitude, 50); // 50km radius
      }
    } catch (error) {
      console.error("Error refreshing location:", error);
      Alert.alert("Error", "Could not get your location.");
    }
  };

  const toggleLocationSharing = async (value) => {
    setIsLocationEnabled(value);
    // Pass the NEW value directly to refreshLocation to avoid stale state
    await refreshLocation(value);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/user/${item.owner._id}`)}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={24} color={colors.white} />
        {/* Placeholder for real avatar image */}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.username, { color: colors.textPrimary }]}>
            {item.fullName || item.owner.username}
          </Text>
          <Text style={[styles.distance, { color: colors.primary }]}>
            {item.distance} away
          </Text>
        </View>
        <Text
          style={[styles.bio, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.bio || "No bio available"}
        </Text>
        {item.currentStatus?.message ? (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.secondary + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.secondary }]}>
              {item.currentStatus.message}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          NowMeet
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
            {isLocationEnabled ? "Visible" : "Hidden"}
          </Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            onValueChange={toggleLocationSharing}
            value={isLocationEnabled}
          />
        </View>
      </View>

      {!isLocationEnabled ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="location-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyStateText, { color: colors.textPrimary }]}>
            Enable Location to see people nearby
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}
          >
            Your location is fuzzy for others to protect privacy.
          </Text>
          <TouchableOpacity
            style={[styles.enableButton, { backgroundColor: colors.primary }]}
            onPress={() => toggleLocationSharing(true)}
          >
            <Text style={styles.enableButtonText}>Turn On Visibility</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Finding people nearby...
          </Text>
        </View>
      ) : (
        <FlatList
          data={nearbyProfiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.owner._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyStateText, { color: colors.textSecondary }]}
              >
                No one nearby yet.
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtext,
                  { color: colors.textSecondary },
                ]}
              >
                Be the first to say hi!
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refreshLocation}
        />
      )}
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerLabel: {
    fontSize: fontSize.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  userCard: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  distance: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  bio: {
    fontSize: fontSize.sm,
  },
  statusBadge: {
    marginTop: spacing.xs,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  enableButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  enableButtonText: {
    color: "#fff",
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
  },
});
