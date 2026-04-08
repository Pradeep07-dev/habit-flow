import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      setTitle("");
      setDescription("");
      setFrequency("daily");

      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("There was an error creating the habit");
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.headerTitle}>
          Add Habit
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Build a new routine, one day at a time
        </Text>
      </View>

      <View style={styles.card}>
        <Text variant="labelLarge" style={styles.sectionLabel}>
          Habit Details
        </Text>

        <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          textColor="#22223b"
          style={styles.input}
          left={<TextInput.Icon icon="pencil-outline" />}
          placeholder="e.g. Morning Run"
          theme={{
            colors: {
              primary: "#8b85cb",
              outline: "#cccce0",
              background: "#ffffff",
              surface: "#ffffff",
            },
          }}
        />

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          textColor="#22223b"
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="text" />}
          placeholder="What does this habit involve?"
          theme={{
            colors: {
              primary: "#8b85cb",
              outline: "#cccce0",
              background: "#ffffff",
              surface: "#ffffff",
            },
          }}
        />

        <View style={styles.frequencySection}>
          <Text style={styles.sectionLabel}>Frequency</Text>
          <SegmentedButtons
            value={frequency}
            onValueChange={(value) => setFrequency(value as Frequency)}
            buttons={FREQUENCIES.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
              labelStyle: {
                color: freq === frequency ? "#ffffff" : "#22223b",
                fontWeight: "500",
              },
              style: {
                backgroundColor: freq === frequency ? "#534AB7" : "#ededf7",
                borderColor: "#cccce0",
              },
            }))}
            style={styles.segmented}
          />
        </View>

        {error ? (
          <View style={[styles.errorBox, { borderColor: theme.colors.error }]}>
            <Text style={{ color: theme.colors.error, fontSize: 13 }}>
              ⚠ {error}
            </Text>
          </View>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!title || !description}
          style={[
            styles.submitButton,
            (!title || !description) && styles.submitButtonDisabled,
          ]}
          contentStyle={styles.submitButtonContent}
          labelStyle={[
            styles.submitButtonLabel,
            (!title || !description) && styles.submitButtonLabelDisabled,
          ]}
          icon="plus-circle-outline"
        >
          Add Habit
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f0f0f7",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  headerTitle: {
    fontWeight: "700",
    color: "#22223b",
    fontSize: 32,
    lineHeight: 38,
  },
  headerSubtitle: {
    color: "#6b6b8a",
    marginTop: 4,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#22223b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  sectionLabel: {
    color: "#4a4a72",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  input: {
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },

  frequencySection: {
    marginTop: 8,
    marginBottom: 20,
  },
  segmented: {
    marginTop: 4,
  },

  errorBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#fff5f5",
  },

  submitButton: {
    borderRadius: 14,
    marginTop: 4,
  },
  submitButtonContent: {
    paddingVertical: 6,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  submitButtonDisabled: {
    opacity: 1,
  },
  submitButtonLabelDisabled: {
    color: "#e4defa",
  },
});
