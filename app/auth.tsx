import { useAuth } from "@/lib/auth-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      router.replace("/");
    }
  };

  const inputTheme = {
    colors: {
      primary: "#8b85cb",
      outline: "#cccce0",
      background: "#ffffff",
      surface: "#ffffff",
    },
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen
        name="auth"
        options={{
          title: "HabitFlow",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#534AB7",
            fontSize: 24,
            fontWeight: 600,
          },
        }}
      />
      <View style={styles.topBand} />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <FontAwesome5 name="check-circle" size={40} color="#ffffff" />
        </View>

        <Text style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? "Start building better habits today"
            : "Sign in to track your habits"}
        </Text>

        <View style={styles.card}>
          <TextInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            textColor="#22223b"
            placeholderTextColor="#aaaacc"
            left={<TextInput.Icon icon="email-outline" />}
            theme={inputTheme}
          />

          <TextInput
            label="Password"
            autoCapitalize="none"
            mode="outlined"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            textColor="#22223b"
            placeholderTextColor="#aaaacc"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off-outline" : "eye-outline"}
                onPress={() => setShowPassword((p) => !p)}
              />
            }
            theme={inputTheme}
          />

          {error ? (
            <View style={[styles.errorBox]}>
              <Text
                style={{
                  color: theme.colors.error,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={14}
                  color={theme.colors.error}
                />
                {error}
              </Text>
            </View>
          ) : null}

          <Button
            mode="contained"
            onPress={handleAuth}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor="#534AB7"
            icon={isSignUp ? "account-plus-outline" : "login"}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </View>

        <Button
          mode="text"
          onPress={() => setIsSignUp((prev) => !prev)}
          style={styles.switchModeButton}
          labelStyle={styles.switchModeLabel}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f7",
  },

  topBand: {
    height: 220,
    backgroundColor: "#534AB7",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#7c74d4",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: "#534AB7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#cdc8f0",
    textAlign: "center",
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#22223b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  input: {
    marginBottom: 14,
    backgroundColor: "#ffffff",
  },

  errorBox: {
    borderWidth: 1,
    borderColor: "#e53935",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff5f5",
  },

  button: {
    borderRadius: 14,
    marginTop: 4,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.3,
  },

  switchModeButton: {
    marginTop: 20,
  },
  switchModeLabel: {
    color: "#534AB7",
    fontSize: 13,
  },
});
