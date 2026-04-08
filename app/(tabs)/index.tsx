import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text>Welcome to Habit Tracker.</Text>
      <Link style={styles.link} href="/login">
        Login Page
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    backgroundColor: "coral",
    width: 110,
    height: 35,
    textAlign: "center",
    alignContent: "center",
    borderRadius: 8,
  },
});
